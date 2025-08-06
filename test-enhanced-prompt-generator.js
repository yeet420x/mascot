// Test script for enhanced prompt-based generator functionality

// Mock the enhanced parsePromptToTraits function
const parsePromptToTraits = (userPrompt) => {
  const traits = {
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
  
  const promptLower = userPrompt.toLowerCase()
  const extracted = []

  // Enhanced color detection function
  const findColorForTrait = (traitKey, prompt) => {
    const traitDefinitions = {
      head: { colors: ['orange', 'blue', 'green', 'red', 'purple', 'yellow', 'pink', 'gray', 'black', 'white', 'brown', 'gold', 'silver', 'cyan', 'magenta'], keywords: ['head', 'face', 'skin', 'complexion'] },
      eyes: { colors: ['brown', 'blue', 'green', 'hazel', 'gray', 'black', 'amber', 'violet', 'golden', 'red', 'pink'], keywords: ['eye', 'eyes', 'iris'] },
      glasses: { types: ['none', 'round', 'square', 'sunglasses', 'aviator', 'cat-eye', 'rimless'], keywords: ['glasses', 'spectacles', 'eyewear', 'lenses'] },
      shirt: { colors: ['orange', 'blue', 'green', 'red', 'purple', 'pink', 'gray', 'white', 'black', 'yellow', 'brown', 'gold', 'silver', 'cyan', 'magenta'], keywords: ['shirt', 'top', 't-shirt', 'blouse', 'sweater', 'jacket', 'hoodie'] },
      pants: { colors: ['blue', 'black', 'gray', 'brown', 'green', 'red', 'orange', 'purple', 'white', 'yellow', 'pink'], keywords: ['pants', 'trousers', 'jeans', 'shorts', 'leggings'] },
      shoes: { colors: ['black', 'brown', 'white', 'red', 'blue', 'green', 'orange', 'purple', 'gray', 'gold', 'silver'], keywords: ['shoes', 'footwear', 'sneakers', 'boots', 'sandals'] },
      accessories: { items: ['none', 'crown', 'necklace', 'watch', 'bracelet', 'earrings', 'scarf', 'tie', 'belt', 'backpack', 'purse', 'gloves', 'socks'], keywords: ['accessory', 'accessories', 'jewelry', 'decoration'] },
      hat: { types: ['none', 'red-cap', 'orange-cap', 'blue-cap', 'green-cap', 'purple-cap', 'yellow-cap', 'pink-cap', 'black-cap', 'white-cap', 'crown', 'beanie', 'fedora', 'baseball-cap'], keywords: ['hat', 'cap', 'headwear', 'headgear'] },
      bowtie: { colors: ['none', 'red', 'blue', 'green', 'purple', 'orange', 'yellow', 'pink', 'black', 'white', 'gold', 'silver'], keywords: ['bow tie', 'bowtie', 'tie'] }
    }
    
    const trait = traitDefinitions[traitKey]
    const colors = 'colors' in trait ? trait.colors : 'types' in trait ? trait.types : 'items' in trait ? trait.items : []
    
    for (const color of colors) {
      if (prompt.includes(color)) {
        // Check if the color is associated with this trait's keywords
        const hasTraitKeyword = trait.keywords.some(keyword => prompt.includes(keyword))
        if (hasTraitKeyword) {
          extracted.push(`${traitKey}: ${color}`)
          return color
        }
      }
    }
    return null
  }

  // Enhanced keyword-based trait detection
  const findTraitByKeywords = (traitKey, prompt) => {
    const traitDefinitions = {
      head: { colors: ['orange', 'blue', 'green', 'red', 'purple', 'yellow', 'pink', 'gray', 'black', 'white', 'brown', 'gold', 'silver', 'cyan', 'magenta'], keywords: ['head', 'face', 'skin', 'complexion'], default: 'default' },
      eyes: { colors: ['brown', 'blue', 'green', 'hazel', 'gray', 'black', 'amber', 'violet', 'golden', 'red', 'pink'], keywords: ['eye', 'eyes', 'iris'], default: 'brown' },
      glasses: { types: ['none', 'round', 'square', 'sunglasses', 'aviator', 'cat-eye', 'rimless'], keywords: ['glasses', 'spectacles', 'eyewear', 'lenses'], default: 'none' },
      shirt: { colors: ['orange', 'blue', 'green', 'red', 'purple', 'pink', 'gray', 'white', 'black', 'yellow', 'brown', 'gold', 'silver', 'cyan', 'magenta'], keywords: ['shirt', 'top', 't-shirt', 'blouse', 'sweater', 'jacket', 'hoodie'], default: 'orange' },
      pants: { colors: ['blue', 'black', 'gray', 'brown', 'green', 'red', 'orange', 'purple', 'white', 'yellow', 'pink'], keywords: ['pants', 'trousers', 'jeans', 'shorts', 'leggings'], default: 'blue' },
      shoes: { colors: ['black', 'brown', 'white', 'red', 'blue', 'green', 'orange', 'purple', 'gray', 'gold', 'silver'], keywords: ['shoes', 'footwear', 'sneakers', 'boots', 'sandals'], default: 'black' },
      accessories: { items: ['none', 'crown', 'necklace', 'watch', 'bracelet', 'earrings', 'scarf', 'tie', 'belt', 'backpack', 'purse', 'gloves', 'socks'], keywords: ['accessory', 'accessories', 'jewelry', 'decoration'], default: 'none' },
      hat: { types: ['none', 'red-cap', 'orange-cap', 'blue-cap', 'green-cap', 'purple-cap', 'yellow-cap', 'pink-cap', 'black-cap', 'white-cap', 'crown', 'beanie', 'fedora', 'baseball-cap'], keywords: ['hat', 'cap', 'headwear', 'headgear'], default: 'none' },
      bowtie: { colors: ['none', 'red', 'blue', 'green', 'purple', 'orange', 'yellow', 'pink', 'black', 'white', 'gold', 'silver'], keywords: ['bow tie', 'bowtie', 'tie'], default: 'none' }
    }
    
    const trait = traitDefinitions[traitKey]
    
    for (const keyword of trait.keywords) {
      if (prompt.includes(keyword)) {
        // Try to find a color/type for this trait
        const color = findColorForTrait(traitKey, prompt)
        if (color) {
          return color
        }
        
        // If no specific color found, try to infer from context
        if (traitKey === 'glasses') {
          if (prompt.includes('round')) return 'round'
          if (prompt.includes('square')) return 'square'
          if (prompt.includes('sun')) return 'sunglasses'
          if (prompt.includes('aviator')) return 'aviator'
          return 'round' // default
        }
        
        if (traitKey === 'hat') {
          if (prompt.includes('cap')) {
            // Try to find cap color
            const capColors = ['red', 'orange', 'blue', 'green', 'purple', 'yellow', 'pink', 'black', 'white']
            for (const color of capColors) {
              if (prompt.includes(color)) {
                return `${color}-cap`
              }
            }
            return 'red-cap' // default
          }
          if (prompt.includes('crown')) return 'crown'
          if (prompt.includes('beanie')) return 'beanie'
          if (prompt.includes('fedora')) return 'fedora'
          return 'red-cap' // default
        }
        
        if (traitKey === 'accessories') {
          if (prompt.includes('crown')) return 'crown'
          if (prompt.includes('necklace')) return 'necklace'
          if (prompt.includes('watch')) return 'watch'
          if (prompt.includes('bracelet')) return 'bracelet'
          if (prompt.includes('earrings')) return 'earrings'
          if (prompt.includes('scarf')) return 'scarf'
          if (prompt.includes('tie')) return 'tie'
          if (prompt.includes('belt')) return 'belt'
          if (prompt.includes('backpack')) return 'backpack'
          if (prompt.includes('purse')) return 'purse'
          if (prompt.includes('gloves')) return 'gloves'
          if (prompt.includes('socks')) return 'socks'
          return 'none'
        }
        
        if (traitKey === 'bowtie') {
          const bowtieColors = ['red', 'blue', 'green', 'purple', 'orange', 'yellow', 'pink', 'black', 'white', 'gold', 'silver']
          for (const color of bowtieColors) {
            if (prompt.includes(color)) {
              return color
            }
          }
          return 'red' // default
        }
        
        // For other traits, return the default
        return trait.default
      }
    }
    return null
  }

  // Process each trait category
  Object.keys(traitDefinitions).forEach((traitKey) => {
    // Try to find color/type for this trait
    let foundValue = findColorForTrait(traitKey, promptLower)
    
    // If no color found, try keyword-based detection
    if (!foundValue) {
      foundValue = findTraitByKeywords(traitKey, promptLower)
    }
    
    // If still no value found, try broader color detection
    if (!foundValue) {
      const trait = traitDefinitions[traitKey]
      const colors = 'colors' in trait ? trait.colors : 'types' in trait ? trait.types : 'items' in trait ? trait.items : []
      
      for (const color of colors) {
        if (promptLower.includes(color)) {
          // Check if this color is already assigned to another trait
          const isAssigned = Object.values(traits).includes(color)
          if (!isAssigned) {
            foundValue = color
            extracted.push(`${traitKey}: ${color} (inferred)`)
            break
          }
        }
      }
    }
    
    if (foundValue) {
      traits[traitKey] = foundValue
    }
  })

  // Special handling for background color
  const backgroundColors = ['beige', 'cream', 'white', 'black', 'blue', 'green', 'red', 'orange', 'purple', 'pink', 'gray']
  for (const color of backgroundColors) {
    if (promptLower.includes(color) && promptLower.includes('background')) {
      traits.background = color === 'beige' || color === 'cream' ? '#F5F5DC' : color
      extracted.push(`background: ${color}`)
      break
    }
  }

  return { traits, extracted }
}

// Enhanced test cases with more creative and flexible descriptions
const testCases = [
  {
    prompt: "A majestic mascot with golden hair, emerald eyes, wearing a royal purple shirt with a silver crown",
    expected: {
      head: 'gold',
      eyes: 'green',
      shirt: 'purple',
      accessories: 'crown'
    }
  },
  {
    prompt: "Sporty mascot with aviator sunglasses, red baseball cap, and a golden watch",
    expected: {
      glasses: 'aviator',
      hat: 'red-cap',
      accessories: 'watch'
    }
  },
  {
    prompt: "Elegant mascot with silver hair, violet eyes, wearing a black suit with red bow tie",
    expected: {
      head: 'silver',
      eyes: 'violet',
      shirt: 'black',
      pants: 'black',
      bowtie: 'red'
    }
  },
  {
    prompt: "Adventurous mascot with brown skin, amber eyes, green hoodie, and a backpack",
    expected: {
      head: 'brown',
      eyes: 'amber',
      shirt: 'green',
      accessories: 'backpack'
    }
  },
  {
    prompt: "Cute mascot with cyan hair, pink eyes, wearing a magenta dress with golden shoes",
    expected: {
      head: 'cyan',
      eyes: 'pink',
      shirt: 'magenta',
      shoes: 'gold'
    }
  },
  {
    prompt: "A sophisticated mascot with silver hair, golden eyes, wearing a black suit, white shirt, and a golden watch",
    expected: {
      head: 'silver',
      eyes: 'golden',
      shirt: 'white',
      pants: 'black',
      accessories: 'watch'
    }
  }
]

console.log('🧪 Testing Enhanced AI-Powered Mascot Generator...\n')

testCases.forEach((testCase, index) => {
  console.log(`Test ${index + 1}: "${testCase.prompt}"`)
  const result = parsePromptToTraits(testCase.prompt)
  
  console.log('Generated traits:', result.traits)
  console.log('AI Extracted info:', result.extracted)
  
  // Check if expected traits match
  let allMatch = true
  for (const [key, value] of Object.entries(testCase.expected)) {
    if (result.traits[key] !== value) {
      console.log(`❌ ${key}: expected "${value}", got "${result.traits[key]}"`)
      allMatch = false
    }
  }
  
  if (allMatch) {
    console.log('✅ All expected traits matched!\n')
  } else {
    console.log('❌ Some traits did not match expected values\n')
  }
})

console.log('🎉 Enhanced AI-powered mascot generator test completed!')
console.log('\n✨ Key improvements:')
console.log('• More flexible color detection')
console.log('• Enhanced keyword matching')
console.log('• Support for new accessories (earrings, scarf, tie, belt, backpack, etc.)')
console.log('• Better context understanding')
console.log('• Intelligent trait inference') 