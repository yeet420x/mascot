import { NextRequest, NextResponse } from 'next/server'
import { Connection, Keypair, PublicKey } from '@solana/web3.js'
import { ShdwDrive } from '@shadow-drive/sdk'
import bs58 from 'bs58'
import nacl from 'tweetnacl'

const STORAGE_ACCOUNT_ADDRESS = 'WW5T5VEbE4GSc5Rcimo4nA9voAr7pSwqy4VswEUqWh4'

export async function POST(request: NextRequest) {
  console.log('🔄 Shadow Drive Upload API called')
  console.log('📅 Timestamp:', new Date().toISOString())
  
  try {
    console.log('📥 Parsing request body...')
    const { imageUrl, description, walletAddress } = await request.json()
    
    console.log('🔍 Validating required fields...')
    console.log('Image URL:', imageUrl)
    console.log('Description:', description)
    console.log('Wallet Address:', walletAddress)

    if (!imageUrl || !description || !walletAddress) {
      console.error('❌ Missing required fields')
      return NextResponse.json(
        { error: 'Missing required fields: imageUrl, description, walletAddress' },
        { status: 400 }
      )
    }

    // Check if private key is available for Shadow Drive
    const PRIVATE_KEY = process.env.SHADOW_DRIVE_PRIVATE_KEY
    if (!PRIVATE_KEY) {
      throw new Error('SHADOW_DRIVE_PRIVATE_KEY environment variable not set')
    }

    // Create Solana keypair for Shadow Drive uploads
    const solanaKeypair = Keypair.fromSecretKey(bs58.decode(PRIVATE_KEY))
    
    // Create NFT metadata structure
    console.log('📝 Creating NFT metadata structure...')
    const metadata = {
      name: `Candle Mascot #${Date.now()}`,
      symbol: 'CANDLE',
      description: description,
      image: imageUrl,
      attributes: [
        {
          trait_type: 'Type',
          value: 'AI Generated'
        },
        {
          trait_type: 'Collection',
          value: 'Candle Mascots'
        },
        {
          trait_type: 'Generated At',
          value: new Date().toISOString()
        }
      ],
      properties: {
        files: [
          {
            uri: imageUrl,
            type: 'image/png'
          }
        ],
        category: 'image',
        creators: [
          {
            address: walletAddress,
            share: 100,
            verified: true
          }
        ]
      }
    }

    console.log('🎉 NFT metadata structure created successfully!')
    
    // Upload image and metadata to Shadow Drive
    console.log('📤 Uploading image and metadata to Shadow Drive...')
    
    let metadataUri = ''
    let imageUri = ''
    
    try {
      // Get RPC URL directly
      const rpcUrl = process.env.QUICKNODE_RPC || 
                    process.env.NEXT_PUBLIC_QUICKNODE_RPC || 
                    'https://ssc-dao.genesysgo.net'
      
      if (!rpcUrl) {
        throw new Error('No RPC URL available')
      }
      
      // Log RPC URL (hiding sensitive parts)
      const sanitizedUrl = rpcUrl.split('/').slice(0, 3).join('/') + '/...'
      console.log('🔗 Using RPC URL:', sanitizedUrl)
      
      // Initialize Shadow Drive SDK with QuickNode
      const connection = new Connection(rpcUrl, {
        commitment: 'confirmed',
        confirmTransactionInitialTimeout: 60000
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
      
      // Step 1: Download and upload the image
      console.log('📥 Downloading image from:', imageUrl)
      
      // Handle data URIs
      let imageBuffer: Buffer
      if (imageUrl.startsWith('data:')) {
        console.log('📥 Processing data URI...')
        const base64Data = imageUrl.split(',')[1]
        imageBuffer = Buffer.from(base64Data, 'base64')
        console.log('✅ Data URI processed, buffer size:', imageBuffer.length)
      } else {
        console.log('📥 Fetching image from URL...')
        const imageResponse = await fetch(imageUrl)
        if (!imageResponse.ok) {
          throw new Error(`Failed to download image: ${imageResponse.status} ${imageResponse.statusText}`)
        }
        
        imageBuffer = Buffer.from(await imageResponse.arrayBuffer())
        console.log('✅ Image downloaded, buffer size:', imageBuffer.length)
      }
      
      // Validate image buffer
      if (!imageBuffer || imageBuffer.length === 0) {
        throw new Error('Image buffer is empty or invalid')
      }
      
      if (imageBuffer.length > 10 * 1024 * 1024) { // 10MB limit
        throw new Error('Image file is too large (max 10MB)')
      }
      
      const imageFileName = `nft-image-${Date.now()}.png`
      console.log('📤 Uploading image to Shadow Drive...')
      console.log('📊 Upload details:', {
        fileName: imageFileName,
        bufferSize: imageBuffer.length,
        storageAccount: STORAGE_ACCOUNT_ADDRESS
      })
      
      try {
        // Validate storage account before upload
        const storageAccounts = await shdwDrive.getStorageAccounts()
        const validAccount = storageAccounts.find(acc => acc.publicKey.toString() === STORAGE_ACCOUNT_ADDRESS)
        
        if (!validAccount) {
          throw new Error('Invalid or inaccessible storage account. Please check your permissions.')
        }

        // Attempt upload with retries
        let attempts = 0
        let imageUploadResult: any
        
        while (attempts < 3) {
          try {
            imageUploadResult = await shdwDrive.uploadFile(
              new PublicKey(STORAGE_ACCOUNT_ADDRESS),
              {
                name: imageFileName,
                file: imageBuffer
              }
            )
            break
          } catch (retryError) {
            attempts++
            if (attempts === 3) throw retryError
            await new Promise(resolve => setTimeout(resolve, 1000 * attempts))
          }
        }
        
        console.log('✅ Image upload result:', imageUploadResult)
        
        // Check if upload was successful and handle specific error cases
        if (imageUploadResult && Array.isArray(imageUploadResult.upload_errors) && imageUploadResult.upload_errors.length > 0) {
          const errors = imageUploadResult.upload_errors
          console.error('❌ Image upload errors:', errors)
          
          // Map common error cases to user-friendly messages
          const errorMessage = errors.map((err: any) => {
            const errStr = String(err)
            if (errStr.toLowerCase().includes('insufficient storage')) return 'Not enough storage space'
            if (errStr.toLowerCase().includes('unauthorized')) return 'Unauthorized access to storage'
            return errStr
          }).join(', ')
          
          throw new Error(`Image upload failed: ${errorMessage}`)
        }
        
      } catch (uploadError) {
        console.error('❌ Shadow Drive upload error:', uploadError)
        console.error('❌ Upload error details:', {
          message: uploadError instanceof Error ? uploadError.message : 'Unknown error',
          stack: uploadError instanceof Error ? uploadError.stack : undefined
        })
        
        // Provide more specific error messages
        const errorMessage = uploadError instanceof Error ? uploadError.message : 'Unknown error'
        if (errorMessage.includes('400')) {
          throw new Error('Upload failed: Please check your storage account permissions and available space')
        }
        throw new Error(`Upload failed: ${errorMessage}`)
      }
      imageUri = `https://shdw-drive.genesysgo.net/${STORAGE_ACCOUNT_ADDRESS}/${imageFileName}`
      console.log('✅ Image uploaded to Shadow Drive:', imageUri)
      
      // Step 2: Update metadata with the new image URI
      metadata.image = imageUri
      metadata.properties.files[0].uri = imageUri
      
      // Step 3: Upload metadata
      const metadataJson = JSON.stringify(metadata, null, 2)
      const metadataFileName = `nft-metadata-${Date.now()}.json`
      const metadataBuffer = Buffer.from(metadataJson, 'utf-8')
      
      console.log('📤 Uploading metadata to Shadow Drive...')
      try {
        const metadataUploadResult = await shdwDrive.uploadFile(
          new PublicKey(STORAGE_ACCOUNT_ADDRESS),
          {
            name: metadataFileName,
            file: metadataBuffer
          }
        )
        
        console.log('✅ Metadata upload result:', metadataUploadResult)
        
        // Check if upload was successful
        if (metadataUploadResult && metadataUploadResult.upload_errors && metadataUploadResult.upload_errors.length > 0) {
          console.error('❌ Metadata upload errors:', metadataUploadResult.upload_errors)
          throw new Error(`Metadata upload failed: ${JSON.stringify(metadataUploadResult.upload_errors)}`)
        }
        
      } catch (uploadError) {
        console.error('❌ Shadow Drive metadata upload error:', uploadError)
        console.error('❌ Metadata upload error details:', {
          message: uploadError instanceof Error ? uploadError.message : 'Unknown error',
          stack: uploadError instanceof Error ? uploadError.stack : undefined
        })
        throw uploadError
      }
      metadataUri = `https://shdw-drive.genesysgo.net/${STORAGE_ACCOUNT_ADDRESS}/${metadataFileName}`
      console.log('✅ Metadata uploaded to Shadow Drive:', metadataUri)
      
    } catch (shadowError) {
      console.error('❌ Shadow Drive upload failed:', shadowError)
      throw new Error(`Shadow Drive upload failed: ${shadowError}`)
    }
    
    console.log('✅ Upload completed successfully!')
    
    const response = {
      success: true,
      imageUri: imageUri,
      metadataUri: metadataUri,
      metadata: metadata,
      message: 'Files uploaded successfully to Shadow Drive',
      uploadDetails: {
        image: imageUri,
        metadata: metadataUri,
        readyForMinting: true
      }
    }

    console.log('📤 Sending upload result to client:', response)
    return NextResponse.json(response)

  } catch (error) {
    console.error('💥 Error in upload API:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : 'Unknown'
    })
    
    return NextResponse.json(
      { 
        error: 'Failed to upload to Shadow Drive',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 