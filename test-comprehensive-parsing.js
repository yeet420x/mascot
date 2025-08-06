// Comprehensive test script for expanded AI parsing capabilities

const testComprehensiveParsing = async () => {
  const testCases = [
    {
      description: "A pepe face mascot with neon eyes, cyber glasses, wearing a black shirt and red pants holding a lightsaber",
      expected: {
        head: 'pepe',
        eyes: 'neon',
        glasses: 'tech',
        shirt: 'black',
        pants: 'red',
        accessories: 'lightsaber',
        background: 'cyber'
      },
      category: "Memes + Sci-fi"
    },
    {
      description: "A goku face mascot with anime eyes, pixel style, purple shirt and green pants with a crown",
      expected: {
        head: 'goku',
        eyes: 'anime',
        shirt: 'purple',
        pants: 'green',
        accessories: 'crown'
      },
      category: "Anime + Gaming"
    },
    {
      description: "A chad face mascot with laser eyes, metallic glasses, wearing a gold shirt and silver pants with a sword",
      expected: {
        head: 'chad',
        eyes: 'laser',
        glasses: 'metallic',
        shirt: 'gold',
        pants: 'silver',
        accessories: 'sword'
      },
      category: "Memes + Fantasy"
    },
    {
      description: "A matrix face mascot with digital eyes, cyber background, holding a blaster and wearing armor",
      expected: {
        head: 'matrix',
        eyes: 'digital',
        background: 'cyber',
        accessories: 'blaster'
      },
      category: "Tech + Sci-fi"
    },
    {
      description: "A wojak face mascot with sad eyes, vintage glasses, wearing a gray hoodie and black pants",
      expected: {
        head: 'wojak',
        eyes: 'sad',
        glasses: 'vintage',
        shirt: 'gray',
        pants: 'black'
      },
      category: "Memes + Vintage"
    },
    {
      description: "A naruto face mascot with sharingan eyes, ninja glasses, wearing an orange jumpsuit with a kunai",
      expected: {
        head: 'naruto',
        eyes: 'sharingan',
        glasses: 'ninja',
        shirt: 'orange',
        accessories: 'kunai'
      },
      category: "Anime + Weapons"
    },
    {
      description: "A minecraft face mascot with pixel eyes, block glasses, wearing a green shirt and brown pants with a diamond sword",
      expected: {
        head: 'minecraft',
        eyes: 'pixel',
        glasses: 'block',
        shirt: 'green',
        pants: 'brown',
        accessories: 'diamond-sword'
      },
      category: "Gaming + Fantasy"
    },
    {
      description: "A dragon face mascot with fire eyes, magical glasses, wearing a red robe and gold armor with a staff",
      expected: {
        head: 'dragon',
        eyes: 'fire',
        glasses: 'magical',
        shirt: 'red',
        accessories: 'staff',
        background: 'fantasy'
      },
      category: "Fantasy + Magic"
    },
    {
      description: "A robot face mascot with laser eyes, tech glasses, wearing a chrome suit and holding a plasma blaster",
      expected: {
        head: 'robot',
        eyes: 'laser',
        glasses: 'tech',
        shirt: 'chrome',
        accessories: 'plasma-blaster',
        background: 'cyber'
      },
      category: "Sci-fi + Tech"
    },
    {
      description: "A unicorn face mascot with rainbow eyes, crystal glasses, wearing a pink dress and silver shoes with a magic wand",
      expected: {
        head: 'unicorn',
        eyes: 'rainbow',
        glasses: 'crystal',
        shirt: 'pink',
        shoes: 'silver',
        accessories: 'wand',
        background: 'fantasy'
      },
      category: "Fantasy + Magic"
    }
  ]

  console.log('🧪 Testing Comprehensive AI Parsing Capabilities...\n')
  console.log('🚀 Expanded Knowledge Base: Memes, Anime, Gaming, Sci-fi, Fantasy, Tech, Weapons, Magic\n')

  let successCount = 0
  let totalTests = testCases.length

  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i]
    console.log(`\n${'='.repeat(80)}`)
    console.log(`Test ${i + 1}: "${testCase.description}"`)
    console.log(`Category: ${testCase.category}`)
    console.log(`${'='.repeat(80)}\n`)

    try {
      // Test the comprehensive AI parsing API
      const response = await fetch('/api/parse-description', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description: testCase.description }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to parse description')
      }

      const data = await response.json()
      
      console.log('🤖 AI Response:')
      console.log(data.aiResponse)
      console.log('\n✨ Generated Traits:')
      Object.entries(data.traits).forEach(([key, value]) => {
        console.log(`  ${key}: ${value}`)
      })

      console.log('\n📊 Expected vs Actual:')
      let testSuccess = true
      Object.entries(testCase.expected).forEach(([key, expectedValue]) => {
        const actualValue = data.traits[key]
        const status = actualValue === expectedValue ? '✅' : '❌'
        console.log(`  ${status} ${key}: expected "${expectedValue}", got "${actualValue}"`)
        if (actualValue !== expectedValue) {
          testSuccess = false
        }
      })

      if (testSuccess) {
        successCount++
        console.log('\n🎯 Test Result: ✅ PASSED')
      } else {
        console.log('\n🎯 Test Result: ❌ FAILED')
      }

      // Check for creative face styles
      const faceStyle = data.traits.head
      const creativeStyles = ['pepe', 'doge', 'goku', 'matrix', 'pixel', 'anime', 'metallic', 'neon', 'cyber', 'fantasy', 'sci-fi', 'chad', 'wojak', 'naruto', 'minecraft', 'dragon', 'robot', 'unicorn']
      if (creativeStyles.includes(faceStyle)) {
        console.log(`🎨 Creative Face Style: ✅ "${faceStyle}" face will be displayed inside the mascot's screen`)
      }

      // Check for weapons/accessories
      const accessories = data.traits.accessories
      const weapons = ['lightsaber', 'sword', 'blaster', 'kunai', 'diamond-sword', 'plasma-blaster', 'wand', 'staff']
      if (weapons.includes(accessories)) {
        console.log(`⚔️  Weapon Detected: ✅ "${accessories}" accessory`)
      }

    } catch (error) {
      console.error(`❌ Test ${i + 1} failed:`, error.message)
    }
  }

  console.log('\n🎉 Comprehensive AI parsing test completed!')
  console.log(`📊 Results: ${successCount}/${totalTests} tests passed`)
  console.log('\n✨ New Capabilities Added:')
  console.log('• Memes: pepe, doge, wojak, chad, virgin, stonks, cheems, bonk, kek, monke')
  console.log('• Anime: goku, naruto, luffy, saitama, deku, allmight, vegeta, anime, manga')
  console.log('• Gaming: minecraft, roblox, fortnite, valorant, csgo, league, dota, overwatch, pokemon')
  console.log('• Sci-fi: lightsaber, blaster, phaser, laser, plasma, energy, force, jedi, sith')
  console.log('• Fantasy: sword, dagger, bow, arrow, staff, wand, shield, axe, hammer, magic')
  console.log('• Tech: matrix, cyber, digital, neon, glitch, hologram, vr, ar, ai, robot')
  console.log('• Materials: metallic, chrome, gold, silver, bronze, crystal, diamond, obsidian')
  console.log('• Effects: glowing, neon, laser, fire, ice, electric, rainbow, prismatic')
  console.log('• Backgrounds: space, galaxy, fantasy, cyber, nature, urban, abstract')
  console.log('• Weapons: lightsaber, sword, dagger, bow, arrow, gun, blaster, staff, wand')
  console.log('• Magic: wand, staff, orb, crystal, gem, rune, scroll, potion, spell, charm')
}

// Run the test
testComprehensiveParsing() 