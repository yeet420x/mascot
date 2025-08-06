'use client'

import { useState, useEffect } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { Coins, Loader2, AlertCircle } from 'lucide-react'

export default function BalanceDisplay() {
  const { publicKey } = useWallet()
  const [balance, setBalance] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [rpcUrl, setRpcUrl] = useState<string>('https://solana-mainnet.g.alchemy.com/v2/demo')
  const [retryCount, setRetryCount] = useState(0)

  // Fetch RPC URL securely from server
  useEffect(() => {
    const fetchRpcUrl = async () => {
      try {
        const response = await fetch('/api/get-rpc-url')
        if (response.ok) {
          const data = await response.json()
          setRpcUrl(data.rpcUrl)
          console.log('RPC URL loaded:', data.source, data.rpcUrl)
        } else {
          console.error('Failed to fetch RPC URL, using fallback')
          setRpcUrl('https://solana-mainnet.g.alchemy.com/v2/demo')
        }
      } catch (error) {
        console.error('Failed to fetch RPC URL:', error)
        // Fallback to a more reliable RPC
        setRpcUrl('https://solana-mainnet.g.alchemy.com/v2/demo')
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
        const connection = new Connection(rpcUrl, 'confirmed')
        const balance = await connection.getBalance(publicKey)
        setBalance(balance / LAMPORTS_PER_SOL)
        setRetryCount(0) // Reset retry count on success
      } catch (err) {
        console.error('Error checking balance:', err)
        
        // If it's a 403 error and we haven't retried too many times, try a different RPC
        if (retryCount < 2 && (err as any)?.message?.includes('403')) {
          console.log('RPC returned 403, trying fallback...')
          setRetryCount(prev => prev + 1)
          
          // Try a different RPC endpoint
          const fallbackRpc = 'https://solana-mainnet.g.alchemy.com/v2/demo'
          if (rpcUrl !== fallbackRpc) {
            setRpcUrl(fallbackRpc)
            return // This will trigger the useEffect again
          }
        }
        
        setError('Unable to check balance. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    checkBalance()
  }, [publicKey, rpcUrl, retryCount])

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
        <div className="flex items-center space-x-1">
          <AlertCircle className="text-red-500" size={14} />
          <span className="text-red-600 text-sm">{error}</span>
        </div>
      ) : (
        <span className="text-candle-dark font-bold">
          {balance !== null ? `${balance.toFixed(4)} SOL` : 'Loading...'}
        </span>
      )}
    </div>
  )
} 