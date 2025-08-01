import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { description } = await request.json()

    if (!description) {
      return NextResponse.json(
        { error: 'Description is required' },
        { status: 400 }
      )
    }

    // Enhanced prompt for DALL-E 3 to generate Candle TV mascot
    const enhancedPrompt = `
Create a cute, cartoon-style mascot character for Candle TV with the following specifications:

${description}

Style requirements:
- Cute, friendly cartoon character
- Orange and black color scheme (Candle TV branding)
- Simple, clean design suitable for a mascot
- Character should have a round head and friendly expression
- Background should be simple or transparent
- High contrast for visibility
- Professional quality suitable for branding

The character should embody the Candle TV brand identity while matching the user's description.
`

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: enhancedPrompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
      style: "vivid",
    })

    const imageUrl = response.data?.[0]?.url

    if (!imageUrl) {
      throw new Error('No image generated')
    }

    return NextResponse.json({ 
      imageUrl,
      description: enhancedPrompt,
      model: "dall-e-3"
    })

  } catch (error) {
    console.error('Error generating image:', error)
    
    // Handle specific OpenAI errors
    if (error instanceof Error) {
      if (error.message.includes('billing')) {
        return NextResponse.json(
          { error: 'Billing issue. Please check your OpenAI account balance.' },
          { status: 402 }
        )
      }
      if (error.message.includes('content_policy')) {
        return NextResponse.json(
          { error: 'Content policy violation. Please try a different description.' },
          { status: 400 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Failed to generate image. Please try again.' },
      { status: 500 }
    )
  }
} 