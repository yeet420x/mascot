import dotenv from 'dotenv'
import { Keypair } from '@solana/web3.js'
import bs58 from 'bs58'

// Load environment variables
dotenv.config({ path: '.env.local' })

const PRIVATE_KEY = process.env.SHADOW_DRIVE_PRIVATE_KEY

if (!PRIVATE_KEY) {
  console.log('❌ SHADOW_DRIVE_PRIVATE_KEY not found in .env.local')
  process.exit(1)
}

try {
  const keypair = Keypair.fromSecretKey(bs58.decode(PRIVATE_KEY))
  console.log('✅ Wallet Address:', keypair.publicKey.toString())
  console.log('📝 Send SOL to this address to enable minting')
  console.log('💰 Recommended: Send at least 0.01 SOL for fees')
} catch (error) {
  console.error('❌ Error reading private key:', error.message)
} 