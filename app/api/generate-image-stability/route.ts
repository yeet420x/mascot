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

    // Stability AI API call
    const response = await fetch('https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.STABILITY_API_KEY}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        text_prompts: [
          {
            text: `Create a cute Candle TV mascot: ${prompt}. Style: cartoon, orange and black theme, professional mascot design`,
            weight: 1
          }
        ],
        cfg_scale: 7,
        height: 1024,
        width: 1024,
        samples: 1,
        steps: 30,
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to generate image')
    }

    const data = await response.json()
    const imageUrl = data.artifacts?.[0]?.base64

    if (!imageUrl) {
      throw new Error('No image generated')
    }

    return NextResponse.json({
      imageUrl: `data:image/png;base64,${imageUrl}`,
      model: "stable-diffusion-xl"
    })

  } catch (error) {
    console.error('Error generating image with Stability AI:', error)
    
    if (error instanceof Error) {
      if (error.message.includes('billing')) {
        return NextResponse.json(
          { error: 'Billing issue. Please check your Stability AI account balance.' },
          { status: 402 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Failed to generate image. Please try again.' },
      { status: 500 }
    )
  }
} 