import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { MascotData } from '@/types/mascot'

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

    const prompt = `
You are a mascot customization assistant. Based on the user's description, generate appropriate traits for a Candle TV mascot.

Available trait categories and options:
- head: default, orange, blue, green, red, purple, yellow, pink, gray, black
- eyes: default, blue, green, brown, gray, black
- glasses: none, round, square, sunglasses
- shirt: default, orange, blue, green, red, purple, yellow, pink, gray, black, white
- pants: default, blue, black, gray, brown, green, red
- shoes: default, black, brown, white, red, blue
- accessories: none, hat, crown, bowtie, necklace

User description: "${description}"

Please analyze the description and return a JSON object with the traits that best match the user's request. Focus on:
1. Colors mentioned in the description
2. Accessories or items mentioned
3. Overall style or personality
4. Default to orange/black theme if no specific colors mentioned (Candle TV branding)

Return only the JSON object with the traits, no additional text.
`

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that generates mascot traits based on descriptions. Always respond with valid JSON only."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 200,
    })

    const responseText = completion.choices[0]?.message?.content || ''
    
    // Try to parse the JSON response
    let traits
    try {
      // Extract JSON from the response (in case there's extra text)
      const jsonMatch = responseText.match(/\{.*\}/)
      if (jsonMatch) {
        traits = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('No JSON found in response')
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', responseText)
      // Fallback to default traits
      traits = {
        head: 'orange',
        eyes: 'default',
        glasses: 'none',
        shirt: 'orange',
        pants: 'default',
        shoes: 'default',
        accessories: 'none'
      }
    }

    // Ensure all required traits are present
    const defaultTraits = {
      head: 'orange',
      eyes: 'default',
      glasses: 'none',
      shirt: 'orange',
      pants: 'default',
      shoes: 'default',
      accessories: 'none'
    }

    const mascot: MascotData = {
      name: '',
      traits: { ...defaultTraits, ...traits }
    }

    return NextResponse.json({ mascot })

  } catch (error) {
    console.error('Error generating mascot:', error)
    return NextResponse.json(
      { error: 'Failed to generate mascot' },
      { status: 500 }
    )
  }
} 