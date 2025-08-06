// Test script for Shadow Drive upload functionality
// Run with: node test-shadow-drive.js

// Use built-in fetch for Node.js 18+

async function testShadowDriveUpload() {
  console.log('🧪 Testing Shadow Drive Upload...');
  
  // Test data
  const testData = {
    imageUrl: 'https://via.placeholder.com/400x400.png?text=Test+Image',
    name: 'test-mascot',
    walletAddress: '11111111111111111111111111111111', // Test wallet address
  };

  try {
    console.log('📤 Sending test request to Shadow Drive API...');
    
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
      console.error('❌ Upload failed:', errorText);
      return;
    }

    const result = await response.json();
    console.log('✅ Upload successful!');
    console.log('📁 Result:', JSON.stringify(result, null, 2));
    
    if (result.success) {
      console.log('🎉 Test passed! Shadow Drive upload is working.');
      console.log('📁 Image URL:', result.imageUrl);
      console.log('🏦 Storage Account:', result.storageAccount);
      console.log('📄 File Name:', result.fileName);
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
testShadowDriveUpload(); 