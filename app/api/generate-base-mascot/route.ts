import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { traits } = await request.json()

    if (!traits) {
      return NextResponse.json(
        { error: 'Traits are required' },
        { status: 400 }
      )
    }

    // Create a detailed prompt for the base mascot with customizations
    const baseMascotPrompt = `
Create a Candle TV mascot with the following specifications:

BASE DESIGN:
- Head: Use the Candle TV logo style (orange "C" in a circle)
- Body: Chibi anthropomorphic cat style (round and short, cute and playful)
- Pose: Standing confidently with arms wide open and a big smile
- Style: Clean vector-style shading with bold outlines

FIXED ELEMENTS:
- White buttoned shirt with rolled-up sleeves
- Navy blue suspenders with white dots
- Brown loafers
- Urban streetwear aesthetic

CUSTOMIZABLE ELEMENTS:
- Background: ${traits.background || 'Light beige'}
- Glasses: ${traits.glasses === 'none' ? 'No glasses' : traits.glasses}
- Hat: ${traits.hat === 'none' ? 'No hat' : traits.hat}
- Bowtie: ${traits.bowtie === 'none' ? 'No bowtie' : traits.bowtie + ' bowtie'}
- Pants: ${traits.pants || 'Pink'} pants

SPECIFIC REQUIREMENTS:
1. The head should be the Candle TV logo style (orange "C" in a circle)
2. The body should be chibi cat style (round, short, cute)
3. The pose should be confident with arms wide open
4. The character should have a big, friendly smile
5. The clothing should be urban streetwear style
6. The overall style should be clean vector-style with bold outlines
7. The background should be ${traits.background || 'light beige'}
8. Maintain the Candle TV branding with orange and black color scheme

The final image should look like a professional mascot suitable for Candle TV branding, combining the recognizable Candle TV logo head with the cute chibi cat body style.
`

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: baseMascotPrompt,
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
      prompt: baseMascotPrompt,
      traits: traits,
      model: "dall-e-3"
    })

  } catch (error) {
    console.error('Error generating base mascot:', error)
    
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
          { error: 'Content policy violation. Please try different traits.' },
          { status: 400 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Failed to generate base mascot. Please try again.' },
      { status: 500 }
    )
  }
} 