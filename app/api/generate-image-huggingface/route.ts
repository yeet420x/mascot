import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json()

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    // Hugging Face Inference API (FREE)
    const response = await fetch('https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY || 'hf_demo'}` // Can work without key for basic usage
      },
      body: JSON.stringify({
        inputs: `Create a cute Candle TV mascot: ${prompt}. Style: cartoon, orange and black theme, professional mascot design`,
        parameters: {
          num_inference_steps: 30,
          guidance_scale: 7.5,
          width: 512,
          height: 512
        }
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to generate image')
    }

    const imageBuffer = await response.arrayBuffer()
    const base64Image = Buffer.from(imageBuffer).toString('base64')

    return NextResponse.json({
      imageUrl: `data:image/png;base64,${base64Image}`,
      model: "stable-diffusion-v1-5 (Hugging Face)"
    })

  } catch (error) {
    console.error('Error generating image with Hugging Face:', error)
    
    return NextResponse.json(
      { error: 'Failed to generate image. Please try again.' },
      { status: 500 }
    )
  }
} 