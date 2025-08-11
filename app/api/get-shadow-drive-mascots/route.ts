import { NextRequest, NextResponse } from 'next/server'
import { Connection, Keypair, PublicKey } from '@solana/web3.js'
import { ShdwDrive } from '@shadow-drive/sdk'
import bs58 from 'bs58'
import nacl from 'tweetnacl'

const STORAGE_ACCOUNT_ADDRESS = '9ZtxtPqwbZNP8x9Sc8JpycjuVPiaT2DqBomXxYsXgVEU'

export async function GET(request: NextRequest) {
  console.log('🔄 Shadow Drive Mascots API called')
  console.log('📅 Timestamp:', new Date().toISOString())
  
  try {
    // Check if private key is available for Shadow Drive
    const PRIVATE_KEY = process.env.SHADOW_DRIVE_PRIVATE_KEY
    if (!PRIVATE_KEY) {
      console.log('❌ SHADOW_DRIVE_PRIVATE_KEY environment variable not set')
      return NextResponse.json(
        { error: 'Shadow Drive not configured' },
        { status: 503 }
      )
    }

    // Create Solana keypair for Shadow Drive
    const solanaKeypair = Keypair.fromSecretKey(bs58.decode(PRIVATE_KEY))
    
    // Get RPC URL
    const rpcUrl = process.env.QUICKNODE_RPC || 
                  process.env.NEXT_PUBLIC_QUICKNODE_RPC || 
                  'https://blue-aged-tab.solana-mainnet.quiknode.pro/83eaeacbf72cf08a1c44128a775b0e3606cb6c6c/'
    
    if (!rpcUrl) {
      throw new Error('No RPC URL available')
    }
    
    // Initialize Shadow Drive SDK
    const connection = new Connection(rpcUrl, {
      commitment: 'confirmed',
      confirmTransactionInitialTimeout: 90000,
      wsEndpoint: rpcUrl.replace('https://', 'wss://'),
    })
    
    // Create wallet object for Shadow Drive
    const wallet = {
      publicKey: solanaKeypair.publicKey,
      payer: solanaKeypair,
      signMessage: async (message: Uint8Array) => {
        const signature = nacl.sign.detached(message, solanaKeypair.secretKey)
        return signature
      }
    }
    
    // Initialize Shadow Drive
    console.log('🚀 Initializing Shadow Drive...')
    const shdwDrive = new ShdwDrive(connection, wallet)
    await shdwDrive.init()
    console.log('✅ Shadow Drive initialized successfully')
    
    // Get storage account info
    const storageAccounts = await shdwDrive.getStorageAccounts()
    console.log('📁 Available storage accounts:', storageAccounts.map(acc => acc.publicKey.toString()))
    
    const storageAccount = storageAccounts.find(acc => acc.publicKey.toString() === STORAGE_ACCOUNT_ADDRESS)
    
    if (!storageAccount) {
      console.log('❌ Storage account not found:', STORAGE_ACCOUNT_ADDRESS)
      console.log('🔍 Available accounts:', storageAccounts.map(acc => acc.publicKey.toString()))
      throw new Error(`Storage account ${STORAGE_ACCOUNT_ADDRESS} not found or inaccessible`)
    }
    
    console.log('📁 Storage account found:', storageAccount.publicKey.toString())
    console.log('📊 Storage account info:', {
      publicKey: storageAccount.publicKey.toString(),
      account: storageAccount.account
    })
    
    // List files in the storage account
    console.log('📋 Listing files in storage account...')
    
    // List files in the storage account
    console.log('📋 Listing files in storage account...')
    
    const filesResponse = await shdwDrive.listObjects(new PublicKey(STORAGE_ACCOUNT_ADDRESS))
    console.log('📋 Files response type:', typeof filesResponse)
    
    // The listObjects returns an object with a 'keys' property containing the file names
    const files = (filesResponse as any)?.keys || []
    
    console.log(`✅ Found ${files.length} files in storage account`)
    console.log('📋 First few files:', files.slice(0, 10))
    
    console.log(`✅ Found ${files.length} files in storage account`)
    console.log('📋 File details:', files.slice(0, 10).map((fileName: string) => ({
      name: fileName,
      isJson: fileName.endsWith('.json'),
      isMetadata: fileName.includes('metadata') || fileName.includes('nft')
    })))
    
    // Filter for metadata files and extract mascot information
    const mascots: any[] = []
    
    // Look for any JSON files that might contain mascot data
    for (const fileName of files) {
      console.log('🔍 Processing file:', fileName)
      
      // Check if it's a JSON file (more flexible than just nft-metadata-)
      if (fileName && (fileName.endsWith('.json') || fileName.includes('metadata') || fileName.includes('nft'))) {
        try {
          // Get the file content
          const fileUrl = `https://shdw-drive.genesysgo.net/${STORAGE_ACCOUNT_ADDRESS}/${fileName}`
          console.log('📥 Fetching metadata from:', fileUrl)
          
          const response = await fetch(fileUrl)
          if (response.ok) {
            const metadata = await response.json()
            console.log('📄 File content:', JSON.stringify(metadata, null, 2))
            
            // Check if this is actually a mascot metadata file
            if (metadata.name && metadata.name.includes('Candle Mascot')) {
              // Extract mascot information - be more flexible with the structure
              const mascot = {
                id: fileName.replace(/\.json$/, '').replace(/^.*?(\d+).*$/, '$1') || Date.now().toString(),
                name: metadata.name || metadata.title || 'Unnamed Mascot',
                description: metadata.description || '',
                imageUrl: metadata.image || metadata.imageUrl || null,
                traits: metadata.attributes || metadata.traits || [],
                createdAt: metadata.attributes?.find((attr: any) => attr.trait_type === 'Generated At')?.value || 
                          metadata.createdAt || 
                          metadata.created_at || 
                          new Date().toISOString(),
                metadata: metadata,
                fileUrl: fileUrl
              }
              
              mascots.push(mascot)
              console.log('✅ Processed mascot:', mascot.name)
            } else {
              console.log('⚠️ Skipping file - not a mascot metadata:', fileName)
            }
          } else {
            console.warn('⚠️ Failed to fetch file:', fileName, response.status, response.statusText)
          }
        } catch (fileError) {
          console.warn('⚠️ Could not process file:', fileName, fileError)
          continue
        }
      }
    }
    
    // Sort mascots by creation date (newest first)
    mascots.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    
    console.log(`🎉 Successfully processed ${mascots.length} mascots from Shadow Drive`)
    
    return NextResponse.json({
      success: true,
      mascots: mascots,
      count: mascots.length,
      source: 'Shadow Drive',
      debug: {
        storageAccount: STORAGE_ACCOUNT_ADDRESS,
        totalFiles: files.length,
        fileNames: files.map((f: any) => f.name || f.key || 'unknown'),
        storageAccounts: storageAccounts.map(acc => acc.publicKey.toString())
      }
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
    
  } catch (error) {
    console.error('💥 Error in Shadow Drive mascots API:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : 'Unknown'
    })
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch mascots from Shadow Drive',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
