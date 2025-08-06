// Test script for metadata upload to Shadow Drive
// Run with: node test-metadata-upload.js

async function testMetadataUpload() {
  console.log('🧪 Testing Metadata Upload to Shadow Drive...');
  
  // Test metadata
  const testMetadata = {
    name: "Test Mascot NFT",
    symbol: "CNDL",
    image: "https://shdw-drive.genesysgo.net/WW5T5VEbE4GSc5Rcimo4nA9voAr7pSwqy4VswEUqWh4/test-image.png",
    description: "Candle TV Mascot NFT - AI Generated"
  };

  const testData = {
    metadata: testMetadata,
    name: "Test-Mascot-NFT-Clean", // Using clean name
    walletAddress: "11111111111111111111111111111111", // Test wallet address
  };

  try {
    console.log('📤 Sending metadata upload request to Shadow Drive API...');
    
    const response = await fetch('http://localhost:3000/api/upload-to-shadow-drive', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    console.log('📊 Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Metadata upload failed:', errorText);
      return;
    }

    const result = await response.json();
    console.log('✅ Metadata upload successful!');
    console.log('📁 Result:', JSON.stringify(result, null, 2));
    
    if (result.success) {
      console.log('🎉 Test passed! Metadata uploaded to Shadow Drive.');
      console.log('📁 Metadata URL:', result.imageUrl);
      console.log('🏦 Storage Account:', result.storageAccount);
      console.log('📄 File Name:', result.fileName);
      
      // Test that the metadata URL is accessible
      console.log('🔍 Testing metadata URL accessibility...');
      const metadataResponse = await fetch(result.imageUrl);
      if (metadataResponse.ok) {
        const metadata = await metadataResponse.json();
        console.log('✅ Metadata URL is accessible!');
        console.log('📄 Retrieved metadata:', JSON.stringify(metadata, null, 2));
      } else {
        console.log('⚠️ Metadata URL not yet accessible (may need time to propagate)');
      }
    } else {
      console.error('❌ Test failed:', result.error);
    }
    
  } catch (error) {
    console.error('💥 Test error:', error.message);
    console.log('💡 Make sure:');
    console.log('   1. The development server is running (npm run dev)');
    console.log('   2. SHADOW_DRIVE_PRIVATE_KEY is set in .env.local');
    console.log('   3. The storage account exists and is accessible');
  }
}

// Run the test
testMetadataUpload(); 