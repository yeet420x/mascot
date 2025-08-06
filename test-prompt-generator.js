// Test script for prompt-based generator functionality

// Mock the parsePromptToTraits function
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

  // Head color parsing
  const headColors = ['orange', 'blue', 'green', 'red', 'purple', 'yellow', 'pink', 'gray', 'black']
  for (const color of headColors) {
    if (promptLower.includes(color) && promptLower.includes('head')) {
      traits.head = color
      break
    }
  }

  // Eye color parsing
  const eyeColors = ['brown', 'blue', 'green', 'hazel', 'gray', 'black']
  for (const color of eyeColors) {
    if (promptLower.includes(color) && (promptLower.includes('eye') || promptLower.includes('eyes'))) {
      traits.eyes = color
      break
    }
  }

  // Glasses parsing
  if (promptLower.includes('glasses') || promptLower.includes('spectacles')) {
    if (promptLower.includes('round')) traits.glasses = 'round'
    else if (promptLower.includes('square')) traits.glasses = 'square'
    else if (promptLower.includes('sunglasses') || promptLower.includes('sun glasses')) traits.glasses = 'sunglasses'
    else traits.glasses = 'round'
  }

  // Shirt color parsing
  const shirtColors = ['orange', 'blue', 'green', 'red', 'purple', 'pink', 'gray', 'white']
  for (const color of shirtColors) {
    if (promptLower.includes(color) && (promptLower.includes('shirt') || promptLower.includes('top'))) {
      traits.shirt = color
      break
    }
  }

  // Pants color parsing
  const pantsColors = ['blue', 'black', 'gray', 'brown', 'green']
  for (const color of pantsColors) {
    if (promptLower.includes(color) && (promptLower.includes('pants') || promptLower.includes('trousers'))) {
      traits.pants = color
      break
    }
  }

  // Shoes color parsing
  const shoeColors = ['black', 'brown', 'white', 'red', 'blue']
  for (const color of shoeColors) {
    if (promptLower.includes(color) && (promptLower.includes('shoes') || promptLower.includes('footwear'))) {
      traits.shoes = color
      break
    }
  }

  // Accessories parsing
  if (promptLower.includes('crown')) traits.accessories = 'crown'
  else if (promptLower.includes('necklace')) traits.accessories = 'necklace'
  else if (promptLower.includes('watch')) traits.accessories = 'watch'
  else if (promptLower.includes('bracelet')) traits.accessories = 'bracelet'

  // Hat parsing
  if (promptLower.includes('hat') || promptLower.includes('cap')) {
    if (promptLower.includes('red')) traits.hat = 'red-cap'
    else if (promptLower.includes('orange')) traits.hat = 'orange-cap'
    else if (promptLower.includes('blue')) traits.hat = 'blue-cap'
    else traits.hat = 'red-cap'
  }

  // Bow tie parsing
  if (promptLower.includes('bow tie') || promptLower.includes('bowtie')) {
    const bowtieColors = ['red', 'blue', 'green', 'purple']
    for (const color of bowtieColors) {
      if (promptLower.includes(color)) {
        traits.bowtie = color
        break
      }
    }
    if (!bowtieColors.some(color => promptLower.includes(color))) {
      traits.bowtie = 'red'
    }
  }

  return traits
}

// Test cases
const testCases = [
  {
    prompt: "A mascot with orange head, blue eyes, wearing a red shirt and blue pants with black shoes",
    expected: {
      head: 'orange',
      eyes: 'blue',
      shirt: 'red',
      pants: 'blue',
      shoes: 'black'
    }
  },
  {
    prompt: "Cute mascot with round glasses, wearing a crown, orange cap, and red bow tie",
    expected: {
      glasses: 'round',
      accessories: 'crown',
      hat: 'orange-cap',
      bowtie: 'red'
    }
  },
  {
    prompt: "Mascot with green head, brown eyes, purple shirt, gray pants, and a necklace",
    expected: {
      head: 'green',
      eyes: 'brown',
      shirt: 'purple',
      pants: 'gray',
      accessories: 'necklace'
    }
  }
]

console.log('🧪 Testing Prompt-Based Generator...\n')

testCases.forEach((testCase, index) => {
  console.log(`Test ${index + 1}: "${testCase.prompt}"`)
  const result = parsePromptToTraits(testCase.prompt)
  
  console.log('Generated traits:', result)
  
  // Check if expected traits match
  let allMatch = true
  for (const [key, value] of Object.entries(testCase.expected)) {
    if (result[key] !== value) {
      console.log(`❌ ${key}: expected "${value}", got "${result[key]}"`)
      allMatch = false
    }
  }
  
  if (allMatch) {
    console.log('✅ All expected traits matched!\n')
  } else {
    console.log('❌ Some traits did not match expected values\n')
  }
})

console.log('🎉 Prompt-based generator test completed!') 