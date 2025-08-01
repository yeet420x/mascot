import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { description, referenceImage } = await request.json()

    if (!description) {
      return NextResponse.json(
        { error: 'Description is required' },
        { status: 400 }
      )
    }

    // If user provides a reference image, use GPT-4V to analyze it
    if (referenceImage) {
      const analysisPrompt = `
Analyze this mascot image and provide detailed feedback on:
1. Color scheme and branding
2. Character style and personality
3. Clothing and accessories
4. Overall design quality

Then suggest improvements for a Candle TV mascot based on this analysis.
`

      const analysisResponse = await openai.chat.completions.create({
        model: "gpt-4-vision-preview",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: analysisPrompt },
              {
                type: "image_url",
                image_url: {
                  url: referenceImage,
                },
              },
            ],
          },
        ],
        max_tokens: 500,
      })

      const analysis = analysisResponse.choices[0]?.message?.content || ''
      
      // Use the analysis to enhance the generation prompt
      const enhancedDescription = `${description}\n\nBased on analysis: ${analysis}`
      
      // Generate image using DALL-E 3 with enhanced prompt
      const imageResponse = await openai.images.generate({
        model: "dall-e-3",
        prompt: `Create a Candle TV mascot based on this analysis: ${enhancedDescription}`,
        n: 1,
        size: "1024x1024",
        quality: "standard",
        style: "vivid",
      })

      const imageUrl = imageResponse.data?.[0]?.url

      return NextResponse.json({
        imageUrl,
        analysis,
        description: enhancedDescription,
        model: "gpt-4v + dall-e-3"
      })
    } else {
      // No reference image, use standard DALL-E 3 generation
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
    }

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