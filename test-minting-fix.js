// Test the minting API with current implementation

import fetch from 'node-fetch'

const testMintingAPI = async () => {
  console.log('🧪 Testing Minting API with Current Implementation...\n')

  try {
    // Test data
    const testData = {
      imageUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
      description: 'Test mascot with complete Shadow Drive integration',
      walletAddress: '11111111111111111111111111111111'
    }

    console.log('📤 Sending request to minting API...')
    console.log('Image URL:', testData.imageUrl.substring(0, 50) + '...')
    console.log('Description:', testData.description)
    console.log('Wallet Address:', testData.walletAddress)

    const response = await fetch('http://localhost:3002/api/mint-nft-simple', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    })

    const result = await response.json()

    if (response.ok) {
      console.log('✅ Minting API Response:')
      console.log('Success:', result.success)
      console.log('Message:', result.message)
      console.log('Mint Address:', result.mintAddress)
      console.log('Transaction Signature:', result.transactionSignature)
      console.log('Metadata URI:', result.metadataUri)
      console.log('Explorer URL:', result.nftDetails?.explorerUrl)
      
      console.log('\n🎉 Minting test completed successfully!')
    } else {
      console.log('❌ Minting API Error:')
      console.log('Status:', response.status)
      console.log('Error:', result.error)
      console.log('Details:', result.details)
    }

  } catch (error) {
    console.error('❌ Test Failed:', error)
  }
}

// Run the test
testMintingAPI() 