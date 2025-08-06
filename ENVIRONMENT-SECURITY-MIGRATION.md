# 🔒 Environment Security Migration Guide

## 🚨 **CRITICAL: Production Security Fix**

Your application currently exposes sensitive environment variables to the client-side. This is a **security vulnerability** that needs to be fixed immediately.

## 📋 **Current Security Issues**

### **Exposed Sensitive Variables:**
- `NEXT_PUBLIC_QUICKNODE_RPC` - RPC endpoint (should be server-side)
- `NEXT_PUBLIC_NFT_STORAGE_KEY` - API key (should be server-side)
- `NEXT_PUBLIC_SHDW_STORAGE_ACCOUNT` - Storage account (should be server-side)

### **Safe Public Variables:**
- `NEXT_PUBLIC_SUPABASE_URL` - Database URL (can stay public)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Anon key (can stay public)
- `NEXT_PUBLIC_BASE_URL` - Base URL (can stay public)

## 🔧 **Migration Steps**

### **Step 1: Update Environment Variables**

**Remove these from your `.env.local` file:**
```bash
# ❌ REMOVE THESE (they expose sensitive data)
NEXT_PUBLIC_QUICKNODE_RPC=https://your-quicknode-endpoint.com
NEXT_PUBLIC_NFT_STORAGE_KEY=your-nft-storage-key
NEXT_PUBLIC_SHDW_STORAGE_ACCOUNT=your-shadow-drive-account
```

**Add these to your `.env.local` file:**
```bash
# ✅ ADD THESE (server-side only)
QUICKNODE_RPC=https://your-quicknode-endpoint.com
NFT_STORAGE_KEY=your-nft-storage-key
SHDW_STORAGE_ACCOUNT=your-shadow-drive-account
```

### **Step 2: Update Production Environment**

**For Vercel/Netlify/Other Hosting:**

1. Go to your hosting platform dashboard
2. Navigate to Environment Variables settings
3. **Remove** the `NEXT_PUBLIC_` versions
4. **Add** the new server-side versions

**Vercel Example:**
```bash
# Remove these
NEXT_PUBLIC_QUICKNODE_RPC
NEXT_PUBLIC_NFT_STORAGE_KEY
NEXT_PUBLIC_SHDW_STORAGE_ACCOUNT

# Add these
QUICKNODE_RPC
NFT_STORAGE_KEY
SHDW_STORAGE_ACCOUNT
```

### **Step 3: Verify API Endpoints**

The following secure API endpoints have been created:

- `/api/get-rpc-url` - Provides RPC URL securely
- `/api/get-storage-config` - Provides storage configuration securely

## 🔍 **What Was Fixed**

### **Before (Insecure):**
```javascript
// ❌ Client-side code could access sensitive data
const connection = new Connection(process.env.NEXT_PUBLIC_QUICKNODE_RPC)
```

### **After (Secure):**
```javascript
// ✅ Server-side API provides data securely
const response = await fetch('/api/get-rpc-url')
const { rpcUrl } = await response.json()
const connection = new Connection(rpcUrl)
```

## 🛡️ **Security Benefits**

1. **API Keys Protected:** Sensitive keys are no longer exposed to browsers
2. **RPC Endpoints Secured:** RPC URLs are not visible in client-side code
3. **Storage Accounts Safe:** Storage credentials are server-side only
4. **No Data Leakage:** Sensitive configuration stays on the server

## 🧪 **Testing the Migration**

### **Test 1: RPC URL Access**
```javascript
// This should work securely
const response = await fetch('/api/get-rpc-url')
const data = await response.json()
console.log('RPC URL:', data.rpcUrl)
```

### **Test 2: Storage Configuration**
```javascript
// This should work securely
const response = await fetch('/api/get-storage-config')
const data = await response.json()
console.log('Storage configured:', data.hasStorage)
```

## 🚨 **Immediate Actions Required**

1. **Update your `.env.local` file** with the new variable names
2. **Update your production environment** (Vercel/Netlify/etc.)
3. **Remove old `NEXT_PUBLIC_` variables** from all environments
4. **Test the application** to ensure everything works
5. **Deploy the changes** to production

## ✅ **Verification Checklist**

- [ ] Removed `NEXT_PUBLIC_QUICKNODE_RPC` from all environments
- [ ] Added `QUICKNODE_RPC` to all environments
- [ ] Removed `NEXT_PUBLIC_NFT_STORAGE_KEY` from all environments
- [ ] Added `NFT_STORAGE_KEY` to all environments
- [ ] Removed `NEXT_PUBLIC_SHDW_STORAGE_ACCOUNT` from all environments
- [ ] Added `SHDW_STORAGE_ACCOUNT` to all environments
- [ ] Tested RPC connection via `/api/get-rpc-url`
- [ ] Tested storage configuration via `/api/get-storage-config`
- [ ] Verified wallet balance display works
- [ ] Verified NFT minting works
- [ ] Deployed to production

## 🔐 **Additional Security Recommendations**

1. **Use Environment-Specific Files:**
   ```bash
   .env.local          # Local development
   .env.production     # Production settings
   .env.staging        # Staging settings
   ```

2. **Regular Security Audits:**
   - Check for any remaining `NEXT_PUBLIC_` variables
   - Review API endpoints for sensitive data exposure
   - Monitor for unauthorized access attempts

3. **API Rate Limiting:**
   - Consider adding rate limiting to `/api/get-rpc-url`
   - Monitor API usage for unusual patterns

## 🆘 **Troubleshooting**

### **If RPC Connection Fails:**
1. Check that `QUICKNODE_RPC` is set correctly
2. Verify the API endpoint `/api/get-rpc-url` returns data
3. Check browser console for errors

### **If Storage Upload Fails:**
1. Check that `NFT_STORAGE_KEY` or `SHDW_STORAGE_ACCOUNT` is set
2. Verify the API endpoint `/api/get-storage-config` returns data
3. Check server logs for authentication errors

### **If Wallet Balance Doesn't Show:**
1. Verify the RPC URL is accessible
2. Check that the wallet is connected
3. Look for network errors in browser console

## 📞 **Support**

If you encounter issues during migration:
1. Check the browser console for errors
2. Verify all environment variables are set correctly
3. Test the API endpoints directly
4. Review server logs for detailed error messages

---

**⚠️ IMPORTANT: This migration is critical for production security. Please complete it immediately to protect your sensitive data.** 