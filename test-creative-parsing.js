// Test script for enhanced AI parsing with creative concepts

const testCreativeParsing = async () => {
  const testCases = [
    {
      description: "A mascot with matrix face, goku eyes, wearing a white jacket and blue jeans, with a crown and matrix background",
      expected: {
        head: 'matrix',
        eyes: 'anime',
        background: 'matrix',
        shirt: 'white',
        pants: 'blue',
        accessories: 'crown'
      }
    },
    {
      description: "A mascot with doge face, neon eyes, cyber glasses, wearing a black shirt and red pants",
      expected: {
        head: 'doge',
        eyes: 'neon',
        glasses: 'tech',
        shirt: 'black',
        pants: 'red'
      }
    },
    {
      description: "A mascot with goku face, anime eyes, pixel style, wearing a purple shirt and green pants",
      expected: {
        head: 'goku',
        eyes: 'anime',
        shirt: 'purple',
        pants: 'green'
      }
    },
    {
      description: "A mascot with metallic face, glowing eyes, futuristic glasses, cyber background",
      expected: {
        head: 'metallic',
        eyes: 'neon',
        glasses: 'tech',
        background: 'cyber'
      }
    }
  ]

  console.log('🧪 Testing Enhanced AI Parsing with Creative Concepts...\n')

  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i]
    console.log(`\n${'='.repeat(80)}`)
    console.log(`Test ${i + 1}: "${testCase.description}"`)
    console.log(`${'='.repeat(80)}\n`)

    try {
      // Test the enhanced AI parsing API
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
      Object.entries(testCase.expected).forEach(([key, expectedValue]) => {
        const actualValue = data.traits[key]
        const status = actualValue === expectedValue ? '✅' : '❌'
        console.log(`  ${status} ${key}: expected "${expectedValue}", got "${actualValue}"`)
      })

    } catch (error) {
      console.error(`❌ Test ${i + 1} failed:`, error.message)
    }
  }

  console.log('\n🎉 Enhanced AI parsing test completed!')
  console.log('\n✨ New Creative Capabilities:')
  console.log('• Matrix faces (digital screen with green code)')
  console.log('• Goku faces (anime Dragon Ball style)')
  console.log('• Doge faces (meme Shiba Inu style)')
  console.log('• Pixel faces (8-bit style)')
  console.log('• Metallic faces (chrome style)')
  console.log('• Neon eyes (glowing style)')
  console.log('• Tech glasses (cyberpunk style)')
  console.log('• Cyber backgrounds (futuristic style)')
}

// Run the test
testCreativeParsing() 