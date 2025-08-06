// Test script for the matrix-themed mascot description

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

  // Advanced context-aware parsing
  const parseComplexDescription = () => {
    // Head/Skin color detection
    if (promptLower.includes('black') && (promptLower.includes('skin') || promptLower.includes('head'))) {
      traits.head = 'black'
      extracted.push('head: black')
    } else if (promptLower.includes('brown') && (promptLower.includes('skin') || promptLower.includes('head'))) {
      traits.head = 'brown'
      extracted.push('head: brown')
    } else if (promptLower.includes('white') && (promptLower.includes('skin') || promptLower.includes('head'))) {
      traits.head = 'white'
      extracted.push('head: white')
    }

    // Eye color detection
    if (promptLower.includes('blue') && (promptLower.includes('eye') || promptLower.includes('eyes'))) {
      traits.eyes = 'blue'
      extracted.push('eyes: blue')
    } else if (promptLower.includes('green') && (promptLower.includes('eye') || promptLower.includes('eyes'))) {
      traits.eyes = 'green'
      extracted.push('eyes: green')
    } else if (promptLower.includes('brown') && (promptLower.includes('eye') || promptLower.includes('eyes'))) {
      traits.eyes = 'brown'
      extracted.push('eyes: brown')
    }

    // Glasses detection with color
    if (promptLower.includes('glasses')) {
      if (promptLower.includes('black') && promptLower.includes('glasses')) {
        traits.glasses = 'black'
        extracted.push('glasses: black')
      } else if (promptLower.includes('round')) {
        traits.glasses = 'round'
        extracted.push('glasses: round')
      } else if (promptLower.includes('square')) {
        traits.glasses = 'square'
        extracted.push('glasses: square')
      } else if (promptLower.includes('sun')) {
        traits.glasses = 'sunglasses'
        extracted.push('glasses: sunglasses')
      } else {
        traits.glasses = 'round'
        extracted.push('glasses: round (default)')
      }
    }

    // Shirt/Clothing detection with brand awareness
    if (promptLower.includes('jacket') || promptLower.includes('coat')) {
      if (promptLower.includes('white') && (promptLower.includes('jacket') || promptLower.includes('coat'))) {
        traits.shirt = 'white'
        extracted.push('shirt: white jacket')
      } else if (promptLower.includes('black') && (promptLower.includes('jacket') || promptLower.includes('coat'))) {
        traits.shirt = 'black'
        extracted.push('shirt: black jacket')
      } else if (promptLower.includes('blue') && (promptLower.includes('jacket') || promptLower.includes('coat'))) {
        traits.shirt = 'blue'
        extracted.push('shirt: blue jacket')
      }
    } else if (promptLower.includes('shirt') || promptLower.includes('top')) {
      if (promptLower.includes('white') && (promptLower.includes('shirt') || promptLower.includes('top'))) {
        traits.shirt = 'white'
        extracted.push('shirt: white')
      } else if (promptLower.includes('black') && (promptLower.includes('shirt') || promptLower.includes('top'))) {
        traits.shirt = 'black'
        extracted.push('shirt: black')
      } else if (promptLower.includes('blue') && (promptLower.includes('shirt') || promptLower.includes('top'))) {
        traits.shirt = 'blue'
        extracted.push('shirt: blue')
      } else if (promptLower.includes('red') && (promptLower.includes('shirt') || promptLower.includes('top'))) {
        traits.shirt = 'red'
        extracted.push('shirt: red')
      }
    }

    // Pants detection
    if (promptLower.includes('jeans') || promptLower.includes('pants')) {
      if (promptLower.includes('blue') && (promptLower.includes('jeans') || promptLower.includes('pants'))) {
        traits.pants = 'blue'
        extracted.push('pants: blue jeans')
      } else if (promptLower.includes('black') && (promptLower.includes('jeans') || promptLower.includes('pants'))) {
        traits.pants = 'black'
        extracted.push('pants: black')
      } else if (promptLower.includes('gray') && (promptLower.includes('jeans') || promptLower.includes('pants'))) {
        traits.pants = 'gray'
        extracted.push('pants: gray')
      }
    }

    // Shoes detection
    if (promptLower.includes('shoes') || promptLower.includes('footwear')) {
      if (promptLower.includes('white') && (promptLower.includes('shoes') || promptLower.includes('footwear'))) {
        traits.shoes = 'white'
        extracted.push('shoes: white')
      } else if (promptLower.includes('black') && (promptLower.includes('shoes') || promptLower.includes('footwear'))) {
        traits.shoes = 'black'
        extracted.push('shoes: black')
      } else if (promptLower.includes('brown') && (promptLower.includes('shoes') || promptLower.includes('footwear'))) {
        traits.shoes = 'brown'
        extracted.push('shoes: brown')
      }
    }

    // Accessories detection
    if (promptLower.includes('crown')) {
      traits.accessories = 'crown'
      extracted.push('accessories: crown')
    } else if (promptLower.includes('necklace')) {
      traits.accessories = 'necklace'
      extracted.push('accessories: necklace')
    } else if (promptLower.includes('watch')) {
      traits.accessories = 'watch'
      extracted.push('accessories: watch')
    } else if (promptLower.includes('cat') || promptLower.includes('pet')) {
      traits.accessories = 'crown' // Using crown as placeholder for pet
      extracted.push('accessories: pet (mapped to crown)')
    }

    // Hat detection
    if (promptLower.includes('crown') && !promptLower.includes('accessories')) {
      traits.hat = 'crown'
      extracted.push('hat: crown')
    } else if (promptLower.includes('cap')) {
      if (promptLower.includes('red') && promptLower.includes('cap')) {
        traits.hat = 'red-cap'
        extracted.push('hat: red cap')
      } else if (promptLower.includes('blue') && promptLower.includes('cap')) {
        traits.hat = 'blue-cap'
        extracted.push('hat: blue cap')
      } else {
        traits.hat = 'red-cap'
        extracted.push('hat: red cap (default)')
      }
    }

    // Bow tie detection
    if (promptLower.includes('bow tie') || promptLower.includes('bowtie')) {
      if (promptLower.includes('black') && (promptLower.includes('bow tie') || promptLower.includes('bowtie'))) {
        traits.bowtie = 'black'
        extracted.push('bowtie: black')
      } else if (promptLower.includes('red') && (promptLower.includes('bow tie') || promptLower.includes('bowtie'))) {
        traits.bowtie = 'red'
        extracted.push('bowtie: red')
      } else if (promptLower.includes('blue') && (promptLower.includes('bow tie') || promptLower.includes('bowtie'))) {
        traits.bowtie = 'blue'
        extracted.push('bowtie: blue')
      }
    }

    // Background detection with special themes
    if (promptLower.includes('matrix') || promptLower.includes('green numbers') || promptLower.includes('falling numbers')) {
      traits.background = 'matrix'
      extracted.push('background: matrix with green falling numbers')
    } else if (promptLower.includes('black') && promptLower.includes('background')) {
      traits.background = 'black'
      extracted.push('background: black')
    } else if (promptLower.includes('white') && promptLower.includes('background')) {
      traits.background = 'white'
      extracted.push('background: white')
    }
  }

  // Run the advanced parsing
  parseComplexDescription()

  // Fallback color detection for unspecified traits
  const fallbackColorDetection = () => {
    // If head color not specified, try to infer from context
    if (traits.head === 'default') {
      if (promptLower.includes('black') && !promptLower.includes('glasses') && !promptLower.includes('shirt') && !promptLower.includes('pants')) {
        traits.head = 'black'
        extracted.push('head: black (inferred)')
      } else if (promptLower.includes('brown') && !promptLower.includes('eyes')) {
        traits.head = 'brown'
        extracted.push('head: brown (inferred)')
      }
    }

    // If shirt not specified, try to infer
    if (traits.shirt === 'orange') {
      if (promptLower.includes('white') && !promptLower.includes('shoes')) {
        traits.shirt = 'white'
        extracted.push('shirt: white (inferred)')
      } else if (promptLower.includes('black') && !promptLower.includes('glasses')) {
        traits.shirt = 'black'
        extracted.push('shirt: black (inferred)')
      }
    }

    // If shoes not specified, try to infer
    if (traits.shoes === 'black') {
      if (promptLower.includes('white') && !promptLower.includes('shirt')) {
        traits.shoes = 'white'
        extracted.push('shoes: white (inferred)')
      }
    }
  }

  fallbackColorDetection()

  return { traits, extracted }
}

// Test the user's specific description
const userDescription = "I asked for Mascot that has black glasses and matrix background with numbers in green falling down from the top all the way to the buttom on black. mascot is wearing blue jeans and white puffy jacket made by Luis Vuitton, has a crown and a cat pet"

console.log('🧪 Testing Matrix Mascot Description...\n')
console.log('User Description:', userDescription)
console.log('\n' + '='.repeat(80) + '\n')

const result = parsePromptToTraits(userDescription)

console.log('🔍 AI Extracted Information:')
result.extracted.forEach(info => {
  console.log(`  ✅ ${info}`)
})

console.log('\n✨ Generated Traits:')
Object.entries(result.traits).forEach(([key, value]) => {
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
  const actualValue = result.traits[key]
  const status = actualValue === expectedValue ? '✅' : '❌'
  console.log(`  ${status} ${key}: expected "${expectedValue}", got "${actualValue}"`)
})

console.log('\n🎉 Test completed!') 