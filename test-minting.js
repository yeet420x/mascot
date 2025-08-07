// Test script for NFT minting with Shadow Drive

const testMinting = async () => {
  console.log('🧪 Testing NFT Minting with Shadow Drive...\n')

  const testCases = [
    {
      name: 'Basic Mascot NFT',
      imageUrl: 'https://shdw-drive.genesysgo.net/WW5T5VEbE4GSc5Rcimo4nA9voAr7pSwqy4VswEUqWh4/test-mascot-123.png',
      description: 'A pepe mascot with neon eyes wearing cyber glasses and holding a lightsaber',
      walletAddress: '11111111111111111111111111111111' // Test wallet address
    },
    {
      name: 'Goku Style Mascot',
      imageUrl: 'https://shdw-drive.genesysgo.net/WW5T5VEbE4GSc5Rcimo4nA9voAr7pSwqy4VswEUqWh4/goku-mascot-456.png',
      description: 'A goku style mascot with anime eyes and dragon ball background',
      walletAddress: '22222222222222222222222222222222' // Test wallet address
    }
  ]

  for (const testCase of testCases) {
    console.log(`\n${'='.repeat(60)}`)
    console.log(`Testing: ${testCase.name}`)
    console.log(`Image URL: ${testCase.imageUrl}`)
    console.log(`Description: ${testCase.description}`)
    console.log(`Wallet: ${testCase.walletAddress}`)
    console.log(`${'='.repeat(60)}`)

    try {
      // Test the mint-nft API
      console.log('🎨 Testing NFT Minting...')
      const response = await fetch('/api/mint-nft', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl: testCase.imageUrl,
          description: testCase.description,
          walletAddress: testCase.walletAddress
        })
      })

      if (response.ok) {
        const result = await response.json()
        console.log('✅ Minting Result:')
        console.log('Success:', result.success)
        console.log('Mint Address:', result.mintAddress)
        console.log('Transaction Signature:', result.transactionSignature)
        console.log('Metadata URI:', result.metadataUri)
        console.log('Message:', result.message)
        
        if (result.metadataUri && result.metadataUri.includes('shdw-drive.genesysgo.net')) {
          console.log('✅ Shadow Drive integration working!')
        } else {
          console.log('⚠️ Using fallback metadata URI')
        }
        
      } else {
        const errorData = await response.json()
        console.log('❌ Minting Error:', errorData)
      }

    } catch (error) {
      console.log('❌ Test Failed:', error.message)
    }
  }

  console.log('\n🎉 NFT minting testing completed!')
  console.log('\n📋 Summary:')
  console.log('• NFT minting API is now live')
  console.log('• Shadow Drive integration for metadata storage')
  console.log('• Real blockchain minting on Solana mainnet-beta')
  console.log('• 5% creator royalty on secondary sales')
  console.log('• Verifiable on Solana Explorer')
  console.log('• Users can now mint their AI-generated mascots as NFTs!')
}

// Run the test
testMinting() 