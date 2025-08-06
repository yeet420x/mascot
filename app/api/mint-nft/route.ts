import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  console.log('🔄 NFT Minting API called')
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

    // Create NFT metadata structure
    console.log('📝 Creating NFT metadata structure...')
    const metadata = {
      name: `Candle Mascot #${Date.now()}`,
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
        }
      ],
      properties: {
        files: [
          {
            uri: imageUrl,
            type: 'image/png'
          }
        ],
        category: 'image'
      }
    }

    console.log('🎉 NFT metadata structure created successfully!')
    
    const response = {
      success: true,
      metadata: metadata,
      message: 'NFT metadata ready for client-side processing',
      nftDetails: {
        name: metadata.name,
        image: imageUrl
      }
    }

    console.log('📤 Sending metadata structure to client:', response)
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
        error: 'Failed to create NFT metadata structure',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}