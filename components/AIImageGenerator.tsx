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
  const [activeTab, setActiveTab] = useState<'manual' | 'prompt'>('manual')
  const [traits, setTraits] = useState<MascotTraits>({
    head: 'default',
    eyes: 'default',
    glasses: 'none',
    shirt: 'default',
    pants: 'default',
    shoes: 'default',
    accessories: 'none',
    background: 'default',
    hat: 'none',
    bowtie: 'none'
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null)
  const [rpcUrl, setRpcUrl] = useState<string>('')
  const [traitsGeneratedFromPrompt, setTraitsGeneratedFromPrompt] = useState(false)

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
    setTraitsGeneratedFromPrompt(true)
  }

  // Check if user has provided enough input to enable generation
  const canGenerate = () => {
    if (activeTab === 'manual') {
      // For manual selection, check if at least some traits are customized
      const hasCustomTraits = Object.values(traits).some(value => 
        value !== 'default' && value !== 'none'
      )
      return hasCustomTraits
    } else {
      // For AI prompt, check if traits were generated from a prompt
      return traitsGeneratedFromPrompt
    }
  }

  const handleTabSwitch = (tab: 'manual' | 'prompt') => {
    setActiveTab(tab)
    if (tab === 'manual') {
      setTraitsGeneratedFromPrompt(false)
    } else {
      // When switching to prompt tab, reset the state since user needs to generate traits again
      setTraitsGeneratedFromPrompt(false)
    }
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
    const umi = createUmi(rpcUrl)
    umi.use(mplTokenMetadata())
    return umi
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
      {/* Main Title */}
      <div className="text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-candle-dark dark:text-white mb-4 font-ai">
          Create Your Mascot
        </h2>
        <p className="text-lg text-candle-dark/80 dark:text-white/80 max-w-2xl mx-auto">
          Choose between manual trait selection or AI-powered generation to create your unique Candle TV mascot
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center space-x-2">
        <button
          onClick={() => handleTabSwitch('manual')}
          className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 font-ai ${
            activeTab === 'manual'
              ? 'bg-gradient-to-r from-candle-orange to-candle-orange-light text-white shadow-candle-glow'
              : 'bg-white dark:bg-candle-dark text-candle-orange border-2 border-candle-orange hover:bg-candle-orange hover:text-white'
          }`}
        >
          Manual Selection
        </button>
        <button
          onClick={() => handleTabSwitch('prompt')}
          className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 font-ai ${
            activeTab === 'prompt'
              ? 'bg-gradient-to-r from-candle-orange to-candle-orange-light text-white shadow-candle-glow'
              : 'bg-white dark:bg-candle-dark text-candle-orange border-2 border-candle-orange hover:bg-candle-orange hover:text-white'
          }`}
        >
          AI Prompt
        </button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Trait Selection */}
        <div className="space-y-6">
          {activeTab === 'manual' ? (
            <div className="bg-white dark:bg-candle-dark rounded-2xl p-6 shadow-lg dark:shadow-dark-elegant border border-candle-orange/20">
              <h3 className="text-2xl font-bold text-candle-dark dark:text-white mb-4 flex items-center space-x-2 font-ai">
                <MessageSquare className="text-candle-orange" size={24} />
                <span>Customize Your Mascot</span>
              </h3>
              <TraitSelector traits={traits} onTraitChange={handleTraitChange} />
            </div>
          ) : (
            <div className="bg-white dark:bg-candle-dark rounded-2xl p-6 shadow-lg dark:shadow-dark-elegant border border-candle-orange/20">
              <PromptBasedGenerator onTraitsGenerated={handleTraitsGenerated} onGenerate={onGenerate} />
            </div>
          )}
        </div>

        {/* Right Column - Preview and Generation */}
        <div className="space-y-6">
          {/* Generate Button */}
          <div className="bg-white dark:bg-candle-dark rounded-2xl p-6 shadow-lg dark:shadow-dark-elegant border border-candle-orange/20">
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !canGenerate()}
              className={`w-full font-bold py-4 px-6 rounded-xl transition-all duration-300 font-ai ${
                canGenerate() && !isGenerating
                  ? 'bg-gradient-to-r from-candle-orange via-candle-orange-light to-candle-orange-lighter text-white shadow-candle-glow hover:shadow-orange-glow hover:scale-105'
                  : 'bg-gray-400 dark:bg-gray-600 text-gray-200 dark:text-gray-300 cursor-not-allowed opacity-60'
              }`}
            >
              {isGenerating ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  <span>Generating...</span>
                </div>
              ) : !canGenerate() ? (
                <span className="text-lg">
                  {activeTab === 'manual' 
                    ? 'Select traits to generate' 
                    : 'Write a prompt to generate traits'
                  }
                </span>
              ) : (
                <span className="text-lg">Generate Mascot</span>
              )}
            </button>
            
            {/* Helpful message */}
            {!canGenerate() && (
              <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 text-center">
                {activeTab === 'manual' 
                  ? 'Customize at least one trait above to enable generation'
                  : 'Write a description and generate traits to enable generation'
                }
              </p>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Generated Image Display */}
          {generatedImageUrl && (
            <div className="bg-white dark:bg-candle-dark rounded-2xl p-6 shadow-lg dark:shadow-dark-elegant border border-candle-orange/20">
              <h3 className="text-xl font-bold text-candle-dark dark:text-white mb-4 font-ai">Generated Mascot</h3>
              <div className="space-y-4">
                <img
                  src={generatedImageUrl}
                  alt="Generated mascot"
                  className="w-full h-auto rounded-xl border-2 border-candle-orange/30"
                />
                <NFTMinter imageUrl={generatedImageUrl} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Saved Mascots Section */}
      <div className="bg-white dark:bg-candle-dark rounded-2xl p-6 shadow-lg dark:shadow-dark-elegant border border-candle-orange/20">
        <h3 className="text-2xl font-bold text-candle-dark dark:text-white mb-4 font-ai">Saved Mascots</h3>
        <SavedMascots
          savedMascots={[]}
          onLoadMascot={() => {}}
          onDeleteMascot={() => {}}
        />
      </div>
    </div>
  )
} 