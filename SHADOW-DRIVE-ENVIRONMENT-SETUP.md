# Shadow Drive Environment Setup Guide

## 🚨 **CRITICAL: Shadow Drive Private Key Required**

The NFT minting is currently falling back to data URIs because the `SHADOW_DRIVE_PRIVATE_KEY` environment variable is not set.

## 📋 **Required Environment Variables**

Create a `.env.local` file in your project root with the following variables:

```bash
# Shadow Drive Configuration
SHADOW_DRIVE_PRIVATE_KEY=your_shadow_drive_private_key_here

# Solana RPC (optional - will use fallback if not set)
QUICKNODE_RPC=your_quicknode_rpc_url_here

# Google AI (for image generation)
GOOGLE_AI_KEY=your_google_ai_key_here

# Supabase (for metadata storage - optional)
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

## 🔑 **Getting Your Shadow Drive Private Key**

### **Step 1: Visit Shadow Drive**
1. Go to: https://shdw-drive.genesysgo.net/
2. Connect your wallet (Phantom, Solflare, etc.)

### **Step 2: Create Storage Account**
1. Click "Create Storage Account"
2. Choose storage size (1GB is sufficient for testing)
3. Pay the storage fee (in SOL)

### **Step 3: Get Your Private Key**
1. After creating the storage account, you'll get a private key
2. **IMPORTANT**: Save this private key securely
3. Add it to your `.env.local` file as `SHADOW_DRIVE_PRIVATE_KEY`

### **Step 4: Verify Storage Account**
Your storage account address should be: `WW5T5VEbE4GSc5Rcimo4nA9voAr7pSwqy4VswEUqWh4`

## 🧪 **Testing the Setup**

Once you've set up the environment variables, test the Shadow Drive integration:

```bash
node test-shadow-drive-direct.js
```

You should see:
- ✅ Private key found
- ✅ Keypair created successfully
- ✅ Shadow Drive SDK initialized
- ✅ File uploaded successfully
- ✅ Metadata URI generated

## 🎯 **Expected Results**

After setting up the environment variables:

### **Before (Current Issue):**
- ❌ `SHADOW_DRIVE_PRIVATE_KEY environment variable not set`
- ❌ Fallback to data URIs: `data:application/json;base64,...`
- ❌ NFTs with temporary metadata

### **After (Proper Setup):**
- ✅ Real Shadow Drive URLs: `https://shdw-drive.genesysgo.net/...`
- ✅ Proper NFT metadata on blockchain
- ✅ Verifiable NFTs on Solana Explorer
- ✅ Decentralized metadata storage

## 🔒 **Security Notes**

1. **Never commit your private key** to version control
2. **Keep your `.env.local` file secure**
3. **Use different keys for development and production**
4. **Backup your private key securely**

## 🚀 **Next Steps**

1. **Get your Shadow Drive private key**
2. **Add it to `.env.local`**
3. **Test the integration**
4. **Mint your first NFT with real metadata!**

## 📞 **Need Help?**

If you need assistance getting your Shadow Drive private key:
1. Visit the Shadow Drive website
2. Follow the account creation process
3. Contact Shadow Drive support if needed

---

**Once you have your Shadow Drive private key, the NFT minting will work with real metadata URIs instead of fallback data URIs!** 