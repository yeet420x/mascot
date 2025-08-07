// Direct test of Shadow Drive SDK integration

import dotenv from 'dotenv'
import path from 'path'
import { Connection, Keypair, PublicKey } from '@solana/web3.js'
import { ShdwDrive } from '@shadow-drive/sdk'
import bs58 from 'bs58'
import nacl from 'tweetnacl'

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const testShadowDriveDirect = async () => {
  console.log('🧪 Testing Shadow Drive SDK Direct Integration...\n')

  try {
    // Check if private key is available
    const PRIVATE_KEY = process.env.SHADOW_DRIVE_PRIVATE_KEY
    if (!PRIVATE_KEY) {
      console.log('❌ SHADOW_DRIVE_PRIVATE_KEY environment variable not set')
      console.log('💡 Please set your Shadow Drive private key in .env.local')
      return
    }

    console.log('✅ Private key found')

    // Create keypair from private key
    const keypair = Keypair.fromSecretKey(bs58.decode(PRIVATE_KEY))
    console.log('✅ Keypair created successfully')
    console.log('Public Key:', keypair.publicKey.toString())

    // Test metadata
    const testMetadata = {
      name: 'Test Mascot #123',
      symbol: 'CANDLE',
      description: 'A test mascot with pepe face and neon eyes',
      image: 'https://shdw-drive.genesysgo.net/WW5T5VEbE4GSc5Rcimo4nA9voAr7pSwqy4VswEUqWh4/test-mascot.png',
      attributes: [
        { trait_type: 'Type', value: 'AI Generated' },
        { trait_type: 'Collection', value: 'Candle Mascots' },
        { trait_type: 'Generated At', value: new Date().toISOString() }
      ],
      properties: {
        files: [{ uri: 'https://shdw-drive.genesysgo.net/WW5T5VEbE4GSc5Rcimo4nA9voAr7pSwqy4VswEUqWh4/test-mascot.png', type: 'image/png' }],
        category: 'image',
        creators: [{ address: '11111111111111111111111111111111', share: 100, verified: true }]
      }
    }

    console.log('📝 Test metadata created')
    console.log('Metadata:', JSON.stringify(testMetadata, null, 2))

    // Initialize Shadow Drive SDK
    const connection = new Connection('https://api.mainnet-beta.solana.com')
    
    // Create wallet object in the format expected by Shadow Drive SDK
    const wallet = {
      publicKey: keypair.publicKey,
      payer: keypair,
      signMessage: async (message) => {
        const signature = nacl.sign.detached(message, keypair.secretKey)
        return signature
      }
    }
    
    const shdwDrive = new ShdwDrive(connection, wallet)
    await shdwDrive.init()
    console.log('✅ Shadow Drive SDK initialized')

    // Storage account address
    const STORAGE_ACCOUNT_ADDRESS = 'WW5T5VEbE4GSc5Rcimo4nA9voAr7pSwqy4VswEUqWh4'
    console.log('📁 Storage Account:', STORAGE_ACCOUNT_ADDRESS)

    // Create metadata JSON
    const metadataJson = JSON.stringify(testMetadata, null, 2)
    const metadataFileName = `test-metadata-${Date.now()}.json`
    
    // Create file buffer
    const fileBuffer = Buffer.from(metadataJson, 'utf-8')
    console.log('📄 File buffer created, size:', fileBuffer.length, 'bytes')

    // Upload to Shadow Drive using official SDK
    console.log('📤 Uploading to Shadow Drive...')
    
    const uploadResult = await shdwDrive.uploadFile(
      new PublicKey(STORAGE_ACCOUNT_ADDRESS),
      {
        name: metadataFileName,
        file: fileBuffer
      }
    )
    
    console.log('✅ Shadow Drive upload result:', uploadResult)
    
    // Construct the metadata URI
    const metadataUri = `https://shdw-drive.genesysgo.net/${STORAGE_ACCOUNT_ADDRESS}/${metadataFileName}`
    console.log('✅ Metadata URI:', metadataUri)

    console.log('\n🎉 Shadow Drive SDK test completed successfully!')
    console.log('\n📋 Summary:')
    console.log('• Shadow Drive SDK initialized correctly')
    console.log('• File uploaded successfully')
    console.log('• Metadata URI generated:', metadataUri)
    console.log('• Ready for NFT minting integration')

  } catch (error) {
    console.error('❌ Test Failed:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : 'Unknown'
    })
  }
}

// Run the test
testShadowDriveDirect() 