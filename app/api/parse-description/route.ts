import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI } from "@google/genai"
import { COMPREHENSIVE_TRAITS, getAllTraitValues } from '@/lib/comprehensive-traits'

export async function POST(request: NextRequest) {
  try {
    const { description } = await request.json()

    if (!description) {
      return NextResponse.json(
        { error: 'Description is required' },
        { status: 400 }
      )
    }

    // Initialize Google AI with API key
    const ai = new GoogleGenAI({
      apiKey: process.env.GOOGLE_AI_KEY
    })

    // Get all possible trait values for the AI to reference
    const allTraitValues = getAllTraitValues()

    // Create a detailed prompt for parsing the description
    const prompt = `**TASK: PARSE MASCOT DESCRIPTION INTO STRUCTURED TRAITS**

**INPUT:** A natural language description of a mascot character.

**DESCRIPTION:** "${description}"

**REQUIRED OUTPUT:** Parse this description and extract the following traits in JSON format:

{
  "head": "color/style or 'default'",
  "eyes": "color/style or 'brown'",
  "glasses": "type or 'none'",
  "shirt": "color or 'orange'",
  "pants": "color or 'blue'",
  "shoes": "color or 'black'",
  "accessories": "item or 'none'",
  "background": "color/theme or 'white'",
  "hat": "type or 'none'",
  "bowtie": "color or 'none'"
}

**CRITICAL BACKGROUND RULES:**
- **NEVER default to 'black' background unless explicitly mentioned**
- **If no background is specified, use 'white' as default**
- **Look for ANY mention of background, environment, or setting**
- **Common background indicators: 'on', 'in', 'with', 'against', 'background', 'setting', 'environment'**
- **Examples: 'on a blue background' → background: 'blue', 'in a forest' → background: 'forest'**

**COMPREHENSIVE TRAIT DATABASE - ALL POSSIBLE VALUES:**

**HEAD STYLES (face/screen content):**
${allTraitValues.head.join(', ')}

**EYE STYLES:**
${allTraitValues.eyes.join(', ')}

**GLASSES TYPES:**
${allTraitValues.glasses.join(', ')}

**CLOTHING COLORS (shirt/pants/shoes):**
${allTraitValues.clothing.join(', ')}

**ACCESSORIES:**
${allTraitValues.accessories.join(', ')}

**BACKGROUND THEMES (IMPORTANT - Look carefully for these):**
${allTraitValues.background.join(', ')}

**HAT TYPES:**
${allTraitValues.hat.join(', ')}

**BOWTIE COLORS:**
${allTraitValues.bowtie.join(', ')}

**BACKGROUND DETECTION EXAMPLES:**
- "mascot on a blue background" → background: "blue"
- "mascot in a forest setting" → background: "forest"
- "mascot against a white wall" → background: "white"
- "mascot with a sunset behind" → background: "sunset"
- "mascot in space" → background: "space"
- "mascot on a beach" → background: "beach"
- "mascot in a city" → background: "city"
- "mascot with a galaxy background" → background: "galaxy"
- "mascot in a cyberpunk setting" → background: "cyber"
- "mascot with a neon background" → background: "neon"
- "mascot in a fantasy world" → background: "fantasy"
- "mascot with a geometric pattern" → background: "geometric"
- "mascot on a gradient background" → background: "gradients"
- "mascot with a solid color background" → background: "solid"

**CONTEXT UNDERSTANDING:**
- If "sharp jawline" is mentioned, set head to "sharp-jawline"
- If "sword" is mentioned, set accessories to "sword"
- If "yellow background with stars" is mentioned, set background to "yellow-stars"
- If "blue eyes" is mentioned, set eyes to "blue"
- If "pepe" is mentioned, set head to "pepe" (frog meme face)
- If "lightsaber" is mentioned, set accessories to "lightsaber"
- If "matrix" is mentioned, set background to "matrix" and head to "matrix"
- If "goku" is mentioned, set head to "goku" and eyes to "anime"
- If "doge" is mentioned, set head to "doge"
- If "cyber" is mentioned, set glasses to "tech" and background to "cyber"
- If "neon" is mentioned, set eyes to "neon" and background to "neon"
- If "pixel" is mentioned, set head to "pixel"
- If "metallic" is mentioned, set head to "metallic"
- If "weapon" is mentioned, set accessories to the weapon type
- If "magic" is mentioned, set accessories to "wand" or "staff"
- If "tech" is mentioned, set glasses to "tech" and background to "cyber"
- If "fantasy" is mentioned, set background to "fantasy"
- If "space" is mentioned, set background to "space"
- If "nature" is mentioned, set background to "nature"
- If "urban" is mentioned, set background to "urban"
- If "abstract" is mentioned, set background to "abstract"
- If "art" is mentioned, set background to "art-styles"

**FACE STYLE CONCEPTS:**
- **sharp-jawline:** Defined, angular jawline style
- **pepe:** Frog meme face displayed inside the mascot's screen
- **doge:** Shiba Inu meme face shown inside the mascot's screen
- **goku:** Dragon Ball anime style inside the mascot's screen
- **matrix:** Digital green code flowing inside the mascot's screen
- **pixel:** 8-bit style displayed inside the mascot's screen
- **anime:** Generic anime style inside the screen
- **metallic:** Chrome/metallic style inside the screen
- **neon:** Glowing neon style inside the screen
- **cyber:** Cyberpunk style inside the screen
- **fantasy:** Fantasy/magical style inside the screen
- **sci-fi:** Science fiction style inside the screen

**IMPORTANT:** These face styles are meant to be displayed *inside* the mascot's existing face/screen structure, not replace the entire face. The mascot maintains its basic structure with the creative style shown within.

**OUTPUT FORMAT:** Return ONLY the JSON object, no additional text or explanation.

**EXAMPLE INPUT:** "a mascot with sharp jawline,blue eyes, and sword in his left arm and yellow background with stars"

**EXAMPLE OUTPUT:** {"head":"sharp-jawline","eyes":"blue","glasses":"none","shirt":"orange","pants":"blue","shoes":"black","accessories":"sword","background":"yellow-stars","hat":"none","bowtie":"none"}`

    // Generate structured traits using Gemini
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: [{ text: prompt }],
    })

    const responseText = response.candidates?.[0]?.content?.parts?.[0]?.text
    if (!responseText) {
      throw new Error('No response from AI')
    }

    // Extract JSON from the response
    let traits
    try {
      // Try to find JSON in the response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        traits = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('No JSON found in response')
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', responseText)
      throw new Error('Failed to parse AI response into valid JSON')
    }

    // Validate and normalize the traits
    const defaultTraits = {
      head: 'default',
      eyes: 'brown',
      glasses: 'none',
      shirt: 'orange',
      pants: 'blue',
      shoes: 'black',
      accessories: 'none',
      background: 'white', // Changed from '#F5F5DC' to 'white' for better AI recognition
      hat: 'none',
      bowtie: 'none'
    }

    // Merge with defaults and validate
    const finalTraits = { ...defaultTraits, ...traits }

    // Special handling for background to prevent black default
    if (finalTraits.background === 'black' && !description.toLowerCase().includes('black') && !description.toLowerCase().includes('dark')) {
      // If AI defaulted to black but it wasn't mentioned, try to find a better background
      const backgroundKeywords = ['blue', 'green', 'red', 'yellow', 'white', 'orange', 'purple', 'pink', 'forest', 'beach', 'space', 'city', 'nature', 'sunset', 'sunrise', 'sky', 'ocean', 'mountain', 'galaxy', 'stars', 'neon', 'cyber', 'fantasy', 'abstract']
      
      for (const keyword of backgroundKeywords) {
        if (description.toLowerCase().includes(keyword)) {
          finalTraits.background = keyword
          break
        }
      }
      
      // If still no good match, default to white instead of black
      if (finalTraits.background === 'black') {
        finalTraits.background = 'white'
      }
    }

    return NextResponse.json({
      traits: finalTraits,
      originalDescription: description,
      aiResponse: responseText,
      model: "gemini-2.0-flash-exp",
      availableTraits: allTraitValues
    })

  } catch (error) {
    console.error('Error parsing description with AI:', error)
    
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
      { error: 'Failed to parse description. Please try again.' },
      { status: 500 }
    )
  }
} 