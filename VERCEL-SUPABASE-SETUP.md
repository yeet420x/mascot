# Vercel Supabase Setup Guide

## 🔧 **Fix for "supabaseUrl is required" Build Error**

The build is failing because Supabase environment variables are not configured in Vercel. Here's how to fix it:

## 📋 **Required Environment Variables (Private)**

Add these **private** environment variables in your Vercel project settings:

### **Supabase Configuration:**
```
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Note:** These are **private** variables (no `NEXT_PUBLIC_` prefix) so they won't be exposed to the client-side.

### **How to Get These Values:**

1. **Go to your Supabase Dashboard**
2. **Navigate to Settings → API**
3. **Copy the values:**
   - **Project URL** → `SUPABASE_URL`
   - **anon public** → `SUPABASE_ANON_KEY`

## 🚀 **Steps to Add in Vercel:**

1. **Go to your Vercel Dashboard**
2. **Select your project**
3. **Go to Settings → Environment Variables**
4. **Add each variable:**
   - **Name:** `SUPABASE_URL`
   - **Value:** `https://your-project-ref.supabase.co`
   - **Environment:** Production, Preview, Development
   
   - **Name:** `SUPABASE_ANON_KEY`
   - **Value:** `your-anon-key-here`
   - **Environment:** Production, Preview, Development

## ✅ **After Adding Variables:**

1. **Redeploy your project** in Vercel
2. **The build should now succeed**
3. **Supabase functionality will work properly**

## 🔍 **What Was Fixed:**

- **Private Environment Variables:** No more `NEXT_PUBLIC_` prefix - variables are server-side only
- **Dynamic Client Creation:** Supabase client only initializes when environment variables are available
- **Graceful Error Handling:** API routes return proper error responses when Supabase is not configured
- **Build-Time Safety:** No more build failures due to missing environment variables
- **Security:** Environment variables are not exposed to the client-side

## 📝 **Optional: Database Setup**

If you haven't created the `nft_metadata` table in Supabase yet:

```sql
CREATE TABLE nft_metadata (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  metadata JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🎉 **Result:**

Your application will now build successfully with **private** Supabase environment variables! 