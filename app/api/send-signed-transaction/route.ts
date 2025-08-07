import { NextRequest, NextResponse } from 'next/server'
import { Connection, PublicKey } from '@solana/web3.js'

export async function POST(request: NextRequest) {
  console.log('🔄 Send Signed Transaction API called')
  console.log('📅 Timestamp:', new Date().toISOString())

  try {
    console.log('📥 Parsing request body...')
    const body = await request.json()
    console.log('📥 Request body keys:', Object.keys(body))
    console.log('📥 Request body structure:', {
      hasSignedTransaction: !!body.signedTransaction,
      signedTransactionLength: body.signedTransaction?.length,
      hasMintAddress: !!body.mintAddress,
      mintAddress: body.mintAddress
    })
    
    const { signedTransaction, mintAddress } = body

    console.log('🔍 Validating required fields...')
    console.log('Mint Address:', mintAddress)
    console.log('Signed Transaction exists:', !!signedTransaction)
    console.log('Signed Transaction length:', signedTransaction?.length)

    if (!signedTransaction || !mintAddress) {
      console.error('❌ Missing required fields')
      console.error('signedTransaction:', !!signedTransaction)
      console.error('mintAddress:', !!mintAddress)
      return NextResponse.json(
        { error: 'Missing required fields: signedTransaction, mintAddress' },
        { status: 400 }
      )
    }

    console.log('🔧 Sending signed transaction to Solana network...')

    // Create connection to Solana using QuickNode or fallback
    console.log('🔗 Creating Solana connection...')
    const rpcUrl = process.env.QUICKNODE_RPC || 
                   process.env.NEXT_PUBLIC_QUICKNODE_RPC || 
                   'https://api.mainnet-beta.solana.com'
    console.log('🔗 Using RPC endpoint:', rpcUrl)
    const connection = new Connection(rpcUrl, 'confirmed')
    console.log('✅ Solana connection created')

    // Convert base64 string to Transaction
    console.log('📝 Converting base64 transaction...')
    console.log('📝 Base64 transaction length:', signedTransaction.length)
    console.log('📝 Base64 transaction preview:', signedTransaction.substring(0, 50) + '...')
    
    const { Transaction } = await import('@solana/web3.js')
    console.log('📝 Creating buffer from base64...')
    const decodedTransaction = Buffer.from(signedTransaction, 'base64')
    console.log('📝 Decoded transaction buffer length:', decodedTransaction.length)
    console.log('📝 Decoded transaction preview:', decodedTransaction.slice(0, 50))
    
    console.log('📝 Converting buffer to Transaction...')
    const recoveredTransaction = Transaction.from(decodedTransaction)
    console.log('✅ Transaction recovered successfully')
    console.log('📝 Transaction instructions count:', recoveredTransaction.instructions.length)
    console.log('📝 Transaction signatures count:', recoveredTransaction.signatures.length)
    
    // Log each instruction in the recovered transaction
    recoveredTransaction.instructions.forEach((instruction, index) => {
      console.log(`📝 Recovered instruction ${index}:`, {
        programId: instruction.programId.toString(),
        keys: instruction.keys.map(key => ({
          pubkey: key.pubkey.toString(),
          isSigner: key.isSigner,
          isWritable: key.isWritable
        })),
        dataLength: instruction.data.length
      })
    })
    
    // Log each signature in the recovered transaction
    recoveredTransaction.signatures.forEach((signature, index) => {
      console.log(`📝 Recovered signature ${index}:`, {
        publicKey: signature.publicKey.toString(),
        signature: signature.signature ? 'SIGNED' : 'NOT_SIGNED'
      })
    })

    // Send the transaction as-is (already signed by Phantom)
    console.log('📤 Sending transaction with Phantom signature...')
    const signedTransactionBuffer = recoveredTransaction.serialize({
      requireAllSignatures: false,
      verifySignatures: false
    })
    console.log('✅ Transaction fully signed and serialized')
    console.log('📝 Serialized transaction length:', signedTransactionBuffer.length)
    console.log('📝 Serialized transaction preview:', signedTransactionBuffer.slice(0, 50))
    
    // Send the signed transaction
    console.log('📤 Sending transaction to Solana...')
    console.log('📤 Using RPC endpoint:', rpcUrl)
    
    let signature: string | undefined
    
    try {
      signature = await connection.sendRawTransaction(signedTransactionBuffer, {
        skipPreflight: false,
        preflightCommitment: 'confirmed',
        maxRetries: 3
      })
      console.log('✅ Transaction sent to Solana network')
      console.log('📝 Transaction signature:', signature)
      
      // Wait for confirmation
      console.log('⏳ Waiting for transaction confirmation...')
      const confirmation = await connection.confirmTransaction(signature, 'confirmed')
      console.log('📝 Confirmation result:', confirmation)

      if (confirmation.value.err) {
        console.error('❌ Transaction failed during confirmation')
        throw new Error(`Transaction failed: ${confirmation.value.err}`)
      }

      console.log('🎉 Transaction sent and confirmed successfully!')
      console.log('Transaction Signature:', signature)
      
    } catch (error) {
      console.error('❌ Failed to send transaction to Solana')
      console.error('❌ Error details:', error)
      
      // Try to get more detailed error information
      if (error && typeof error === 'object' && 'logs' in error) {
        console.error('❌ Transaction logs:', error.logs)
      }
      
      // Try to get recent transaction status
      if (signature) {
        try {
          const status = await connection.getSignatureStatus(signature)
          console.error('❌ Transaction status:', status)
        } catch (statusError) {
          console.error('❌ Could not get transaction status:', statusError)
        }
      }
      
      throw error
    }

    return NextResponse.json({
      success: true,
      message: 'Transaction sent and confirmed successfully',
      mintAddress: mintAddress,
      transactionSignature: signature,
      nftDetails: {
        mintAddress: mintAddress,
        transactionSignature: signature,
        explorerUrl: `https://explorer.solana.com/address/${mintAddress}?cluster=mainnet-beta`,
        transactionUrl: `https://explorer.solana.com/tx/${signature}?cluster=mainnet-beta`
      }
    })

  } catch (error) {
    console.error('💥 Error in send-signed-transaction API:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : 'Unknown'
    })

    return NextResponse.json(
      {
        error: 'Failed to send signed transaction',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 