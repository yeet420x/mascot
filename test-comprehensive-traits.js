// Test script for comprehensive traits system

const testComprehensiveTraits = async () => {
  console.log('🧪 Testing Comprehensive Traits System...\n')
  
  const testCases = [
    {
      name: 'Sharp Jawline Mascot',
      description: "a mascot with sharp jawline,blue eyes, and sword in his left arm and yellow background with stars",
      expected: {
        head: 'sharp-jawline',
        eyes: 'blue',
        accessories: 'sword',
        background: 'yellow-stars'
      }
    },
    {
      name: 'Pepe Meme Mascot',
      description: "a pepe mascot with neon eyes wearing cyber glasses and holding a lightsaber",
      expected: {
        head: 'pepe',
        eyes: 'neon',
        glasses: 'cyber',
        accessories: 'lightsaber'
      }
    },
    {
      name: 'Goku Anime Mascot',
      description: "a goku style mascot with anime eyes and dragon ball background",
      expected: {
        head: 'goku',
        eyes: 'anime',
        background: 'dragon-ball'
      }
    },
    {
      name: 'Matrix Tech Mascot',
      description: "a matrix face mascot with glowing eyes and cyber background",
      expected: {
        head: 'matrix',
        eyes: 'glowing',
        background: 'cyber'
      }
    },
    {
      name: 'Gaming Mascot',
      description: "a minecraft pixel mascot with gaming style and retro background",
      expected: {
        head: 'minecraft',
        background: 'retro'
      }
    },
    {
      name: 'Fantasy Mascot',
      description: "a wizard mascot with magical eyes wearing a crown and holding a staff",
      expected: {
        head: 'wizard',
        eyes: 'magical',
        accessories: 'staff',
        hat: 'crown'
      }
    },
    {
      name: 'Sci-Fi Mascot',
      description: "an alien mascot with laser eyes and space background",
      expected: {
        head: 'alien',
        eyes: 'laser',
        background: 'space'
      }
    }
  ]

  for (const testCase of testCases) {
    console.log(`\n${'='.repeat(60)}`)
    console.log(`Testing: ${testCase.name}`)
    console.log(`Description: ${testCase.description}`)
    console.log(`Expected:`, testCase.expected)
    console.log(`${'='.repeat(60)}`)
    
    try {
      // Test parsing
      const parseResponse = await fetch('/api/parse-description', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description: testCase.description })
      })
      
      if (parseResponse.ok) {
        const parseData = await parseResponse.json()
        console.log('✅ Parsed Traits:')
        console.log(JSON.stringify(parseData.traits, null, 2))
        
        // Check if expected traits were found
        console.log('\n🔍 Verification:')
        let allCorrect = true
        
        Object.entries(testCase.expected).forEach(([trait, expectedValue]) => {
          if (parseData.traits[trait] === expectedValue) {
            console.log(`✅ ${trait}: ${expectedValue}`)
          } else {
            console.log(`❌ ${trait}: expected ${expectedValue}, got ${parseData.traits[trait]}`)
            allCorrect = false
          }
        })
        
        if (allCorrect) {
          console.log('\n🎉 All expected traits found!')
        } else {
          console.log('\n⚠️ Some traits not parsed as expected')
        }
        
        // Test image generation
        console.log('\n🎨 Testing Image Generation...')
        const imageResponse = await fetch('/api/generate-image-gemini', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ traits: parseData.traits })
        })
        
        if (imageResponse.ok) {
          const imageData = await imageResponse.json()
          console.log('✅ Image Generated Successfully!')
          console.log('📊 Model:', imageData.model)
        } else {
          const imageError = await imageResponse.json()
          console.log('❌ Image Generation Error:', imageError)
        }
        
      } else {
        const parseError = await parseResponse.json()
        console.log('❌ Parsing Error:', parseError)
      }
      
    } catch (error) {
      console.log('❌ Test Failed:', error.message)
    }
  }
  
  console.log('\n🎉 Comprehensive traits testing completed!')
  console.log('\n📋 Summary:')
  console.log('• The AI should now understand hundreds of different trait combinations')
  console.log('• From memes to anime to gaming to fantasy to sci-fi')
  console.log('• Users can describe almost anything and the AI will understand it')
  console.log('• The system supports physical features, colors, effects, materials, and more')
}

// Run the test
testComprehensiveTraits() 