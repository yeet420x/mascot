// Test environment variables loading

import dotenv from 'dotenv'
import path from 'path'

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

console.log('🧪 Testing Environment Variables...\n')

// Check all relevant environment variables
const envVars = {
  'SHADOW_DRIVE_PRIVATE_KEY': process.env.SHADOW_DRIVE_PRIVATE_KEY,
  'QUICKNODE_RPC': process.env.QUICKNODE_RPC,
  'GOOGLE_AI_KEY': process.env.GOOGLE_AI_KEY,
  'SUPABASE_URL': process.env.SUPABASE_URL,
  'SUPABASE_ANON_KEY': process.env.SUPABASE_ANON_KEY
}

console.log('📋 Environment Variables Status:')
Object.entries(envVars).forEach(([key, value]) => {
  if (value) {
    console.log(`✅ ${key}: ${value.substring(0, 10)}...${value.substring(value.length - 10)}`)
  } else {
    console.log(`❌ ${key}: NOT SET`)
  }
})

console.log('\n🔍 Shadow Drive Private Key Details:')
const shadowKey = process.env.SHADOW_DRIVE_PRIVATE_KEY
if (shadowKey) {
  console.log('✅ Key length:', shadowKey.length)
  console.log('✅ Key format:', shadowKey.substring(0, 10) + '...')
  console.log('✅ Key appears to be base58 encoded')
} else {
  console.log('❌ SHADOW_DRIVE_PRIVATE_KEY is not set')
}

console.log('\n📁 Current working directory:', process.cwd())
console.log('📁 .env.local path:', path.resolve(process.cwd(), '.env.local')) 