'use client'

import { useState, useEffect } from 'react'
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata'
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters'
import { createSignerFromKeypair } from '@metaplex-foundation/umi'
import { generateSigner } from '@metaplex-foundation/umi'
import { createNft } from '@metaplex-foundation/mpl-token-metadata'
import base58 from 'bs58'
import TraitSelector from './TraitSelector'
import NFTMinter from './NFTMinter'
import SavedMascots from './SavedMascots'
import PromptBasedGenerator from './PromptBasedGenerator'
import { MessageSquare } from 'lucide-react'
import { MascotTraits } from '@/types/mascot'

interface AIImageGeneratorProps {
  onGenerate: () => void
}

export default function AIImageGenerator({ onGenerate }: AIImageGeneratorProps) {
  const [traits, setTraits] = useState<MascotTraits>({
    head: 'default',
    eyes: 'brown',
    glasses: 'none',
    shirt: 'orange',
    pants: 'blue',
    shoes: 'black',
    accessories: 'none',
    background: '#F5F5DC',
    hat: 'none',
    bowtie: 'none'
  })

  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'manual' | 'prompt'>('manual')
  const [rpcUrl, setRpcUrl] = useState<string>('https://solana-mainnet.g.alchemy.com/v2/demo')

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

  const handleTraitsChange = (newTraits: MascotTraits) => {
    setTraits(newTraits)
  }

  const handleTraitChange = (category: string, value: string) => {
    setTraits(prev => ({ ...prev, [category]: value }))
  }

  const handleGenerate = async () => {
    setIsGenerating(true)
    setError(null)
    setGeneratedImageUrl(null)

    try {
      const response = await fetch('/api/generate-image-gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ traits }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate image')
      }

      const data = await response.json()
      setGeneratedImageUrl(data.imageUrl)
    } catch (err) {
      console.error('Error generating image:', err)
      setError(err instanceof Error ? err.message : 'Failed to generate image')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleTraitsGenerated = (newTraits: MascotTraits) => {
    setTraits(newTraits)
  }

  const getConnection = () => {
    return new Connection(rpcUrl)
  }

  const getSimpleConnection = () => {
    return new Connection(rpcUrl)
  }

  const getQuickConnection = () => {
    return new Connection(rpcUrl)
  }

  const getUmi = () => {
    return createUmi(rpcUrl)
  }

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
      <button
          onClick={() => setActiveTab('manual')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'manual'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Manual Selection
              </button>
              <button
          onClick={() => setActiveTab('prompt')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'prompt'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <MessageSquare className="inline mr-2" size={16} />
          AI Prompt
              </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'manual' ? (
        <TraitSelector traits={traits} onTraitChange={handleTraitChange} />
      ) : (
        <PromptBasedGenerator onTraitsGenerated={handleTraitsGenerated} onGenerate={handleGenerate} />
      )}

      {/* Generate Button */}
      {activeTab === 'manual' && (
      <button
          onClick={handleGenerate}
        disabled={isGenerating}
          className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-candle-orange to-purple-600 text-white rounded-lg hover:from-candle-accent hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isGenerating ? (
          <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>Generating Mascot...</span>
          </>
        ) : (
          <>
              <span>Generate Mascot</span>
          </>
        )}
      </button>
      )}

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Generated Image */}
      {generatedImageUrl && (
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <img
              src={generatedImageUrl}
              alt="Generated Mascot"
              className="w-full h-auto rounded-lg"
            />
          </div>

          <NFTMinter
            imageUrl={generatedImageUrl}
            description={`Candle TV Mascot with traits: ${JSON.stringify(traits)}`}
          />
        </div>
      )}

      {/* Saved Mascots */}
      <SavedMascots 
        savedMascots={[]} 
        onLoadMascot={() => {}} 
        onDeleteMascot={() => {}} 
      />
    </div>
  )
} 