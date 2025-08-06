// Test script for the fixed mascot description

const testMascotFix = async () => {
  console.log('🧪 Testing Fixed Mascot Description...\n')
  
  const description = "a mascot with sharp jawline,blue eyes, and sword in his left arm and yellow background with stars"
  
  console.log('📝 Description:', description)
  console.log('\n🔍 Expected Traits:')
  console.log('- head: sharp-jawline')
  console.log('- eyes: blue')
  console.log('- accessories: sword')
  console.log('- background: yellow-stars')
  console.log('\n' + '='.repeat(60))
  
  try {
    // Step 1: Test parsing
    console.log('🔍 Step 1: Testing AI Parsing...')
    const parseResponse = await fetch('/api/parse-description', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ description })
    })
    
    if (parseResponse.ok) {
      const parseData = await parseResponse.json()
      console.log('✅ Parsed Traits:')
      console.log(JSON.stringify(parseData.traits, null, 2))
      
      // Step 2: Test image generation
      console.log('\n🎨 Step 2: Testing Image Generation...')
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
        console.log('🎯 Applied Traits:', JSON.stringify(imageData.traits, null, 2))
        
        // Check if traits were applied correctly
        console.log('\n🔍 Verification:')
        if (parseData.traits.head === 'sharp-jawline') {
          console.log('✅ Sharp jawline trait applied')
        } else {
          console.log('❌ Sharp jawline trait not applied correctly')
        }
        
        if (parseData.traits.eyes === 'blue') {
          console.log('✅ Blue eyes trait applied')
        } else {
          console.log('❌ Blue eyes trait not applied correctly')
        }
        
        if (parseData.traits.accessories === 'sword') {
          console.log('✅ Sword accessory applied')
        } else {
          console.log('❌ Sword accessory not applied correctly')
        }
        
        if (parseData.traits.background === 'yellow-stars') {
          console.log('✅ Yellow stars background applied')
        } else {
          console.log('❌ Yellow stars background not applied correctly')
        }
        
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
  
  console.log('\n🎉 Test completed!')
  console.log('\n📋 Summary:')
  console.log('• AI parsing should now correctly identify sharp jawline, blue eyes, sword, and yellow stars')
  console.log('• Image generation should apply these traits to the mascot')
  console.log('• The mascot should have a defined jawline, blue eyes, holding a sword, with yellow starry background')
}

// Run the test
testMascotFix() 