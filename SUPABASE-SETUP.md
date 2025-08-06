# Supabase Setup Guide

This guide will help you set up Supabase for storing NFT metadata.

## 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Create a new project
4. Wait for the project to be ready

## 2. Get Your Project Credentials

1. Go to your project dashboard
2. Navigate to Settings > API
3. Copy your:
   - **Project URL** (looks like: `https://your-project.supabase.co`)
   - **Anon/Public Key** (starts with `eyJ...`)

## 3. Create the Database Table

Run this SQL in your Supabase SQL Editor:

```sql
-- Create the nft_metadata table
CREATE TABLE nft_metadata (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  metadata JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (optional but recommended)
ALTER TABLE nft_metadata ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all operations (for development)
-- In production, you might want more restrictive policies
CREATE POLICY "Allow all operations" ON nft_metadata
  FOR ALL USING (true);
```

## 4. Update Your Environment Variables

Add these to your `.env.local` file:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Your existing variables
NEXT_PUBLIC_QUICKNODE_RPC=your-quicknode-rpc-url
QUICKNODE_RPC=your-quicknode-rpc-url
NEXT_PUBLIC_SHDW_STORAGE_ACCOUNT=your-shadow-drive-account
GOOGLE_AI_API_KEY=your-google-ai-api-key
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## 5. Benefits of Using Supabase

- ✅ **Persistent Storage**: Data survives server restarts
- ✅ **Scalable**: Can handle thousands of NFT metadata entries
- ✅ **Real-time**: Can add real-time features later
- ✅ **Backup**: Automatic backups
- ✅ **Security**: Row Level Security available
- ✅ **API**: RESTful API for direct access if needed

## 6. Testing the Setup

1. Start your development server: `npm run dev`
2. Generate and mint an NFT
3. Check the console logs for Supabase success messages
4. Verify the metadata URL works by visiting it in your browser

## 7. Production Considerations

- Set up proper Row Level Security policies
- Consider using environment-specific Supabase projects
- Monitor your Supabase usage and limits
- Set up alerts for any database errors 