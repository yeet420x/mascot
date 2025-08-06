import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { imageData, metadata } = await request.json()
    
    let apiKey = process.env.NFT_STORAGE_KEY || process.env.NEXT_PUBLIC_NFT_STORAGE_KEY
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'NFT.storage API key not found' },
        { status: 500 }
      )
    }

    // Clean the API key - remove any whitespace or quotes
    apiKey = apiKey.trim().replace(/['"]/g, '')

    console.log('Server-side NFT.storage API key available:', !!apiKey)
    console.log('Server-side NFT.storage API key length:', apiKey.length)
    console.log('Server-side NFT.storage API key starts with:', apiKey.substring(0, 10) + '...')
    console.log('Server-side NFT.storage API key ends with:', '...' + apiKey.substring(apiKey.length - 10))

    // Convert base64 image to buffer
    const imageBuffer = Buffer.from(imageData.split(',')[1], 'base64')
    
    // Upload image to NFT.storage
    const imageFormData = new FormData()
    imageFormData.append('file', new Blob([imageBuffer], { type: 'image/png' }), 'mascot.png')

    console.log('📤 Uploading image to NFT.storage...')
    const imageResponse = await fetch('https://api.nft.storage/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`
      },
      body: imageFormData
    })

    if (!imageResponse.ok) {
      const error = await imageResponse.text()
      console.error('Failed to upload image to NFT.storage:', error)
      console.error('Response status:', imageResponse.status)
      return NextResponse.json(
        { error: `Failed to upload image to NFT.storage: ${error}` },
        { status: 500 }
      )
    }

    const imageResult = await imageResponse.json()
    console.log('Image upload result:', imageResult)
    
    // Get the CID from the response
    const imageCid = imageResult.value?.cid
    if (!imageCid) {
      return NextResponse.json(
        { error: 'No CID returned from image upload' },
        { status: 500 }
      )
    }

    const imageUrl = `https://ipfs.io/ipfs/${imageCid}/mascot.png`
    console.log('✅ Image uploaded successfully:', imageUrl)

    // Upload metadata to NFT.storage
    const metadataWithImage = {
      ...metadata,
      image: imageUrl
    }

    const metadataBlob = new Blob([JSON.stringify(metadataWithImage)], { type: 'application/json' })
    const metadataFormData = new FormData()
    metadataFormData.append('file', metadataBlob, 'metadata.json')

    console.log('📤 Uploading metadata to NFT.storage...')
    const metadataResponse = await fetch('https://api.nft.storage/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`
      },
      body: metadataFormData
    })

    if (!metadataResponse.ok) {
      const error = await metadataResponse.text()
      console.error('Failed to upload metadata to NFT.storage:', error)
      return NextResponse.json(
        { error: `Failed to upload metadata to NFT.storage: ${error}` },
        { status: 500 }
      )
    }

    const metadataResult = await metadataResponse.json()
    console.log('Metadata upload result:', metadataResult)
    
    const metadataCid = metadataResult.value?.cid
    if (!metadataCid) {
      return NextResponse.json(
        { error: 'No CID returned from metadata upload' },
        { status: 500 }
      )
    }

    const metadataUri = `https://ipfs.io/ipfs/${metadataCid}/metadata.json`
    console.log('✅ Metadata uploaded successfully:', metadataUri)

    return NextResponse.json({
      success: true,
      imageUrl,
      metadataUri,
      imageCid,
      metadataCid
    })

  } catch (error) {
    console.error('Error in upload-to-nft-storage:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 