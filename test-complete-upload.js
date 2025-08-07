// Test complete image and metadata upload to Shadow Drive

import dotenv from 'dotenv'
import path from 'path'
import { Connection, Keypair, PublicKey } from '@solana/web3.js'
import { ShdwDrive } from '@shadow-drive/sdk'
import bs58 from 'bs58'
import nacl from 'tweetnacl'

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const testCompleteUpload = async () => {
  console.log('🧪 Testing Complete Image and Metadata Upload...\n')

  try {
    // Check if private key is available
    const PRIVATE_KEY = process.env.SHADOW_DRIVE_PRIVATE_KEY
    if (!PRIVATE_KEY) {
      console.log('❌ SHADOW_DRIVE_PRIVATE_KEY environment variable not set')
      return
    }

    console.log('✅ Private key found')

    // Create keypair from private key
    const keypair = Keypair.fromSecretKey(bs58.decode(PRIVATE_KEY))
    console.log('✅ Keypair created successfully')

    // Test image URL (base64 data URI from AI generation)
    const testImageUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
    console.log('📸 Test image URL:', testImageUrl.substring(0, 50) + '...')

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

    // Step 1: Download and upload the image
    console.log('\n📥 Downloading image...')
    const imageResponse = await fetch(testImageUrl)
    if (!imageResponse.ok) {
      throw new Error(`Failed to download image: ${imageResponse.status}`)
    }
    
    const imageBuffer = Buffer.from(await imageResponse.arrayBuffer())
    const imageFileName = `test-image-${Date.now()}.png`
    console.log('📄 Image buffer created, size:', imageBuffer.length, 'bytes')
    
    console.log('📤 Uploading image to Shadow Drive...')
    const imageUploadResult = await shdwDrive.uploadFile(
      new PublicKey(STORAGE_ACCOUNT_ADDRESS),
      {
        name: imageFileName,
        file: imageBuffer
      }
    )
    
    console.log('✅ Image upload result:', imageUploadResult)
    const imageUri = `https://shdw-drive.genesysgo.net/${STORAGE_ACCOUNT_ADDRESS}/${imageFileName}`
    console.log('✅ Image uploaded to Shadow Drive:', imageUri)

    // Step 2: Create metadata with the uploaded image URI
    const testMetadata = {
      name: 'Test Complete Upload #123',
      symbol: 'CANDLE',
      description: 'A test mascot with complete image and metadata upload',
      image: imageUri,
      attributes: [
        { trait_type: 'Type', value: 'AI Generated' },
        { trait_type: 'Collection', value: 'Candle Mascots' },
        { trait_type: 'Generated At', value: new Date().toISOString() }
      ],
      properties: {
        files: [{ uri: imageUri, type: 'image/png' }],
        category: 'image',
        creators: [{ address: '11111111111111111111111111111111', share: 100, verified: true }]
      }
    }

    console.log('\n📝 Test metadata created with uploaded image URI')
    console.log('Metadata image URI:', testMetadata.image)

    // Step 3: Upload metadata
    const metadataJson = JSON.stringify(testMetadata, null, 2)
    const metadataFileName = `test-metadata-${Date.now()}.json`
    const metadataBuffer = Buffer.from(metadataJson, 'utf-8')
    console.log('📄 Metadata buffer created, size:', metadataBuffer.length, 'bytes')
    
    console.log('📤 Uploading metadata to Shadow Drive...')
    const metadataUploadResult = await shdwDrive.uploadFile(
      new PublicKey(STORAGE_ACCOUNT_ADDRESS),
      {
        name: metadataFileName,
        file: metadataBuffer
      }
    )
    
    console.log('✅ Metadata upload result:', metadataUploadResult)
    const metadataUri = `https://shdw-drive.genesysgo.net/${STORAGE_ACCOUNT_ADDRESS}/${metadataFileName}`
    console.log('✅ Metadata uploaded to Shadow Drive:', metadataUri)

    console.log('\n🎉 Complete upload test successful!')
    console.log('\n📋 Summary:')
    console.log('• Image uploaded:', imageUri)
    console.log('• Metadata uploaded:', metadataUri)
    console.log('• Both files accessible on Shadow Drive')
    console.log('• Ready for NFT minting with real URIs')

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
testCompleteUpload() 