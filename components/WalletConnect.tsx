'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'

export default function WalletConnect() {
  const { publicKey, connected } = useWallet()

  return (
    <div className="flex items-center space-x-4">
      <WalletMultiButton className="bg-candle-orange hover:bg-candle-accent text-white px-4 py-2 rounded-lg transition-colors" />
      {connected && (
        <div className="text-sm text-candle-dark">
          Connected: {publicKey?.toString().slice(0, 4)}...{publicKey?.toString().slice(-4)}
        </div>
      )}
    </div>
  )
} 