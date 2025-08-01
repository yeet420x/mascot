import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI, Modality } from "@google/genai"
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

    // Read both head and body images
    const headImagePath = path.join(process.cwd(), 'app', 'images', 'head.png')
    const bodyImagePath = path.join(process.cwd(), 'app', 'images', 'body.png')
    
    const headImageBuffer = fs.readFileSync(headImagePath)
    const bodyImageBuffer = fs.readFileSync(bodyImagePath)
    
    const headImageBase64 = headImageBuffer.toString('base64')
    const bodyImageBase64 = bodyImageBuffer.toString('base64')

    // Initialize Google AI with API key
    const ai = new GoogleGenAI({
      apiKey: process.env.GOOGLE_AI_KEY
    })

    // Create a detailed prompt for assembly
    const prompt = `**TASK: CHARACTER HEAD REPLACEMENT**

    **INPUTS:**
    - **IMAGE 1:** The NEW HEAD to be used (head.png).
    - **IMAGE 2:** The character BODY (body.png), which includes an OLD HEAD that must be replaced.

    **PROCEDURE:**
    1.  **ISOLATE BODY:** From IMAGE 2, isolate the character's body, completely removing its original head. No part of the old head should remain.
    2.  **ISOLATE NEW HEAD:** From IMAGE 1, take the complete head design.
    3.  **ASSEMBLE:** Attach the NEW HEAD from IMAGE 1 onto the isolated BODY from IMAGE 2. Ensure the placement is natural and aligns with the neck/shoulders.
    4.  **APPLY TRAITS:** After the head replacement is complete, apply the following modifications to the newly assembled character:
        - Head Color: ${traits.head !== 'default' ? `${traits.head} colored head` : 'orange colored head'}
        - Background: ${traits.background || 'light beige'} background
        - Glasses: ${traits.glasses !== 'none' ? `wearing ${traits.glasses} glasses` : 'no glasses'}
        - Hat: ${traits.hat !== 'none' ? `wearing ${traits.hat}` : 'no hat'}
        - Bowtie: ${traits.bowtie !== 'none' ? `wearing ${traits.bowtie} bowtie` : 'no bowtie'}
        - Pants Color: ${traits.pants !== 'default' ? `${traits.pants} colored pants` : 'default pants'}

    **STRICT RULES FOR NFT-Grade CONSISTENCY:**
    - **NO DEVIATION:** The final character's pose, proportions, angle, and art style MUST be IDENTICAL to IMAGE 2 (the body reference).
    - **PERFECT REPLICATION:** The new head in the final image MUST be a PERFECT replica of IMAGE 1.
    - **SEAMLESS BLEND:** The art styles of the head and body must blend perfectly.
    - **ONLY SPECIFIED CHANGES:** Do not add, remove, or change ANY elements other than the head replacement and the listed traits. Every generation must be otherwise identical.`

    // Prepare the content parts with both images
    const contents = [
      { text: prompt },
      {
        inlineData: {
          mimeType: "image/png",
          data: headImageBase64,
        },
      },
      {
        inlineData: {
          mimeType: "image/png",
          data: bodyImageBase64,
        },
      },
    ]

    // Generate image using Gemini's image generation model
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-preview-image-generation",
      contents: contents,
      config: {
        responseModalities: [Modality.TEXT, Modality.IMAGE],
      },
    })

    // Extract the generated image
    const generatedImage = response.candidates?.[0]?.content?.parts?.find(part => part.inlineData)
    if (!generatedImage?.inlineData?.data) {
      throw new Error('No image generated')
    }

    return NextResponse.json({
      imageUrl: `data:image/png;base64,${generatedImage.inlineData.data}`,
      model: "gemini-2.0-flash-preview-image-generation",
      prompt: prompt
    })

  } catch (error) {
    console.error('Error generating image with Google AI:', error)
    
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
      { error: 'Failed to generate image. Please try again.' },
      { status: 500 }
    )
  }
} 