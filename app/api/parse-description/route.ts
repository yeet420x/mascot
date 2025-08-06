import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI } from "@google/genai"

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
  "background": "color/theme or '#F5F5DC'",
  "hat": "type or 'none'",
  "bowtie": "color or 'none'"
}

**COMPREHENSIVE TRAIT RULES:**

**HEAD STYLES (face/screen content):**
- **Colors:** orange, blue, green, red, purple, yellow, pink, gray, black, white, brown, gold, silver, cyan, magenta
- **Memes:** pepe, doge, wojak, chad, virgin, stonks, cheems, bonk, kek, monke, cat, dog, frog, rare
- **Anime:** goku, naruto, luffy, saitama, deku, allmight, vegeta, goku, anime, manga, otaku, weeb
- **Gaming:** pixel, 8bit, minecraft, roblox, fortnite, valorant, csgo, league, dota, overwatch, pokemon
- **Tech:** matrix, cyber, digital, neon, glitch, hologram, vr, ar, ai, robot, android, cyborg
- **Fantasy:** dragon, unicorn, wizard, elf, dwarf, orc, goblin, fairy, demon, angel, vampire, werewolf
- **Sci-fi:** alien, space, galaxy, planet, star, nebula, blackhole, wormhole, time, dimension, quantum
- **Art Styles:** cartoon, realistic, anime, manga, chibi, kawaii, gothic, punk, steampunk, cyberpunk, vaporwave
- **Materials:** metallic, chrome, gold, silver, bronze, crystal, diamond, obsidian, marble, wood, stone

**EYE STYLES:**
- **Colors:** brown, blue, green, hazel, gray, black, amber, violet, golden, red, pink, white, yellow
- **Effects:** glowing, neon, laser, fire, ice, electric, rainbow, prismatic, hypnotic, demonic, angelic
- **Styles:** anime, realistic, cartoon, pixel, matrix, cyber, tech, magical, mystical, cursed, blessed
- **Shapes:** round, oval, almond, cat, snake, dragon, alien, robot, mechanical, organic, crystalline

**GLASSES TYPES:**
- **Basic:** none, round, square, rectangular, oval, cat-eye, aviator, wayfarer, rimless, half-rim
- **Tech:** cyber, matrix, hologram, vr, ar, smart, digital, futuristic, sci-fi, tech, neon, glowing
- **Styles:** vintage, retro, modern, classic, trendy, hipster, professional, casual, sporty, elegant
- **Materials:** metal, plastic, wood, crystal, diamond, gold, silver, chrome, matte, glossy, transparent

**CLOTHING COLORS (shirt/pants/shoes):**
- **Standard:** orange, blue, green, red, purple, pink, gray, white, black, yellow, brown, gold, silver
- **Extended:** cyan, magenta, teal, indigo, violet, maroon, burgundy, navy, olive, lime, coral, salmon
- **Metallic:** chrome, bronze, copper, platinum, titanium, steel, iron, brass, pewter, nickel
- **Patterns:** camo, plaid, stripes, dots, stars, hearts, flowers, geometric, tribal, abstract, tie-dye

**ACCESSORIES:**
- **Jewelry:** crown, necklace, watch, bracelet, earrings, ring, chain, pendant, brooch, tiara, diadem
- **Clothing:** scarf, tie, belt, backpack, purse, gloves, socks, cape, cloak, robe, armor, vest
- **Weapons:** lightsaber, sword, dagger, bow, arrow, gun, blaster, staff, wand, shield, axe, hammer
- **Tech:** phone, tablet, laptop, drone, robot, hologram, portal, device, gadget, tool, instrument
- **Magic:** wand, staff, orb, crystal, gem, rune, scroll, potion, spell, charm, talisman, amulet
- **Sports:** ball, racket, bat, glove, helmet, pads, uniform, jersey, cleats, sneakers, boots
- **Nature:** flower, leaf, branch, stone, crystal, feather, shell, bone, fossil, gem, mineral

**BACKGROUND THEMES:**
- **Nature:** forest, jungle, desert, mountain, ocean, beach, sky, clouds, sunset, sunrise, night, day
- **Urban:** city, street, building, office, home, room, cafe, shop, mall, park, bridge, road
- **Space:** galaxy, stars, planets, nebula, blackhole, wormhole, space, cosmos, universe, void
- **Tech:** matrix, cyber, digital, neon, glitch, hologram, circuit, data, code, binary, network
- **Fantasy:** castle, dungeon, tower, temple, cave, portal, realm, dimension, world, kingdom
- **Abstract:** geometric, patterns, gradients, solid, textured, animated, moving, flowing, swirling
- **Art Styles:** painting, drawing, photo, digital, pixel, vector, 3d, realistic, cartoon, anime

**HAT TYPES:**
- **Caps:** red-cap, orange-cap, blue-cap, green-cap, purple-cap, yellow-cap, pink-cap, black-cap, white-cap
- **Formal:** crown, tiara, diadem, beret, fedora, bowler, top-hat, cowboy, baseball-cap, beanie
- **Fantasy:** wizard-hat, witch-hat, knight-helmet, viking-helmet, samurai-helmet, pirate-hat
- **Tech:** vr-headset, ar-glasses, cyber-helmet, space-helmet, robot-head, android-head

**BOWTIE COLORS:**
- **Standard:** none, red, blue, green, purple, orange, yellow, pink, black, white, gold, silver
- **Extended:** cyan, magenta, teal, indigo, violet, maroon, burgundy, navy, olive, lime, coral

**SPECIAL CASES & CREATIVE CONCEPTS:**
- **Memes:** pepe, doge, wojak, chad, virgin, stonks, cheems, bonk, kek, monke, cat, dog, frog, rare
- **Anime:** goku, naruto, luffy, saitama, deku, allmight, vegeta, anime, manga, otaku, weeb
- **Gaming:** minecraft, roblox, fortnite, valorant, csgo, league, dota, overwatch, pokemon, pixel, 8bit
- **Sci-fi:** lightsaber, blaster, phaser, laser, plasma, energy, force, jedi, sith, star-wars, star-trek
- **Fantasy:** sword, dagger, bow, arrow, staff, wand, shield, axe, hammer, magic, spell, potion
- **Tech:** matrix, cyber, digital, neon, glitch, hologram, vr, ar, ai, robot, android, cyborg
- **Materials:** metallic, chrome, gold, silver, bronze, crystal, diamond, obsidian, marble, wood, stone
- **Effects:** glowing, neon, laser, fire, ice, electric, rainbow, prismatic, hypnotic, demonic, angelic

**CONTEXT UNDERSTANDING:**
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

**FACE STYLE CONCEPTS:**
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

**EXAMPLE INPUT:** "A pepe face mascot with neon eyes, cyber glasses, wearing a black shirt and red pants holding a lightsaber"

**EXAMPLE OUTPUT:** {"head":"pepe","eyes":"neon","glasses":"tech","shirt":"black","pants":"red","shoes":"black","accessories":"lightsaber","background":"cyber","hat":"none","bowtie":"none"}`

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
      background: '#F5F5DC',
      hat: 'none',
      bowtie: 'none'
    }

    // Merge with defaults and validate
    const finalTraits = { ...defaultTraits, ...traits }

    return NextResponse.json({
      traits: finalTraits,
      originalDescription: description,
      aiResponse: responseText,
      model: "gemini-2.0-flash-exp"
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