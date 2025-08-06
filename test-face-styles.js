// Test script for face styles displayed inside mascot screen

const testFaceStyles = async () => {
  const testCases = [
    {
      description: "A mascot with doge face inside the screen, wearing a white jacket and blue jeans",
      expected: {
        head: 'doge',
        shirt: 'white',
        pants: 'blue'
      },
      explanation: "Doge face should be displayed inside the mascot's screen, not replace the entire face"
    },
    {
      description: "A mascot with goku face in the screen, anime eyes, wearing a purple shirt",
      expected: {
        head: 'goku',
        eyes: 'anime',
        shirt: 'purple'
      },
      explanation: "Goku face should be shown inside the mascot's screen with anime-style eyes"
    },
    {
      description: "A mascot with matrix face on the screen, digital eyes, cyber background",
      expected: {
        head: 'matrix',
        eyes: 'matrix',
        background: 'cyber'
      },
      explanation: "Matrix face should be displayed inside the mascot's screen with digital elements"
    },
    {
      description: "A mascot with pixel face in the screen, 8-bit style, neon background",
      expected: {
        head: 'pixel',
        background: 'neon'
      },
      explanation: "Pixel face should be shown inside the mascot's screen with 8-bit style"
    }
  ]

  console.log('🧪 Testing Face Styles Inside Mascot Screen...\n')
  console.log('📺 Concept: Creative faces (doge, goku, matrix) are displayed INSIDE the mascot\'s screen/face\n')

  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i]
    console.log(`\n${'='.repeat(80)}`)
    console.log(`Test ${i + 1}: "${testCase.description}"`)
    console.log(`Expected: ${testCase.explanation}`)
    console.log(`${'='.repeat(80)}\n`)

    try {
      // Test the AI parsing API
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

      // Check if face style is properly set
      const faceStyle = data.traits.head
      if (['doge', 'goku', 'matrix', 'pixel', 'anime', 'metallic'].includes(faceStyle)) {
        console.log(`\n🎯 Face Style Detection: ✅ "${faceStyle}" face will be displayed inside the mascot's screen`)
      } else {
        console.log(`\n🎯 Face Style Detection: ⚠️  "${faceStyle}" - may need adjustment`)
      }

    } catch (error) {
      console.error(`❌ Test ${i + 1} failed:`, error.message)
    }
  }

  console.log('\n🎉 Face styles test completed!')
  console.log('\n✨ Key Concepts:')
  console.log('• Doge face = Shiba Inu meme displayed inside mascot screen')
  console.log('• Goku face = Dragon Ball anime style inside mascot screen')
  console.log('• Matrix face = Digital green code flowing inside mascot screen')
  console.log('• Pixel face = 8-bit style displayed inside mascot screen')
  console.log('• The mascot maintains its basic structure with creative content inside')
}

// Run the test
testFaceStyles() 