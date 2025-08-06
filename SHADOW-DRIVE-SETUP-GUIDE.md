# Shadow Drive Setup Guide

This guide explains how to set up Shadow Drive uploads for the SOLMASCOTS project.

## Prerequisites

1. **Solana Wallet**: You need a Solana wallet with SOL for transaction fees
2. **Shadow Drive Storage Account**: You need a Shadow Drive storage account
3. **Private Key**: The private key for the wallet that owns the storage account

## Environment Variables

Add the following environment variable to your `.env.local` file:

```bash
SHADOW_DRIVE_PRIVATE_KEY=your_base58_encoded_private_key_here
```

### Getting Your Private Key

1. **From Phantom Wallet**:
   - Open Phantom wallet
   - Go to Settings → Security & Privacy → Export Private Key
   - Enter your password
   - Copy the private key (it's already in base58 format)

2. **From Solflare Wallet**:
   - Open Solflare wallet
   - Go to Settings → Export Private Key
   - Enter your password
   - Copy the private key (it's already in base58 format)

3. **From Command Line** (if you have a keypair file):
   ```bash
   # If you have a JSON keypair file
   node -e "const fs = require('fs'); const bs58 = require('bs58'); const keypair = JSON.parse(fs.readFileSync('keypair.json')); console.log(bs58.encode(keypair.secretKey));"
   ```

## Storage Account Setup

The current implementation uses a hardcoded storage account: `WW5T5VEbE4GSc5Rcimo4nA9voAr7pSwqy4VswEUqWh4`

To use your own storage account:

1. **Create a Storage Account**:
   - Visit [Shadow Drive](https://shdwdrive.genesysgo.net/)
   - Connect your wallet
   - Create a new storage account
   - Note the storage account address

2. **Update the Code**:
   - Replace `STORAGE_ACCOUNT_ADDRESS` in `app/api/upload-to-shadow-drive/route.ts`
   - Make sure your private key corresponds to the wallet that owns this storage account

## Testing the Setup

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Test the upload endpoint**:
   - Generate a mascot image
   - Check the browser console for upload logs
   - Verify that files are uploaded to Shadow Drive

## Troubleshooting

### Common Issues

1. **"Shadow Drive private key not configured"**
   - Make sure `SHADOW_DRIVE_PRIVATE_KEY` is set in your `.env.local` file
   - Restart the development server after adding the environment variable

2. **"Upload failed"**
   - Check that your private key corresponds to the storage account owner
   - Ensure you have enough SOL for transaction fees
   - Verify the storage account exists and is active

3. **"Message signature verification failed"**
   - The message format must be exactly: `Shadow Drive Signed Message:\nStorage Account: {account}\nUpload files with hash: {filename}`
   - Check that the private key is correctly formatted (base58)

### Debug Information

The upload process logs detailed information:

- Message being signed
- Upload request details
- Response from Shadow Drive API
- Final file URLs

Check the browser console and server logs for debugging information.

## Security Notes

⚠️ **Important Security Considerations**:

1. **Never commit your private key to version control**
2. **Use environment variables for all sensitive data**
3. **Consider using a dedicated wallet for uploads**
4. **Regularly rotate your keys**
5. **Monitor your storage account usage**

## API Endpoints

The upload endpoint is available at:
```
POST /api/upload-to-shadow-drive
```

### Request Body
```json
{
  "imageUrl": "https://example.com/image.png",
  "name": "mascot-name",
  "walletAddress": "user-wallet-address",
  "metadata": {
    "name": "NFT Name",
    "image": "image-url"
  }
}
```

### Response
```json
{
  "success": true,
  "message": "Image uploaded to ShadowDrive",
  "imageUrl": "https://shdw-drive.genesysgo.net/storage-account/filename.png",
  "storageAccount": "storage-account-address",
  "fileName": "filename.png",
  "uploadResult": {
    "success": true,
    "result": {
      "finalized_locations": ["https://shdw-drive.genesysgo.net/storage-account/filename.png"]
    }
  }
}
```

## Production Considerations

For production deployment:

1. **Environment Variables**: Set `SHADOW_DRIVE_PRIVATE_KEY` in your production environment
2. **Storage Limits**: Monitor your Shadow Drive storage usage
3. **Error Handling**: Implement proper error handling and retry logic
4. **Rate Limiting**: Consider implementing rate limiting for uploads
5. **Monitoring**: Set up monitoring for upload success/failure rates 