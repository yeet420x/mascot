// Test script for RPC endpoint functionality

const testRpcEndpoints = async () => {
  console.log('🧪 Testing RPC Endpoints...\n')

  const testCases = [
    {
      name: 'Alchemy Demo RPC',
      url: 'https://solana-mainnet.g.alchemy.com/v2/demo',
      expected: 'Should work without authentication'
    },
    {
      name: 'Solana Public RPC',
      url: 'https://api.mainnet-beta.solana.com',
      expected: 'May return 403 (rate limited)'
    }
  ]

  for (const testCase of testCases) {
    console.log(`\n${'='.repeat(60)}`)
    console.log(`Testing: ${testCase.name}`)
    console.log(`URL: ${testCase.url}`)
    console.log(`Expected: ${testCase.expected}`)
    console.log(`${'='.repeat(60)}\n`)

    try {
      // Test the RPC endpoint directly
      const { Connection, PublicKey } = require('@solana/web3.js')
      const connection = new Connection(testCase.url, 'confirmed')
      
      // Test with a known public key (Solana Foundation)
      const testPublicKey = new PublicKey('11111111111111111111111111111111')
      
      console.log('🔍 Testing connection...')
      const balance = await connection.getBalance(testPublicKey)
      console.log('✅ Success! Balance:', balance / 1e9, 'SOL')
      
    } catch (error) {
      console.log('❌ Error:', error.message)
      if (error.message.includes('403')) {
        console.log('⚠️  This is expected for public RPC endpoints')
      }
    }
  }

  console.log('\n🧪 Testing API Endpoint...\n')
  
  try {
    // Test our secure API endpoint
    const response = await fetch('/api/get-rpc-url')
    if (response.ok) {
      const data = await response.json()
      console.log('✅ API Response:', data)
      console.log('📊 RPC Source:', data.source)
      console.log('🔗 RPC URL:', data.rpcUrl)
    } else {
      console.log('❌ API Error:', response.status, response.statusText)
    }
  } catch (error) {
    console.log('❌ API Test Failed:', error.message)
  }

  console.log('\n🎉 RPC endpoint testing completed!')
  console.log('\n📋 Recommendations:')
  console.log('• Use QuickNode RPC for production (most reliable)')
  console.log('• Alchemy demo RPC works for testing')
  console.log('• Public Solana RPC may have rate limits')
}

// Run the test
testRpcEndpoints() 