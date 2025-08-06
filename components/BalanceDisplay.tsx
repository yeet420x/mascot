'use client'

import { useState, useEffect } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { Coins, Loader2 } from 'lucide-react'

export default function BalanceDisplay() {
  const { publicKey } = useWallet()
  const [balance, setBalance] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [rpcUrl, setRpcUrl] = useState<string>('https://api.mainnet-beta.solana.com')

  // Fetch RPC URL securely from server
  useEffect(() => {
    const fetchRpcUrl = async () => {
      try {
        const response = await fetch('/api/get-rpc-url')
        if (response.ok) {
          const data = await response.json()
          setRpcUrl(data.rpcUrl)
        }
      } catch (error) {
        console.error('Failed to fetch RPC URL:', error)
        // Fallback to default
        setRpcUrl('https://api.mainnet-beta.solana.com')
      }
    }

    fetchRpcUrl()
  }, [])

  useEffect(() => {
    const checkBalance = async () => {
      if (!publicKey || !rpcUrl) return

      setIsLoading(true)
      setError(null)

      try {
        const connection = new Connection(rpcUrl)
        const balance = await connection.getBalance(publicKey)
        setBalance(balance / LAMPORTS_PER_SOL)
      } catch (err) {
        console.error('Error checking balance:', err)
        setError('Failed to check balance')
      } finally {
        setIsLoading(false)
      }
    }

    checkBalance()
  }, [publicKey, rpcUrl])

  if (!publicKey) {
    return null
  }

  return (
    <div className="flex items-center space-x-2 px-4 py-2 bg-candle-light rounded-lg">
      <Coins className="text-candle-orange" size={20} />
      <span className="text-candle-dark font-medium">Balance:</span>
      {isLoading ? (
        <Loader2 className="animate-spin text-candle-orange" size={16} />
      ) : error ? (
        <span className="text-red-600 text-sm">{error}</span>
      ) : (
        <span className="text-candle-dark font-bold">
          {balance !== null ? `${balance.toFixed(4)} SOL` : 'Loading...'}
        </span>
      )}
    </div>
  )
} 