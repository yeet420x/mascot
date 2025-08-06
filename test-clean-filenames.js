// Test script for clean filename generation
// Run with: node test-clean-filenames.js

function cleanFilename(name) {
  return name.replace(/[^a-zA-Z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
}

function generateMetadataFilename(name) {
  const cleanName = cleanFilename(name || 'metadata')
  return `${cleanName}-${Date.now()}.json`
}

function generateImageFilename(name) {
  const cleanName = cleanFilename(name || 'mascot')
  return `${Date.now()}-${cleanName}.png`
}

// Test cases
const testCases = [
  "Candle Mascot #1754363321586",
  "Test Mascot NFT",
  "My Special Mascot!",
  "Candle-TV-Mascot",
  "Mascot with spaces",
  "Mascot@#$%^&*()",
  "Candle Mascot #123",
  "Test-Mascot-NFT",
  "My Special Mascot!",
  "Candle-TV-Mascot",
  "Mascot with spaces",
  "Mascot@#$%^&*()"
]

console.log('🧪 Testing Clean Filename Generation...\n')

testCases.forEach((testCase, index) => {
  const cleanName = cleanFilename(testCase)
  const metadataFilename = generateMetadataFilename(testCase)
  const imageFilename = generateImageFilename(testCase)
  
  console.log(`Test ${index + 1}: "${testCase}"`)
  console.log(`  Clean name: "${cleanName}"`)
  console.log(`  Metadata filename: "${metadataFilename}"`)
  console.log(`  Image filename: "${imageFilename}"`)
  console.log(`  Metadata URL: https://shdw-drive.genesysgo.net/WW5T5VEbE4GSc5Rcimo4nA9voAr7pSwqy4VswEUqWh4/${metadataFilename}`)
  console.log(`  Image URL: https://shdw-drive.genesysgo.net/WW5T5VEbE4GSc5Rcimo4nA9voAr7pSwqy4VswEUqWh4/${imageFilename}`)
  console.log('')
})

console.log('✅ Filename cleaning test completed!')
console.log('📝 The new implementation should generate clean URLs without special characters.') 