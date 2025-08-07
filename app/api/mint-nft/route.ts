import { NextRequest, NextResponse } from 'next/server'
import { createNft, mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata'
import {
  generateSigner,
  percentAmount,
  signerIdentity,
  publicKey,
} from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { base58 } from '@metaplex-foundation/umi/serializers'

export async function POST(request: NextRequest) {
  console.log('🔧 Initializing UMI for production minting...')
  
  try {
    const { imageUrl, description, userWalletAddress } = await request.json()
    
    console.log('📝 Description:', description)
    console.log('📝 Image URL:', imageUrl)
    console.log('📝 User Wallet Address:', userWalletAddress)
    
    if (!userWalletAddress) {
      throw new Error('User wallet address is required')
    }
    
    // Create UMI instance
    const umi = createUmi(process.env.QUICKNODE_RPC || 'https://api.mainnet-beta.solana.com')
      .use(mplTokenMetadata())
    
    // Generate a temporary signer for the server (just for building the transaction)
    const tempSigner = generateSigner(umi)
    console.log('🔧 Temporary signer set for UMI:', tempSigner.publicKey)
    
    // Set the signer identity temporarily
    umi.use(signerIdentity(tempSigner))
    
    // Generate the NFT mint signer
    const mintSigner = generateSigner(umi)
    console.log('🎯 Mint signer generated:', mintSigner.publicKey)
    
    // Create the NFT builder but don't send yet
    console.log('🎨 Creating NFT transaction...')
    const builder = createNft(umi, {
      mint: mintSigner,
      sellerFeeBasisPoints: percentAmount(5.5),
      name: 'Candle TV Mascot',
      uri: 'https://example.com/metadata.json', // Using mock URI for now
    })
    
    // Get the transaction without sending it
    console.log('📝 Building unsigned transaction...')
    const transactionWithBlockhash = await builder.setLatestBlockhash(umi)
    const transaction = await transactionWithBlockhash.build(umi)
    
    console.log('✅ Transaction created successfully')
    console.log('📤 Returning unsigned transaction for client-side signing')
    
    return NextResponse.json({
      success: true,
      message: 'Transaction created successfully. Please sign with your Phantom wallet.',
      transaction: {
        mintAddress: mintSigner.publicKey,
        transactionData: transaction,
        requiresClientSigning: true
      }
    })
    
  } catch (error) {
    console.error('❌ Error creating NFT transaction:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : 'Unknown'
    })
    
    return NextResponse.json(
      { 
        error: 'Failed to create NFT transaction',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

