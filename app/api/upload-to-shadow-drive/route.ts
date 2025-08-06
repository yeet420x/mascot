import { NextRequest, NextResponse } from 'next/server'
import { Connection, PublicKey, Keypair } from '@solana/web3.js'
import bs58 from 'bs58'
import nacl from 'tweetnacl'
import crypto from 'crypto'

const SOLANA_RPC = process.env.QUICKNODE_RPC || 'https://api.mainnet-beta.solana.com'
const STORAGE_ACCOUNT_ADDRESS = 'WW5T5VEbE4GSc5Rcimo4nA9voAr7pSwqy4VswEUqWh4'
const SHDW_DRIVE_ENDPOINT = 'https://shadow-storage.genesysgo.net'

// You'll need to set this environment variable with your private key
const PRIVATE_KEY = process.env.SHADOW_DRIVE_PRIVATE_KEY

export async function POST(request: NextRequest) {
  try {
    const { imageUrl, name, walletAddress, metadata } = await request.json()

    console.log('📤 Starting ShadowDrive upload...')
    console.log('Image URL:', imageUrl)
    console.log('Name:', name)
    console.log('Wallet Address:', walletAddress)
    console.log('Has Metadata:', !!metadata)
    console.log('🏦 Storage Account:', STORAGE_ACCOUNT_ADDRESS)

    // Check if private key is available
    if (!PRIVATE_KEY) {
      console.error('❌ SHADOW_DRIVE_PRIVATE_KEY environment variable not set')
      return NextResponse.json(
        { error: 'Shadow Drive private key not configured' },
        { status: 500 }
      )
    }

    // Create keypair from private key
    const keypair = Keypair.fromSecretKey(bs58.decode(PRIVATE_KEY))

    if (metadata) {
      // Handle metadata upload
      console.log('📝 Creating complete metadata...')
      
      // Create complete metadata with all required fields
      const completeMetadata = {
        name: metadata.name,
        symbol: "CNDL",
        image: metadata.image,
        description: "Candle TV Mascot NFT - AI Generated"
      }
      
      const metadataJson = JSON.stringify(completeMetadata)
      const metadataBlob = new Blob([metadataJson], { type: 'application/json' })
      
      // Create file name for metadata - clean the name to avoid URL encoding issues
      const cleanName = (name || 'metadata').replace(/[^a-zA-Z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
      const metadataFileName = `${cleanName}-${Date.now()}.json`
      
      // Upload metadata to Shadow Drive
      const uploadResult = await uploadToShadowDrive(
        metadataBlob,
        metadataFileName,
        'application/json',
        keypair,
        STORAGE_ACCOUNT_ADDRESS
      )

      if (uploadResult.success) {
        const metadataShadowDriveUrl = `https://shdw-drive.genesysgo.net/${STORAGE_ACCOUNT_ADDRESS}/${metadataFileName}`
        
        console.log('✅ Metadata uploaded to ShadowDrive')
        console.log('📁 Metadata URL:', metadataShadowDriveUrl)
        
        // Wait a moment for the file to be accessible
        console.log('⏳ Waiting for file to be accessible...')
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // Verify the file is accessible
        try {
          const verifyResponse = await fetch(metadataShadowDriveUrl)
          if (verifyResponse.ok) {
            console.log('✅ File is accessible and ready')
          } else {
            console.log('⚠️ File not yet accessible, but upload was successful')
          }
        } catch (error) {
          console.log('⚠️ Could not verify file accessibility, but upload was successful')
        }
        
        return NextResponse.json({
          success: true,
          message: 'Metadata uploaded to ShadowDrive',
          imageUrl: metadataShadowDriveUrl,
          storageAccount: STORAGE_ACCOUNT_ADDRESS,
          fileName: metadataFileName,
          uploadResult: uploadResult
        })
      } else {
        throw new Error(`Failed to upload metadata: ${uploadResult.error}`)
      }
    } else {
      // Handle image upload
      console.log('📥 Downloading image from URL...')
      const downloadResponse = await fetch(imageUrl)

      if (!downloadResponse.ok) {
        throw new Error(`Failed to download image: ${downloadResponse.status}`)
      }

      const imageBuffer = await downloadResponse.arrayBuffer()
      const imageBlob = new Blob([imageBuffer], { type: 'image/png' })

      console.log('✅ Image downloaded successfully')

      // Create clean filename for image
      const cleanName = (name || 'mascot').replace(/[^a-zA-Z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
      const fileName = `${cleanName}-${Date.now()}.png`
      
      // Upload image to Shadow Drive
      const uploadResult = await uploadToShadowDrive(
        imageBlob,
        fileName,
        'image/png',
        keypair,
        STORAGE_ACCOUNT_ADDRESS
      )

      if (uploadResult.success) {
        const realImageUrl = `https://shdw-drive.genesysgo.net/${STORAGE_ACCOUNT_ADDRESS}/${fileName}`
        
        console.log('✅ Image uploaded to ShadowDrive')
        console.log('📁 Image URL:', realImageUrl)
        
        // Wait a moment for the file to be accessible
        console.log('⏳ Waiting for file to be accessible...')
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // Verify the file is accessible
        try {
          const verifyResponse = await fetch(realImageUrl)
          if (verifyResponse.ok) {
            console.log('✅ File is accessible and ready')
          } else {
            console.log('⚠️ File not yet accessible, but upload was successful')
          }
        } catch (error) {
          console.log('⚠️ Could not verify file accessibility, but upload was successful')
        }

        return NextResponse.json({
          success: true,
          message: 'Image uploaded to ShadowDrive',
          imageUrl: realImageUrl,
          storageAccount: STORAGE_ACCOUNT_ADDRESS,
          fileName,
          uploadResult: uploadResult
        })
      } else {
        throw new Error(`Failed to upload image: ${uploadResult.error}`)
      }
    }

  } catch (error) {
    console.error('Error in upload-to-shadow-drive:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: 'Internal server error', details: errorMessage },
      { status: 500 }
    )
  }
}

async function uploadToShadowDrive(
  fileBlob: Blob,
  fileName: string,
  contentType: string,
  keypair: Keypair,
  storageAccount: string
) {
  try {
    console.log(`📤 Uploading ${fileName} to ShadowDrive...`)
    
    // Create file data for upload
    const fileData = new Uint8Array(await fileBlob.arrayBuffer())
    
    // Create hash of file names as per Shadow Drive API docs
    // The API expects a comma-separated list of file names
    const fileNamesList = [fileName]
    const fileNamesString = fileNamesList.toString()
    const fileNamesHash = crypto.createHash('sha256').update(fileNamesString).digest('hex')
    
    // Create the message to sign according to Shadow Drive API docs
    const message = `Shadow Drive Signed Message:\nStorage Account: ${storageAccount}\nUpload files with hash: ${fileNamesHash}`
    
    console.log('📝 Message to sign:', message)
    console.log('📁 File names:', fileNamesString)
    console.log('📁 File names hash:', fileNamesHash)
    
    // Encode and sign the message
    const encodedMessage = new TextEncoder().encode(message)
    const signedMessage = nacl.sign.detached(encodedMessage, keypair.secretKey)
    const signature = bs58.encode(signedMessage)
    
    console.log('✅ Message signed successfully')
    
    // Create FormData for upload
    const formData = new FormData()
    formData.append('file', new Blob([fileData], { type: contentType }), fileName)
    formData.append('message', signature)
    formData.append('signer', keypair.publicKey.toString())
    formData.append('storage_account', storageAccount)
    formData.append('fileNames', fileNamesString) // Add fileNames field as per API docs
    
    console.log('📤 Sending upload request to ShadowDrive...')
    
    // Send upload request
    const uploadResponse = await fetch(`${SHDW_DRIVE_ENDPOINT}/upload`, {
      method: 'POST',
      body: formData
    })
    
    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text()
      console.error('❌ Upload failed:', uploadResponse.status, errorText)
      return {
        success: false,
        error: `Upload failed with status ${uploadResponse.status}: ${errorText}`
      }
    }
    
    const uploadResult = await uploadResponse.json()
    console.log('✅ Upload response:', uploadResult)
    
    return {
      success: true,
      result: uploadResult
    }
    
  } catch (error) {
    console.error('❌ Error in uploadToShadowDrive:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return {
      success: false,
      error: errorMessage
    }
  }
} 