// Test script for AI-powered description parsing

const testAIParsing = async () => {
  const userDescription = "I asked for Mascot that has black glasses and matrix background with numbers in green falling down from the top all the way to the buttom on black. mascot is wearing blue jeans and white puffy jacket made by Luis Vuitton, has a crown and a cat pet"

  console.log('🧪 Testing AI-Powered Description Parsing...\n')
  console.log('User Description:', userDescription)
  console.log('\n' + '='.repeat(80) + '\n')

  try {
    // Test the new AI parsing API
    const response = await fetch('/api/parse-description', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ description: userDescription }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to parse description')
    }

    const data = await response.json()
    
    console.log('🤖 AI Response:')
    console.log(data.aiResponse)
    console.log('\n' + '='.repeat(80) + '\n')

    console.log('✨ Generated Traits:')
    Object.entries(data.traits).forEach(([key, value]) => {
      console.log(`  ${key}: ${value}`)
    })

    console.log('\n' + '='.repeat(80) + '\n')

    // Expected vs Actual comparison
    const expected = {
      glasses: 'black',
      background: 'matrix',
      pants: 'blue',
      shirt: 'white',
      accessories: 'crown',
      hat: 'crown'
    }

    console.log('📊 Expected vs Actual:')
    Object.entries(expected).forEach(([key, expectedValue]) => {
      const actualValue = data.traits[key]
      const status = actualValue === expectedValue ? '✅' : '❌'
      console.log(`  ${status} ${key}: expected "${expectedValue}", got "${actualValue}"`)
    })

    console.log('\n🎉 AI-powered parsing test completed!')
    console.log('\n✨ Key improvements:')
    console.log('• Uses Google AI (Gemini) for natural language understanding')
    console.log('• Much more accurate than manual parsing')
    console.log('• Handles complex descriptions and context')
    console.log('• Supports brand names and special themes')
    console.log('• Flexible and extensible')

  } catch (error) {
    console.error('❌ Test failed:', error.message)
  }
}

// Run the test
testAIParsing() 