# Environment Setup for Shadow Drive

## 🔧 **Required Setup**

You need to create a `.env.local` file in your project root with the following content:

```bash
# Shadow Drive Configuration
SHADOW_DRIVE_PRIVATE_KEY=your_base58_encoded_private_key_here

# Optional: Your own storage account (if you have one)
# STORAGE_ACCOUNT_ADDRESS=your_storage_account_public_key

# Other existing environment variables
QUICKNODE_RPC=https://your-quicknode-endpoint.com
NEXT_PUBLIC_QUICKNODE_RPC=https://your-quicknode-endpoint.com
```

## 🔑 **Getting Your Private Key**

### From Phantom Wallet:
1. Open Phantom wallet
2. Go to Settings → Security & Privacy → Export Private Key
3. Enter your password
4. Copy the private key (it's already in base58 format)

### From Solflare Wallet:
1. Open Solflare wallet
2. Go to Settings → Export Private Key
3. Enter your password
4. Copy the private key (it's already in base58 format)

## 🚀 **Testing the Setup**

1. **Create the .env.local file** with your private key
2. **Restart the development server**:
   ```bash
   npm run dev
   ```
3. **Test the upload** by generating a mascot and minting an NFT

## 🔍 **Verification**

You can verify the environment variable is set by running:
```bash
node -e "console.log('SHADOW_DRIVE_PRIVATE_KEY:', process.env.SHADOW_DRIVE_PRIVATE_KEY ? 'SET' : 'NOT SET')"
```

## ⚠️ **Security Notes**

- Never commit your `.env.local` file to version control
- Keep your private key secure
- Consider using a dedicated wallet for uploads
- The `.env.local` file is already in `.gitignore` 