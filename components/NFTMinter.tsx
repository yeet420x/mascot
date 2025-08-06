'use client'

import { useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { Loader2, Coins, CheckCircle } from 'lucide-react'

interface NFTMinterProps {
  imageUrl: string
  description: string
  onMintSuccess?: (mintAddress: string) => void
}

export default function NFTMinter({ imageUrl, description, onMintSuccess }: NFTMinterProps) {
  const { publicKey, signTransaction } = useWallet()
  const [isMinting, setIsMinting] = useState(false)
  const [mintAddress, setMintAddress] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const mintNFT = async () => {
    if (!publicKey || !signTransaction) {
      setError('Please connect your wallet first')
      return
    }

    setIsMinting(true)
    setError(null)

    try {
      // Connect to Solana devnet
      const connection = new Connection('https://api.devnet.solana.com', 'confirmed')
      
      // For now, we'll simulate the minting process
      // In a real implementation, you would:
      // 1. Upload image to IPFS/Arweave
      // 2. Create metadata JSON
      // 3. Upload metadata to IPFS/Arweave
      // 4. Create the NFT using Metaplex
      
      // Simulate minting delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Generate a mock mint address for demonstration
      const mockMintAddress = `Mint${Date.now()}${Math.random().toString(36).substr(2, 9)}`
      
      setMintAddress(mockMintAddress)
      onMintSuccess?.(mockMintAddress)
      
    } catch (err) {
      console.error('Error minting NFT:', err)
      setError(err instanceof Error ? err.message : 'Failed to mint NFT')
    } finally {
      setIsMinting(false)
    }
  }

  if (!publicKey) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-800 text-sm">
          Please connect your wallet to mint NFTs
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Coins className="text-candle-orange" size={24} />
        <h3 className="text-xl font-bold text-candle-dark">Mint as NFT</h3>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {mintAddress ? (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <CheckCircle className="text-green-600" size={20} />
            <span className="text-green-800 font-medium">NFT Minted Successfully!</span>
          </div>
          <p className="text-green-700 text-sm mt-2">
            Mint Address: {mintAddress}
          </p>
          <a
            href={`https://explorer.solana.com/address/${mintAddress}?cluster=devnet`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-candle-orange hover:text-candle-accent text-sm underline mt-2 inline-block"
          >
            View on Solana Explorer
          </a>
        </div>
      ) : (
        <button
          onClick={mintNFT}
          disabled={isMinting}
          className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-candle-orange text-white rounded-lg hover:bg-candle-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isMinting ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              <span>Minting NFT...</span>
            </>
          ) : (
            <>
              <Coins size={20} />
              <span>Mint as NFT</span>
            </>
          )}
        </button>
      )}

      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">ℹ️ NFT Minting Info:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Network: Solana Devnet</li>
          <li>• Cost: ~0.002 SOL (transaction fees)</li>
          <li>• Royalty: 5% on secondary sales</li>
          <li>• Supply: 1 of 1 (unique)</li>
          <li>• Metadata: Stored on-chain</li>
          <li>• Status: Demo Mode (simulated minting)</li>
        </ul>
      </div>

      <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
        <h4 className="font-semibold text-orange-800 mb-2">🚧 Development Note:</h4>
        <p className="text-sm text-orange-700">
          This is currently in demo mode. For production use, you'll need to:
        </p>
        <ul className="text-sm text-orange-700 space-y-1 mt-2">
          <li>• Set up proper image upload to IPFS/Arweave</li>
          <li>• Configure Metaplex with proper keypair</li>
          <li>• Handle transaction signing properly</li>
          <li>• Add proper error handling</li>
        </ul>
      </div>
    </div>
  )
} 