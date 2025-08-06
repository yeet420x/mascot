// Test script for the specific mascot description

const testSpecificMascot = async () => {
  console.log('🧪 Testing Specific Mascot Description...\n')
  
  const description = "a mascot with sharp jawline,blue eyes, and sword in his left arm and yellow background with stars"
  
  console.log('📝 Description:', description)
  console.log('\n🔍 Expected Traits:')
  console.log('- head: default (or sharp jawline style)')
  console.log('- eyes: blue')
  console.log('- accessories: sword')
  console.log('- background: yellow with stars')
  console.log('\n' + '='.repeat(60))
  
  try {
    const response = await fetch('/api/parse-description', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ description })
    })
    
    if (response.ok) {
      const data = await response.json()
      console.log('✅ AI Response:', data.aiResponse)
      console.log('\n🎯 Parsed Traits:')
      console.log(JSON.stringify(data.traits, null, 2))
      
      // Check for issues
      console.log('\n🔍 Analysis:')
      if (data.traits.eyes !== 'blue') {
        console.log('❌ Eyes should be blue, got:', data.traits.eyes)
      } else {
        console.log('✅ Eyes correctly parsed as blue')
      }
      
      if (data.traits.accessories !== 'sword') {
        console.log('❌ Accessories should be sword, got:', data.traits.accessories)
      } else {
        console.log('✅ Accessories correctly parsed as sword')
      }
      
      if (!data.traits.background.includes('yellow') && !data.traits.background.includes('star')) {
        console.log('❌ Background should include yellow and stars, got:', data.traits.background)
      } else {
        console.log('✅ Background correctly parsed')
      }
      
    } else {
      const error = await response.json()
      console.log('❌ API Error:', error)
    }
    
  } catch (error) {
    console.log('❌ Test Failed:', error.message)
  }
  
  console.log('\n🎉 Test completed!')
}

// Run the test
testSpecificMascot() 