import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { imageUrl, name } = await request.json()
    
    let apiKey = process.env.NFT_STORAGE_KEY || process.env.NEXT_PUBLIC_NFT_STORAGE_KEY
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'NFT.storage API key not found' },
        { status: 500 }
      )
    }

    // Clean the API key - remove any whitespace or quotes
    apiKey = apiKey.trim().replace(/['"]/g, '')

    console.log('Server-side API key available:', !!apiKey)
    console.log('Server-side API key length:', apiKey.length)
    console.log('Server-side API key starts with:', apiKey.substring(0, 10) + '...')
    console.log('Server-side API key ends with:', '...' + apiKey.substring(apiKey.length - 10))
    console.log('API key format check - contains dots:', apiKey.includes('.'))
    console.log('API key format check - contains dashes:', apiKey.includes('-'))

    // Download image from URL
    console.log('Downloading image from:', imageUrl)
    const downloadResponse = await fetch(imageUrl)
    
    if (!downloadResponse.ok) {
      throw new Error(`Failed to download image: ${downloadResponse.status}`)
    }
    
    const imageBuffer = await downloadResponse.arrayBuffer()
    
    // Upload image to NFT.storage
    const imageFormData = new FormData()
    imageFormData.append('file', new Blob([imageBuffer], { type: 'image/png' }), `${name || 'mascot'}.png`)

    const uploadResponse = await fetch('https://api.nft.storage/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`
      },
      body: imageFormData
    })

    if (!uploadResponse.ok) {
      const error = await uploadResponse.text()
      console.error('Failed to upload image:', error)
      console.error('Response status:', uploadResponse.status)
      console.error('Response headers:', Object.fromEntries(uploadResponse.headers.entries()))
      return NextResponse.json(
        { error: `Failed to upload image to NFT.storage: ${error}` },
        { status: 500 }
      )
    }

    const { value: { cid: imageCid } } = await uploadResponse.json()
    const ipfsImageUrl = `https://ipfs.io/ipfs/${imageCid}/${name || 'mascot'}.png`

    return NextResponse.json({
      success: true,
      imageUrl: ipfsImageUrl,
      cid: imageCid
    })

  } catch (error) {
    console.error('Error in upload-to-nft-storage:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 