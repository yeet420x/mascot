import { NextRequest, NextResponse } from 'next/server'
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

    // Create data URLs
    const headImageUrl = `data:image/svg+xml;base64,${headImageBase64}`
    const bodyImageUrl = `data:image/jpeg;base64,${bodyImageBase64}`

    // Use Claude for image analysis
    const analysisResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.CLAUDE_API_KEY || '',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
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
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: 'image/svg+xml',
                  data: headImageBase64
                }
              },
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: 'image/jpeg',
                  data: bodyImageBase64
                }
              }
            ]
          }
        ]
      })
    })

    if (!analysisResponse.ok) {
      throw new Error('Failed to analyze images with Claude')
    }

    const analysisData = await analysisResponse.json()
    const analysis = analysisData.content?.[0]?.text || ''

    // Use Stability AI for final generation
    const generationResponse = await fetch('https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.STABILITY_API_KEY}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        text_prompts: [
          {
            text: `Create a complete Candle TV mascot combining these elements: ${analysis}. Style: cute cartoon mascot, orange and black theme, professional design, ${traits.hat !== 'none' ? `wearing ${traits.hat}` : ''}, ${traits.glasses !== 'none' ? `wearing ${traits.glasses} glasses` : ''}, ${traits.bowtie !== 'none' ? `wearing ${traits.bowtie} bowtie` : ''}, background: ${traits.background || 'light beige'}`,
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

    if (!generationResponse.ok) {
      throw new Error('Failed to generate final image')
    }

    const generationData = await generationResponse.json()
    const imageUrl = generationData.artifacts?.[0]?.base64

    if (!imageUrl) {
      throw new Error('No image generated')
    }

    return NextResponse.json({
      imageUrl: `data:image/png;base64,${imageUrl}`,
      analysis,
      model: "claude-3 + stable-diffusion-xl"
    })

  } catch (error) {
    console.error('Error assembling mascot with Claude + Stability:', error)
    
    if (error instanceof Error) {
      if (error.message.includes('billing')) {
        return NextResponse.json(
          { error: 'Billing issue. Please check your API account balances.' },
          { status: 402 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Failed to assemble mascot. Please try again.' },
      { status: 500 }
    )
  }
} 