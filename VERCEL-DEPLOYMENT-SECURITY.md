# 🚀 Vercel Deployment with Security Fixes

## 🔒 **Critical Security Migration for Vercel**

This guide will help you deploy your application to Vercel while ensuring all sensitive environment variables are properly secured.

## 📋 **Pre-Deployment Checklist**

### **✅ Code Changes Completed:**
- [x] Created secure API endpoints (`/api/get-rpc-url`, `/api/get-storage-config`)
- [x] Updated components to use secure APIs
- [x] Fixed all import errors and TypeScript issues
- [x] Components now fetch sensitive data from server-side APIs

## 🚀 **Vercel Deployment Steps**

### **Step 1: Prepare Your Repository**

1. **Commit all changes:**
   ```bash
   git add .
   git commit -m "Security fix: Move sensitive env vars to server-side APIs"
   git push origin main
   ```

2. **Verify your repository is ready:**
   - All files are committed
   - No sensitive data in code
   - API endpoints are working locally

### **Step 2: Connect to Vercel**

1. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**
2. **Click "New Project"**
3. **Import your GitHub repository**
4. **Select the repository containing your SOLMASCOTS project**

### **Step 3: Configure Environment Variables in Vercel**

**⚠️ CRITICAL: Set these BEFORE deploying**

1. **In the Vercel project setup, go to "Environment Variables"**
2. **Add the following variables:**

#### **🔐 Server-Side Variables (SECURE):**
```bash
# RPC Configuration
QUICKNODE_RPC=https://your-quicknode-endpoint.solana-mainnet.discover.quiknode.pro/your-api-key/

# Storage Configuration
NFT_STORAGE_KEY=your-nft-storage-api-key
SHDW_STORAGE_ACCOUNT=your-shadow-drive-storage-account

# AI Configuration
GOOGLE_AI_KEY=your-google-ai-api-key

# Database Configuration (if using Supabase)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

#### **🌐 Public Variables (SAFE to expose):**
```bash
# Database (can stay public)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# App Configuration
NEXT_PUBLIC_BASE_URL=https://your-app.vercel.app
NEXT_PUBLIC_APP_NAME=Candle TV Mascot Creator
```

### **Step 4: Vercel Environment Variable Setup**

**In Vercel Dashboard:**

1. **Go to your project settings**
2. **Navigate to "Environment Variables"**
3. **Add each variable:**

| Variable Name | Value | Environment |
|---------------|-------|-------------|
| `QUICKNODE_RPC` | `https://your-quicknode-endpoint...` | Production, Preview, Development |
| `NFT_STORAGE_KEY` | `your-nft-storage-key` | Production, Preview, Development |
| `SHDW_STORAGE_ACCOUNT` | `your-shadow-drive-account` | Production, Preview, Development |
| `GOOGLE_AI_KEY` | `your-google-ai-key` | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://your-project.supabase.co` | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `your-supabase-anon-key` | Production, Preview, Development |
| `NEXT_PUBLIC_BASE_URL` | `https://your-app.vercel.app` | Production, Preview, Development |

### **Step 5: Deploy to Vercel**

1. **Click "Deploy" in Vercel**
2. **Wait for build to complete**
3. **Check deployment logs for any errors**

### **Step 6: Verify Security**

**After deployment, test these endpoints:**

1. **Test RPC URL API:**
   ```bash
   curl https://your-app.vercel.app/api/get-rpc-url
   ```
   **Expected:** `{"rpcUrl":"https://...","network":"mainnet-beta"}`

2. **Test Storage Config API:**
   ```bash
   curl https://your-app.vercel.app/api/get-storage-config
   ```
   **Expected:** `{"nftStorageKey":"configured","hasStorage":true}`

3. **Verify no sensitive data in browser:**
   - Open browser dev tools
   - Check Network tab
   - Verify no sensitive keys are exposed

## 🔍 **Vercel-Specific Configuration**

### **Build Settings (if needed):**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install"
}
```

### **Vercel Configuration File (`vercel.json`):**
```json
{
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "env": {
    "NODE_ENV": "production"
  }
}
```

## 🧪 **Post-Deployment Testing**

### **Test 1: Wallet Connection**
1. Open your deployed app
2. Connect wallet
3. Verify balance displays correctly
4. Check browser console for errors

### **Test 2: AI Mascot Generation**
1. Try the AI prompt feature
2. Test with: *"A pepe face mascot with neon eyes, cyber glasses"*
3. Verify image generation works
4. Check that traits are parsed correctly

### **Test 3: NFT Minting**
1. Generate a mascot
2. Try to mint as NFT
3. Verify the process works
4. Check transaction on Solana Explorer

## 🛡️ **Security Verification**

### **✅ What Should Work:**
- Wallet connection and balance display
- AI-powered mascot generation
- NFT minting functionality
- All API endpoints responding correctly

### **❌ What Should NOT Be Exposed:**
- RPC URLs in browser source code
- API keys in network requests
- Storage credentials in client-side code
- Any sensitive environment variables

## 🆘 **Troubleshooting Vercel Deployment**

### **Build Errors:**
1. **Check build logs in Vercel dashboard**
2. **Verify all dependencies are in `package.json`**
3. **Ensure TypeScript compilation passes**

### **Environment Variable Issues:**
1. **Verify variables are set in Vercel dashboard**
2. **Check variable names match exactly**
3. **Ensure variables are set for all environments**

### **API Errors:**
1. **Check Vercel function logs**
2. **Verify API routes are in correct location**
3. **Test endpoints directly**

### **Runtime Errors:**
1. **Check browser console for client-side errors**
2. **Check Vercel function logs for server-side errors**
3. **Verify all environment variables are accessible**

## 📊 **Monitoring Your Deployment**

### **Vercel Analytics:**
- Monitor API usage
- Check for errors in function logs
- Track performance metrics

### **Security Monitoring:**
- Regularly check for exposed sensitive data
- Monitor API endpoint usage
- Verify no sensitive variables are exposed

## 🔄 **Updating Environment Variables**

**To update environment variables after deployment:**

1. **Go to Vercel Dashboard → Project Settings**
2. **Navigate to "Environment Variables"**
3. **Edit or add new variables**
4. **Redeploy the project**

## ✅ **Final Checklist**

- [ ] All sensitive variables moved to server-side
- [ ] Environment variables set in Vercel
- [ ] Application deployed successfully
- [ ] All features working correctly
- [ ] No sensitive data exposed in browser
- [ ] API endpoints responding correctly
- [ ] Wallet connection working
- [ ] AI generation working
- [ ] NFT minting working

---

**🎉 Congratulations! Your application is now securely deployed on Vercel with all sensitive data properly protected on the server-side.** 