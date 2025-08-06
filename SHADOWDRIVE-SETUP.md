# ShadowDrive Setup Guide

## Overview
ShadowDrive is a decentralized storage solution built on Solana. This guide will help you set up ShadowDrive for NFT image storage.

## Prerequisites
- Solana wallet (Phantom, Solflare, etc.)
- SOL tokens for storage fees
- Node.js environment

## Step 1: Install ShadowDrive CLI

```bash
npm install -g @shadow-drive/cli
```

## Step 2: Create a Storage Account

### Option A: Using ShadowDrive CLI
```bash
# Connect your wallet
shdw drive connect

# Create a storage account (requires SOL for fees)
shdw drive create-storage-account --size 1GB

# List your storage accounts
shdw drive list-storage-accounts
```

### Option B: Using ShadowDrive SDK
```javascript
import { ShadowDrive } from '@shadow-drive/sdk'

const shadowDrive = new ShadowDrive(connection, wallet)
const storageAccount = await shadowDrive.createStorageAccount({
  size: 1024 * 1024 * 1024, // 1GB
  owner: wallet.publicKey
})
```

## Step 3: Environment Variables

Add to your `.env.local`:
```env
NEXT_PUBLIC_SHDW_STORAGE_ACCOUNT=your_storage_account_public_key
SHDW_DRIVE_ENDPOINT=https://shadow-storage.genesysgo.net
```

## Step 4: Production Implementation

### 4.1 Update the API Route

Replace the placeholder implementation in `app/api/upload-to-shadow-drive/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import bs58 from 'bs58'
import nacl from 'tweetnacl'
import crypto from 'crypto'

const SHDW_DRIVE_ENDPOINT = 'https://shadow-storage.genesysgo.net'

export async function POST(request: NextRequest) {
  try {
    const { imageUrl, name, walletAddress, signature, message } = await request.json()
    
    // Download image
    const downloadResponse = await fetch(imageUrl)
    const imageBuffer = await downloadResponse.arrayBuffer()
    const imageBlob = new Blob([imageBuffer], { type: 'image/png' })
    
    // Create FormData for upload
    const formData = new FormData()
    formData.append('file', imageBlob, `${name}.png`)
    formData.append('message', signature)
    formData.append('signer', walletAddress)
    formData.append('storage_account', process.env.SHDW_STORAGE_ACCOUNT!)
    
    // Upload to ShadowDrive
    const uploadResponse = await fetch(`${SHDW_DRIVE_ENDPOINT}/upload`, {
      method: 'POST',
      body: formData
    })
    
    if (!uploadResponse.ok) {
      throw new Error('ShadowDrive upload failed')
    }
    
    const result = await uploadResponse.json()
    
    return NextResponse.json({
      success: true,
      imageUrl: result.finalized_locations[0]
    })
    
  } catch (error) {
    console.error('ShadowDrive upload error:', error)
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    )
  }
}
```

### 4.2 Update Client-Side Component

Update `components/AIImageGenerator.tsx` to handle ShadowDrive uploads:

```typescript
const uploadToShadowDrive = async (imageUrl: string, fileName: string) => {
  try {
    // Get user's keypair from wallet (this is the tricky part)
    // You'll need to implement this based on your wallet adapter
    
    // Create message to sign
    const storageAccount = process.env.NEXT_PUBLIC_SHDW_STORAGE_ACCOUNT!
    const hashSum = crypto.createHash("sha256")
    const hashedFileNames = hashSum.update(fileName)
    const fileNamesHashed = hashSum.digest("hex")
    
    const message = `Shadow Drive Signed Message:\nStorage Account: ${storageAccount}\nUpload files with hash: ${fileNamesHashed}`
    
    // Sign the message with user's keypair
    const encodedMessage = new TextEncoder().encode(message)
    const signedMessage = nacl.sign.detached(encodedMessage, userKeypair.secretKey)
    const signature = bs58.encode(signedMessage)
    
    // Upload to our API
    const response = await fetch('/api/upload-to-shadow-drive', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        imageUrl,
        name: fileName,
        walletAddress: publicKey.toString(),
        signature,
        message
      })
    })
    
    if (!response.ok) {
      throw new Error('Upload failed')
    }
    
    const result = await response.json()
    return result.imageUrl
    
  } catch (error) {
    console.error('ShadowDrive upload error:', error)
    throw error
  }
}
```

## Step 5: Getting User's Keypair

This is the most challenging part. Most wallet adapters don't expose the private key for security reasons. Here are your options:

### Option A: Use Wallet Adapter with Keypair Access
```typescript
import { useWallet } from '@solana/wallet-adapter-react'

const { publicKey, signTransaction, signMessage } = useWallet()

// Some wallets support signing messages
const signature = await signMessage(new TextEncoder().encode(message))
```

### Option B: Use ShadowDrive SDK
```typescript
import { ShadowDrive } from '@shadow-drive/sdk'

const shadowDrive = new ShadowDrive(connection, wallet)
const result = await shadowDrive.uploadFile(storageAccount, file, fileName)
```

### Option C: Manual Keypair (Development Only)
```typescript
// WARNING: Only for development/testing
const keypair = Keypair.fromSecretKey(bs58.decode(process.env.PRIVATE_KEY!))
```

## Step 6: Testing

1. Create a storage account
2. Set environment variables
3. Test upload with a small image
4. Verify the file is accessible at the returned URL

## Step 7: Production Considerations

- **Security**: Never expose private keys in client-side code
- **Error Handling**: Implement proper error handling for network issues
- **Rate Limiting**: ShadowDrive has rate limits
- **Costs**: Storage fees are paid in SOL
- **Backup**: Consider implementing fallback storage solutions

## Troubleshooting

### Common Issues:
1. **"Storage account not found"**: Create a storage account first
2. **"Insufficient SOL"**: Add SOL to your wallet for storage fees
3. **"Signature verification failed"**: Ensure message format matches exactly
4. **"File too large"**: Check ShadowDrive file size limits

### Debug Commands:
```bash
# Check storage account info
shdw drive get-storage-account <account>

# List files in storage account
shdw drive list-files <account>

# Check account balance
shdw drive get-balance
```

## Next Steps

1. Implement proper keypair handling
2. Add error recovery mechanisms
3. Implement file size validation
4. Add progress indicators
5. Consider implementing retry logic
6. Add file type validation
7. Implement storage account management UI 