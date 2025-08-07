import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI, Modality } from "@google/genai"
import fs from 'fs'
import path from 'path'
import { COMPREHENSIVE_TRAITS } from '@/lib/comprehensive-traits'

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

    // Helper function to generate trait descriptions
    const getTraitDescription = (traits: any) => {
      let description = ''

      // Head modifications
      if (traits.head && traits.head !== 'default') {
        if (traits.head === 'sharp-jawline') {
          description += 'The character has a sharp, defined jawline. '
        } else if (traits.head.includes('pepe')) {
          description += 'The character has a pepe (frog meme) face style. '
        } else if (traits.head.includes('doge')) {
          description += 'The character has a doge (shiba inu) face style. '
        } else if (traits.head.includes('goku')) {
          description += 'The character has a Goku (Dragon Ball) anime style face. '
        } else if (traits.head.includes('matrix')) {
          description += 'The character has a matrix digital code face style. '
        } else if (traits.head.includes('pixel')) {
          description += 'The character has a pixel/8-bit style face. '
        } else if (traits.head.includes('anime')) {
          description += 'The character has an anime style face. '
        } else if (traits.head.includes('metallic')) {
          description += 'The character has a metallic/chrome face style. '
        } else if (traits.head.includes('neon')) {
          description += 'The character has a neon glowing face style. '
        } else if (traits.head.includes('cyber')) {
          description += 'The character has a cyberpunk style face. '
        } else if (traits.head.includes('fantasy')) {
          description += 'The character has a fantasy/magical face style. '
        } else if (traits.head.includes('sci-fi')) {
          description += 'The character has a science fiction face style. '
        } else if (traits.head.includes('memes') || traits.head.includes('wojak') || traits.head.includes('chad')) {
          description += `The character has a ${traits.head} meme face style. `
        } else if (traits.head.includes('gaming') || traits.head.includes('minecraft') || traits.head.includes('roblox')) {
          description += `The character has a ${traits.head} gaming style face. `
        } else {
          description += `The character has a ${traits.head} colored head. `
        }
      }

      // Eye modifications
      if (traits.eyes && traits.eyes !== 'brown') {
        if (traits.eyes.includes('glowing') || traits.eyes.includes('neon') || traits.eyes.includes('laser')) {
          description += `The character has ${traits.eyes} glowing eyes. `
        } else if (traits.eyes.includes('anime')) {
          description += 'The character has anime style eyes. '
        } else if (traits.eyes.includes('demonic') || traits.eyes.includes('angelic')) {
          description += `The character has ${traits.eyes} eyes. `
        } else {
          description += `The character has ${traits.eyes} colored eyes. `
        }
      }

      // Glasses
      if (traits.glasses && traits.glasses !== 'none') {
        if (traits.glasses.includes('cyber') || traits.glasses.includes('tech') || traits.glasses.includes('matrix')) {
          description += `The character is wearing ${traits.glasses} tech glasses. `
        } else if (traits.glasses.includes('vintage') || traits.glasses.includes('retro')) {
          description += `The character is wearing ${traits.glasses} vintage glasses. `
        } else {
          description += `The character is wearing ${traits.glasses} glasses. `
        }
      }

      // Clothing colors
      if (traits.shirt && traits.shirt !== 'orange') {
        description += `The character is wearing a ${traits.shirt} colored shirt. `
      }
      if (traits.pants && traits.pants !== 'blue') {
        description += `The character is wearing ${traits.pants} colored pants. `
      }
      if (traits.shoes && traits.shoes !== 'black') {
        description += `The character is wearing ${traits.shoes} colored shoes. `
      }

      // Accessories - CRITICAL: Use existing hands, NEVER add new ones
      if (traits.accessories && traits.accessories !== 'none') {
        if (traits.accessories === 'sword') {
          description += 'The character is holding a sword in their EXISTING hands. CRITICAL: Do NOT add new hands, do NOT change hand positions, do NOT add third or fourth hands. Use ONLY the hands that are already touching the bowtie. '
        } else if (traits.accessories === 'lightsaber') {
          description += 'The character is holding a lightsaber in their EXISTING hands. CRITICAL: Do NOT add new hands, do NOT change hand positions, do NOT add third or fourth hands. Use ONLY the hands that are already touching the bowtie. '
        } else if (traits.accessories === 'crown') {
          description += 'The character is wearing a crown. '
        } else if (traits.accessories.includes('weapon') || traits.accessories.includes('dagger') || traits.accessories.includes('bow')) {
          description += `The character is holding a ${traits.accessories} in their EXISTING hands. CRITICAL: Do NOT add new hands, do NOT change hand positions, do NOT add third or fourth hands. Use ONLY the hands that are already touching the bowtie. `
        } else if (traits.accessories.includes('tech') || traits.accessories.includes('phone') || traits.accessories.includes('laptop')) {
          description += `The character has a ${traits.accessories} tech accessory. `
        } else if (traits.accessories.includes('magic') || traits.accessories.includes('wand') || traits.accessories.includes('staff')) {
          description += `The character has a ${traits.accessories} magical item. `
        } else {
          description += `The character has ${traits.accessories} as an accessory. `
        }
      }

      // Background
      if (traits.background) {
        if (traits.background === 'yellow-stars') {
          description += 'The background is yellow with stars scattered across it. '
        } else if (traits.background.includes('matrix')) {
          description += 'The background has a matrix digital code pattern. '
        } else if (traits.background.includes('cyber')) {
          description += 'The background has a cyberpunk style. '
        } else if (traits.background.includes('space')) {
          description += 'The background shows a space/galaxy scene. '
        } else if (traits.background.includes('fantasy')) {
          description += 'The background has a fantasy/magical theme. '
        } else if (traits.background.includes('nature')) {
          description += 'The background shows a natural landscape. '
        } else if (traits.background.includes('urban')) {
          description += 'The background shows an urban cityscape. '
        } else if (traits.background.includes('abstract')) {
          description += 'The background has an abstract artistic style. '
        } else if (traits.background.includes('art')) {
          description += 'The background has an artistic style. '
        } else {
          description += `The background is ${traits.background}. `
        }
      }

      // Hat
      if (traits.hat && traits.hat !== 'none') {
        if (traits.hat.includes('crown') || traits.hat.includes('tiara')) {
          description += `The character is wearing a ${traits.hat}. `
        } else if (traits.hat.includes('tech') || traits.hat.includes('vr') || traits.hat.includes('cyber')) {
          description += `The character is wearing a ${traits.hat} tech headgear. `
        } else if (traits.hat.includes('fantasy') || traits.hat.includes('wizard') || traits.hat.includes('knight')) {
          description += `The character is wearing a ${traits.hat} fantasy headgear. `
        } else {
          description += `The character is wearing a ${traits.hat}. `
        }
      }

      // Bowtie
      if (traits.bowtie && traits.bowtie !== 'none') {
        description += `The character is wearing a ${traits.bowtie} colored bowtie. `
      }

      return description
    }

    const traitDescription = getTraitDescription(traits)

    // Create a detailed prompt for assembly
    const prompt = `**TASK: CHARACTER HEAD REPLACEMENT WITH TRAIT MODIFICATIONS**

    **CRITICAL WARNING: HANDS MUST REMAIN UNCHANGED**
    - The character's hands in IMAGE 2 are touching a bowtie
    - These hands MUST stay in their exact positions
    - Do NOT add new hands, do NOT change hand positions, do NOT add third or fourth hands
    - Use ONLY the existing hands for any accessories

    **INPUTS:**
    - **IMAGE 1:** The NEW HEAD to be used (head.png).
    - **IMAGE 2:** The character BODY (body.png), which includes an OLD HEAD that must be replaced.

    **PROCEDURE:**
    1.  **ISOLATE BODY:** From IMAGE 2, isolate the character's body, completely removing its original head. No part of the old head should remain.
    2.  **ISOLATE NEW HEAD:** From IMAGE 1, take the complete head design.
    3.  **ASSEMBLE:** Attach the NEW HEAD from IMAGE 1 onto the isolated BODY from IMAGE 2. Ensure the placement is natural and aligns with the neck/shoulders.
    4.  **APPLY TRAITS:** After the head replacement is complete, apply the following modifications to the newly assembled character:

    ${traitDescription}

    **STRICT RULES FOR NFT-Grade CONSISTENCY:**
    - **NO DEVIATION:** The final character's pose, proportions, angle, and art style MUST be IDENTICAL to IMAGE 2 (the body reference).
    - **PERFECT REPLICATION:** The new head in the final image MUST be a PERFECT replica of IMAGE 1.
    - **SEAMLESS BLEND:** The art styles of the head and body must blend perfectly.
    - **ONLY SPECIFIED CHANGES:** Do not add, remove, or change ANY elements other than the head replacement and the listed traits. Every generation must be otherwise identical.
    - **CRITICAL HANDS RULE:** The character's hands MUST remain in their EXACT original positions from IMAGE 2. Do NOT add additional hands, do NOT change hand positions, do NOT add third or fourth hands. The hands that are touching the bowtie must stay exactly where they are.
    - **ACCESSORIES RULE:** If accessories like swords are mentioned, add them naturally to the character's EXISTING hands ONLY. Use the hands that are already touching the bowtie. Do NOT create new hands or modify the hand positions.
    - **ABSOLUTE HANDS RESTRICTION:** Under NO circumstances should you add new hands, change hand positions, or create additional hands. The hands from IMAGE 2 must remain unchanged.
    - **BACKGROUND:** Apply the background modifications as specified in the trait description.
    - **FACE STYLES:** If specific face styles (pepe, doge, goku, matrix, etc.) are mentioned, apply them to the character's face/screen area while maintaining the mascot's basic structure.`

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
      prompt: prompt,
      traits: traits
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