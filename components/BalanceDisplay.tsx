'use client'

import { useState, useEffect } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { Wallet, Coins, Loader2, AlertCircle } from 'lucide-react'

export default function BalanceDisplay() {
  const { publicKey } = useWallet()
  const [balance, setBalance] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [rpcUrl, setRpcUrl] = useState<string>('')

  useEffect(() => {
    const fetchRpcUrl = async () => {
      try {
        const response = await fetch('/api/get-rpc-url')
        if (response.ok) {
          const data = await response.json()
          setRpcUrl(data.rpcUrl)
        }
      } catch (err) {
        console.error('Failed to fetch RPC URL:', err)
      }
    }
    fetchRpcUrl()
  }, [])

  useEffect(() => {
    if (publicKey && rpcUrl) {
      checkBalance()
    }
  }, [publicKey, rpcUrl])

  const checkBalance = async () => {
    if (!publicKey || !rpcUrl) return

    try {
      setIsLoading(true)
      setError(null)
      
      const connection = new Connection(rpcUrl)
      const balance = await connection.getBalance(publicKey)
      setBalance(balance / LAMPORTS_PER_SOL)
    } catch (err) {
      setError('Failed to fetch balance')
      console.error('Error checking balance:', err)
    } finally {
      setIsLoading(false)
    }
  }

  if (!publicKey) {
    return (
      <div className="bg-white dark:bg-candle-dark rounded-2xl p-6 shadow-lg dark:shadow-dark-elegant border border-candle-orange/20">
        <div className="text-center py-8">
          <Wallet className="mx-auto text-candle-orange/50 dark:text-candle-orange/30 mb-4" size={48} />
          <h3 className="text-lg font-medium text-candle-dark dark:text-candle-light mb-2">
            Wallet Not Connected
          </h3>
          <p className="text-sm text-candle-dark/70 dark:text-candle-light/70">
            Connect your wallet to view your balance
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-candle-dark rounded-2xl p-6 shadow-lg dark:shadow-dark-elegant border border-candle-orange/20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-candle-dark dark:text-white flex items-center space-x-2">
          <Wallet className="text-candle-orange" size={24} />
          <span>Wallet Status</span>
        </h3>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-green-600 dark:text-green-400 font-medium">Connected</span>
        </div>
      </div>

      <div className="bg-gradient-to-br from-candle-orange/10 to-candle-orange-light/10 dark:from-candle-orange/20 dark:to-candle-orange-light/20 rounded-xl p-4 border border-candle-orange/20">
        <div className="flex items-center space-x-2 mb-2">
          <Coins className="text-candle-orange" size={20} />
          <span className="text-sm font-medium text-candle-dark dark:text-candle-light">SOL Balance</span>
        </div>
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <Loader2 className="animate-spin text-candle-orange" size={20} />
            <span className="text-candle-dark dark:text-candle-light">Loading...</span>
          </div>
        ) : error ? (
          <div className="flex items-center space-x-2">
            <AlertCircle className="text-red-500" size={20} />
            <span className="text-red-600 dark:text-red-400 text-sm">{error}</span>
          </div>
        ) : (
          <span className="text-2xl font-bold text-candle-orange">{balance?.toFixed(4)} SOL</span>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-6 pt-4 border-t border-candle-orange/20">
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={checkBalance}
            className="px-4 py-2 bg-gradient-to-r from-candle-orange to-candle-orange-light text-white text-sm font-medium rounded-lg hover:from-candle-orange-light hover:to-candle-orange-lighter transition-all duration-200 hover:scale-105"
          >
            Refresh Balance
          </button>
          <button className="px-4 py-2 bg-white dark:bg-candle-dark text-candle-orange border border-candle-orange text-sm font-medium rounded-lg hover:bg-candle-orange hover:text-white transition-all duration-200 hover:scale-105">
            View NFTs
          </button>
          <button className="px-4 py-2 bg-white dark:bg-candle-dark text-candle-orange border border-candle-orange text-sm font-medium rounded-lg hover:bg-candle-orange hover:text-white transition-all duration-200 hover:scale-105">
            Transaction History
          </button>
        </div>
      </div>
    </div>
  )
} 