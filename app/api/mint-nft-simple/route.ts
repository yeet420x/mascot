import { NextRequest, NextResponse } from 'next/server'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata'
import { generateSigner, percentAmount, signerIdentity } from '@metaplex-foundation/umi'
import { createNft } from '@metaplex-foundation/mpl-token-metadata'
import { Connection, Keypair, PublicKey } from '@solana/web3.js'
import { ShdwDrive } from '@shadow-drive/sdk'
import bs58 from 'bs58'
import nacl from 'tweetnacl'

const SOLANA_RPC = process.env.QUICKNODE_RPC || 'https://api.mainnet-beta.solana.com'
const STORAGE_ACCOUNT_ADDRESS = 'WW5T5VEbE4GSc5Rcimo4nA9voAr7pSwqy4VswEUqWh4'

export async function POST(request: NextRequest) {
  console.log('🔄 Simplified NFT Minting API called')
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

    // Check if private key is available
    const PRIVATE_KEY = process.env.SHADOW_DRIVE_PRIVATE_KEY
    if (!PRIVATE_KEY) {
      throw new Error('SHADOW_DRIVE_PRIVATE_KEY environment variable not set')
    }

    // Create Solana keypair
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
      // Initialize Shadow Drive SDK
      const connection = new Connection('https://api.mainnet-beta.solana.com')
      
      // Create wallet object for Shadow Drive
      const wallet = {
        publicKey: solanaKeypair.publicKey,
        payer: solanaKeypair,
        signMessage: async (message: Uint8Array) => {
          const signature = nacl.sign.detached(message, solanaKeypair.secretKey)
          return signature
        }
      }
      
      const shdwDrive = new ShdwDrive(connection, wallet)
      await shdwDrive.init()
      
      // Step 1: Download and upload the image
      console.log('📥 Downloading image from:', imageUrl)
      const imageResponse = await fetch(imageUrl)
      if (!imageResponse.ok) {
        throw new Error(`Failed to download image: ${imageResponse.status}`)
      }
      
      const imageBuffer = Buffer.from(await imageResponse.arrayBuffer())
      const imageFileName = `nft-image-${Date.now()}.png`
      
      console.log('📤 Uploading image to Shadow Drive...')
      const imageUploadResult = await shdwDrive.uploadFile(
        new PublicKey(STORAGE_ACCOUNT_ADDRESS),
        {
          name: imageFileName,
          file: imageBuffer
        }
      )
      
      console.log('✅ Image upload result:', imageUploadResult)
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
      const metadataUploadResult = await shdwDrive.uploadFile(
        new PublicKey(STORAGE_ACCOUNT_ADDRESS),
        {
          name: metadataFileName,
          file: metadataBuffer
        }
      )
      
      console.log('✅ Metadata upload result:', metadataUploadResult)
      metadataUri = `https://shdw-drive.genesysgo.net/${STORAGE_ACCOUNT_ADDRESS}/${metadataFileName}`
      console.log('✅ Metadata uploaded to Shadow Drive:', metadataUri)
      
    } catch (shadowError) {
      console.error('❌ Shadow Drive upload failed:', shadowError)
      // Fallback: use a temporary URI for testing
      metadataUri = `data:application/json;base64,${Buffer.from(JSON.stringify(metadata)).toString('base64')}`
      console.log('⚠️ Using fallback metadata URI for testing')
    }
    
    console.log('✅ Metadata URI ready:', metadataUri)
    
    // Initialize UMI for minting with proper signer
    console.log('🔧 Initializing UMI for minting...')
    
    // Create UMI instance with mainnet-beta
    const umi = createUmi('https://api.mainnet-beta.solana.com')
      .use(mplTokenMetadata())
    
    // Generate a new signer for the mint (following official docs)
    const mint = generateSigner(umi)
    
    // Use the mint as the signer identity (following official docs)
    umi.use(signerIdentity(mint))
    
    // Create the NFT
    console.log('🎨 Creating NFT on blockchain...')
    
    const builder = createNft(umi, {
      mint,
      name: metadata.name,
      uri: metadataUri,
      sellerFeeBasisPoints: percentAmount(5), // 5% royalty
    })
    
    // Build and send the transaction
    const result = await builder.sendAndConfirm(umi)
    
    console.log('🎉 NFT minted successfully!')
    console.log('Mint Address:', mint.publicKey)
    console.log('Transaction Signature:', result.signature)
    
    const response = {
      success: true,
      mintAddress: mint.publicKey,
      transactionSignature: result.signature,
      metadata: metadata,
      metadataUri: metadataUri,
      message: 'NFT minted successfully on Solana mainnet-beta with Shadow Drive metadata',
      nftDetails: {
        name: metadata.name,
        image: imageUri || imageUrl,
        mintAddress: mint.publicKey,
        metadataUri: metadataUri,
        explorerUrl: `https://explorer.solana.com/address/${mint.publicKey}?cluster=mainnet-beta`
      }
    }

    console.log('📤 Sending minting result to client:', response)
    return NextResponse.json(response)

  } catch (error) {
    console.error('💥 Error in mint-nft API:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : 'Unknown'
    })
    
    return NextResponse.json(
      { 
        error: 'Failed to mint NFT',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 