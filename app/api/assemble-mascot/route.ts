import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import fs from 'fs'
import path from 'path'

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

    // Read the base images from the app/images folder
    const headImagePath = path.join(process.cwd(), 'app', 'images', 'head.svg')
    const bodyImagePath = path.join(process.cwd(), 'app', 'images', 'body.jpg')

    // Convert images to base64
    const headImageBuffer = fs.readFileSync(headImagePath)
    const bodyImageBuffer = fs.readFileSync(bodyImagePath)
    
    const headImageBase64 = headImageBuffer.toString('base64')
    const bodyImageBase64 = bodyImageBuffer.toString('base64')

    // Create data URLs
    const headImageUrl = `data:image/svg+xml;base64,${headImageBase64}`
    const bodyImageUrl = `data:image/jpeg;base64,${bodyImageBase64}`

    // Create a comprehensive prompt for GPT-4V to assemble the mascot
    const assemblyPrompt = `
You are a mascot assembly expert. I have provided you with two base images:
1. A mascot head image
2. A mascot body image

Please analyze both images and create a complete Candle TV mascot by:

1. **Analyzing the head image**: Identify the character's facial features, expression, and style
2. **Analyzing the body image**: Identify the clothing, pose, and overall body structure
3. **Combining them logically**: Ensure the head and body work together naturally
4. **Adding Candle TV branding**: Incorporate orange and black color scheme where appropriate
5. **Applying customizations**: ${traits.hat !== 'none' ? `Add a ${traits.hat}` : 'No hat'}
6. **Color modifications**: Apply the following color scheme:
   - Head color: ${traits.head || 'default'}
   - Background: ${traits.background || 'light beige'}
   - Glasses: ${traits.glasses === 'none' ? 'No glasses' : traits.glasses}
   - Bowtie: ${traits.bowtie === 'none' ? 'No bowtie' : traits.bowtie + ' bowtie'}
   - Pants: ${traits.pants || 'default'}

Please provide:
1. A detailed analysis of how to combine these parts
2. Suggestions for improvements
3. Specific instructions for the final assembly

Focus on creating a cohesive, professional mascot suitable for Candle TV branding.
`

    // Use GPT-4V to analyze and provide assembly instructions
    const analysisResponse = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: assemblyPrompt },
            {
              type: "image_url",
              image_url: {
                url: headImageUrl,
              },
            },
            {
              type: "image_url", 
              image_url: {
                url: bodyImageUrl,
              },
            },
          ],
        },
      ],
      max_tokens: 1000,
    })

    const analysis = analysisResponse.choices[0]?.message?.content || ''

    // Create enhanced prompt for DALL-E 3 based on GPT-4V analysis
    const enhancedPrompt = `
Create a complete Candle TV mascot by combining these elements:

HEAD: Use the head style from the provided head image with ${traits.head || 'default'} color
BODY: Use the body style from the provided body image

Assembly Instructions from GPT-4V Analysis:
${analysis}

Requirements:
- Combine head and body seamlessly
- Maintain Candle TV branding (orange/black color scheme)
- Apply customizations: ${traits.hat !== 'none' ? `Add ${traits.hat}` : 'No hat'}, ${traits.glasses !== 'none' ? traits.glasses : 'No glasses'}, ${traits.bowtie !== 'none' ? traits.bowtie + ' bowtie' : 'No bowtie'}
- Background: ${traits.background || 'light beige'}
- Pants: ${traits.pants || 'default'} color
- Make it cohesive and professional

Style: Cute, cartoon-style mascot suitable for Candle TV branding
Quality: High-quality, professional mascot design
`

    // Generate the final assembled image using DALL-E 3
    const imageResponse = await openai.images.generate({
      model: "dall-e-3",
      prompt: enhancedPrompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
      style: "vivid",
    })

    const imageUrl = imageResponse.data?.[0]?.url

    if (!imageUrl) {
      throw new Error('No image generated')
    }

    return NextResponse.json({
      imageUrl,
      analysis,
      assemblyInstructions: enhancedPrompt,
      model: "gpt-4v + dall-e-3"
    })

  } catch (error) {
    console.error('Error assembling mascot:', error)
    
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
      { error: 'Failed to assemble mascot. Please try again.' },
      { status: 500 }
    )
  }
} 