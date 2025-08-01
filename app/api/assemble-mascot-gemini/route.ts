import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI } from "@google/genai"
import fs from 'fs'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const { traits } = await request.json()

    if (!traits) {
      return NextResponse.json(
        { error: 'Traits are required' },
        { status: 400 }
      )
    }

    // Read the base images from the app/images folder
    const headImagePath = path.join(process.cwd(), 'app', 'images', 'head.svg')
    const bodyImagePath = path.join(process.cwd(), 'app', 'images', 'body.jpg')

    // Convert images to base64
    const headImageBuffer = fs.readFileSync(headImagePath)
    const bodyImageBuffer = fs.readFileSync(bodyImagePath)
    
    const headImageBase64 = headImageBuffer.toString('base64')
    const bodyImageBase64 = bodyImageBuffer.toString('base64')

    // Initialize Google AI
    const ai = new GoogleGenAI({
      apiKey: process.env.GOOGLE_AI_KEY
    })

    // Use Gemini Pro Vision for image analysis
    const model = ai.models.generateContent({
      model: 'gemini-1.5-pro-vision',
      contents: [
        {
          parts: [
            {
              text: `Analyze these two mascot images and provide assembly instructions for creating a Candle TV mascot with these customizations:
              
              Head color: ${traits.head || 'default'}
              Background: ${traits.background || 'light beige'}
              Glasses: ${traits.glasses === 'none' ? 'No glasses' : traits.glasses}
              Hat: ${traits.hat !== 'none' ? traits.hat : 'No hat'}
              Bowtie: ${traits.bowtie === 'none' ? 'No bowtie' : traits.bowtie + ' bowtie'}
              Pants: ${traits.pants || 'default'}
              
              Provide detailed instructions for combining these elements into a cohesive mascot.`
            },
            {
              inlineData: {
                mimeType: "image/svg+xml",
                data: headImageBase64
              }
            },
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: bodyImageBase64
              }
            }
          ]
        }
      ]
    })

    const analysisResponse = await model
    const analysis = analysisResponse?.text || ''

    // Use Imagen for final generation
    const generationResponse = await ai.models.generateImages({
      model: 'imagen-4.0-generate-preview-06-06',
      prompt: `Create a complete Candle TV mascot combining these elements: ${analysis}. Style: cute cartoon mascot, orange and black theme, professional design, ${traits.hat !== 'none' ? `wearing ${traits.hat}` : ''}, ${traits.glasses !== 'none' ? `wearing ${traits.glasses} glasses` : ''}, ${traits.bowtie !== 'none' ? `wearing ${traits.bowtie} bowtie` : ''}, background: ${traits.background || 'light beige'}`,
      config: {
        numberOfImages: 1,
      },
    })

    if (!generationResponse.generatedImages || generationResponse.generatedImages.length === 0) {
      throw new Error('No image generated')
    }

    const generatedImage = generationResponse.generatedImages[0]
    const imageBytes = generatedImage.image?.imageBytes

    if (!imageBytes) {
      throw new Error('No image data received')
    }

    return NextResponse.json({
      imageUrl: `data:image/png;base64,${imageBytes}`,
      analysis,
      model: "gemini-1.5-pro-vision + imagen-4.0"
    })

  } catch (error) {
    console.error('Error assembling mascot with Google AI:', error)
    
    if (error instanceof Error) {
      if (error.message.includes('billing')) {
        return NextResponse.json(
          { error: 'Billing issue. Please check your Google AI Studio account balance.' },
          { status: 402 }
        )
      }
      if (error.message.includes('quota')) {
        return NextResponse.json(
          { error: 'Quota exceeded. Please check your usage limits.' },
          { status: 429 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Failed to assemble mascot. Please try again.' },
      { status: 500 }
    )
  }
} 