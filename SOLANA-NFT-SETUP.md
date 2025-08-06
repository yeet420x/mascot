# Solana NFT Minting Setup Guide

This guide explains how to implement full Solana NFT minting functionality for your AI mascot generator.

## Current Implementation Status

The current implementation includes:
- ✅ Solana wallet connection (Phantom, Solflare)
- ✅ Wallet adapter integration
- ✅ Basic UI for NFT minting
- ⚠️ Demo mode minting (simulated)

## Prerequisites

1. **Solana Wallet**: Install Phantom or Solflare wallet
2. **Devnet SOL**: Get test SOL from [Solana Faucet](https://faucet.solana.com/)
3. **Node.js**: Version 16 or higher

## Dependencies Already Installed

```json
{
  "@solana/web3.js": "^1.87.0",
  "@solana/wallet-adapter-react": "^0.15.35",
  "@solana/wallet-adapter-react-ui": "^0.9.34",
  "@solana/wallet-adapter-base": "^0.9.23",
  "@solana/wallet-adapter-wallets": "^0.19.23",
  "@metaplex-foundation/js": "^0.20.1"
}
```

## Step 1: Environment Setup

Create a `.env.local` file in your project root:

```env
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_SOLANA_NETWORK=devnet
```

## Step 2: Production NFT Minting Implementation

Replace the demo minting in `components/NFTMinter.tsx` with this production code:

```typescript
import { useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { Connection, PublicKey, Keypair } from '@solana/web3.js'
import { Metaplex, keypairIdentity, bundlrStorage } from '@metaplex-foundation/js'
import { Loader2, Coins, CheckCircle } from 'lucide-react'

export default function NFTMinter({ imageUrl, description, onMintSuccess }) {
  const { publicKey, signTransaction } = useWallet()
  const [isMinting, setIsMinting] = useState(false)
  const [mintAddress, setMintAddress] = useState(null)
  const [error, setError] = useState(null)

  const mintNFT = async () => {
    if (!publicKey || !signTransaction) {
      setError('Please connect your wallet first')
      return
    }

    setIsMinting(true)
    setError(null)

    try {
      // 1. Connect to Solana
      const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC_URL)
      
      // 2. Create Metaplex instance
      const metaplex = Metaplex.make(connection)
        .use(keypairIdentity(publicKey))
        .use(bundlrStorage({
          address: 'https://devnet.bundlr.network',
          providerUrl: process.env.NEXT_PUBLIC_SOLANA_RPC_URL,
          timeout: 60000,
        }))

      // 3. Upload image to Arweave
      const imageResponse = await fetch(imageUrl)
      const imageBuffer = await imageResponse.arrayBuffer()
      
      const imageUri = await metaplex.nfts().upload({
        buffer: Buffer.from(imageBuffer),
        fileName: 'mascot.png',
        displayName: 'AI Generated Mascot',
        symbol: 'MASCOT',
        description: description,
        attributes: [
          { trait_type: 'Type', value: 'AI Generated' },
          { trait_type: 'Collection', value: 'Candle Mascots' },
          { trait_type: 'Generated At', value: new Date().toISOString() },
        ],
      })

      // 4. Create NFT
      const { nft } = await metaplex.nfts().create({
        uri: imageUri,
        name: `Candle Mascot #${Date.now()}`,
        symbol: 'MASCOT',
        sellerFeeBasisPoints: 500, // 5% royalty
        creators: [
          {
            address: publicKey,
            verified: true,
            share: 100,
          },
        ],
        isMutable: true,
        maxSupply: 1,
      })

      setMintAddress(nft.address.toString())
      onMintSuccess?.(nft.address.toString())
      
    } catch (err) {
      console.error('Error minting NFT:', err)
      setError(err.message || 'Failed to mint NFT')
    } finally {
      setIsMinting(false)
    }
  }

  // ... rest of component
}
```

## Step 3: Image Upload Service

Create `app/api/upload-image/route.ts` for handling image uploads:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { Connection } from '@solana/web3.js'
import { Metaplex, bundlrStorage } from '@metaplex-foundation/js'

export async function POST(request: NextRequest) {
  try {
    const { imageUrl, description } = await request.json()

    const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC_URL)
    
    const metaplex = Metaplex.make(connection)
      .use(bundlrStorage({
        address: 'https://devnet.bundlr.network',
        providerUrl: process.env.NEXT_PUBLIC_SOLANA_RPC_URL,
        timeout: 60000,
      }))

    // Upload image to Arweave
    const imageResponse = await fetch(imageUrl)
    const imageBuffer = await imageResponse.arrayBuffer()
    
    const imageUri = await metaplex.nfts().upload({
      buffer: Buffer.from(imageBuffer),
      fileName: 'mascot.png',
      displayName: 'AI Generated Mascot',
      symbol: 'MASCOT',
      description: description,
      attributes: [
        { trait_type: 'Type', value: 'AI Generated' },
        { trait_type: 'Collection', value: 'Candle Mascots' },
      ],
    })

    return NextResponse.json({
      success: true,
      imageUri: imageUri,
    })

  } catch (error) {
    console.error('Error uploading image:', error)
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    )
  }
}
```

## Step 4: Transaction Signing

Update the minting function to handle transaction signing properly:

```typescript
const mintNFT = async () => {
  if (!publicKey || !signTransaction) {
    setError('Please connect your wallet first')
    return
  }

  setIsMinting(true)
  setError(null)

  try {
    const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC_URL)
    
    // Get the latest blockhash
    const { blockhash } = await connection.getLatestBlockhash()
    
    // Create the transaction
    const transaction = new Transaction({
      feePayer: publicKey,
      recentBlockhash: blockhash,
    })

    // Add your NFT creation instructions here
    // This would be the actual Metaplex instructions

    // Sign the transaction
    const signedTransaction = await signTransaction(transaction)
    
    // Send the transaction
    const signature = await connection.sendRawTransaction(signedTransaction.serialize())
    
    // Confirm the transaction
    await connection.confirmTransaction(signature)

    setMintAddress(signature)
    onMintSuccess?.(signature)
    
  } catch (err) {
    console.error('Error minting NFT:', err)
    setError(err.message || 'Failed to mint NFT')
  } finally {
    setIsMinting(false)
  }
}
```

## Step 5: Error Handling

Add comprehensive error handling:

```typescript
const handleMintingError = (error: any) => {
  if (error.message.includes('insufficient funds')) {
    return 'Insufficient SOL balance. Please add more SOL to your wallet.'
  }
  if (error.message.includes('User rejected')) {
    return 'Transaction was cancelled by user.'
  }
  if (error.message.includes('network')) {
    return 'Network error. Please check your connection and try again.'
  }
  return 'An unexpected error occurred. Please try again.'
}
```

## Step 6: Testing

1. **Connect Wallet**: Use Phantom or Solflare wallet
2. **Get Test SOL**: Visit [Solana Faucet](https://faucet.solana.com/)
3. **Generate Image**: Create an AI mascot
4. **Mint NFT**: Click "Mint as NFT" button
5. **Verify**: Check the NFT on [Solana Explorer](https://explorer.solana.com/?cluster=devnet)

## Step 7: Production Deployment

For mainnet deployment:

1. **Change Network**: Update to mainnet-beta
2. **Update RPC URL**: Use mainnet RPC endpoint
3. **Security**: Add proper error handling and rate limiting
4. **Monitoring**: Add transaction monitoring
5. **Gas Fees**: Ensure proper fee calculation

## Troubleshooting

### Common Issues:

1. **"User rejected" error**: User cancelled the transaction
2. **"Insufficient funds"**: Add more SOL to wallet
3. **"Network error"**: Check RPC endpoint
4. **"Invalid keypair"**: Ensure proper wallet connection

### Debug Steps:

1. Check browser console for errors
2. Verify wallet connection
3. Check SOL balance
4. Test with smaller transactions first

## Additional Features

Consider adding:

- **Collection Support**: Create NFT collections
- **Royalty Tracking**: Monitor secondary sales
- **Metadata Updates**: Allow NFT updates
- **Batch Minting**: Mint multiple NFTs
- **Gas Optimization**: Optimize transaction costs

## Resources

- [Solana Documentation](https://docs.solana.com/)
- [Metaplex Documentation](https://docs.metaplex.com/)
- [Wallet Adapter](https://github.com/solana-labs/wallet-adapter)
- [Solana Explorer](https://explorer.solana.com/)

## Support

For issues with this implementation:
1. Check the Solana Discord
2. Review Metaplex GitHub issues
3. Test on devnet first
4. Use proper error handling 