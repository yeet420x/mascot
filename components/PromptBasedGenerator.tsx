'use client'

import { useState } from 'react'
import { Sparkles, Lightbulb, AlertCircle, CheckCircle, Zap } from 'lucide-react'
import { MascotTraits, TraitCategory } from '@/types/mascot'

interface PromptBasedGeneratorProps {
  onTraitsGenerated: (traits: MascotTraits) => void
  onGenerate: () => void
}

const defaultTraits: MascotTraits = {
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
}

export default function PromptBasedGenerator({ onTraitsGenerated, onGenerate }: PromptBasedGeneratorProps) {
  const [prompt, setPrompt] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [generatedTraits, setGeneratedTraits] = useState<MascotTraits | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [extractedInfo, setExtractedInfo] = useState<string[]>([])

  const handleGenerateFromPrompt = async () => {
    if (!prompt.trim()) {
      setError('Please enter a description of your mascot')
      return
    }

    setIsProcessing(true)
    setError(null)
    setExtractedInfo([])

    try {
      // Use AI-powered parsing instead of manual parsing
      const response = await fetch('/api/parse-description', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description: prompt }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to parse description')
      }

      const data = await response.json()
      
      // Extract traits from AI response
      const traits = data.traits
      setGeneratedTraits(traits)
      onTraitsGenerated(traits)

      // Create extracted info for display
      const extracted: string[] = []
      Object.entries(traits).forEach(([key, value]) => {
        if (value !== 'default' && value !== 'none' && value !== '#F5F5DC') {
          extracted.push(`${key}: ${value}`)
        }
      })
      setExtractedInfo(extracted)

      console.log('AI Parsed Description:', data)
      
    } catch (err) {
      console.error('Error parsing description:', err)
      setError(err instanceof Error ? err.message : 'Failed to process your prompt. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleUseTraits = () => {
    if (generatedTraits) {
      onGenerate()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Sparkles className="text-candle-orange" size={24} />
        <h3 className="text-xl font-bold text-candle-dark dark:text-white font-ai">AI-Powered Mascot Generator</h3>
      </div>

      {/* Enhanced Instructions */}
      <div className="bg-gradient-to-r from-candle-orange/10 to-candle-orange-light/10 dark:from-candle-orange/20 dark:to-candle-orange-light/20 border border-candle-orange/20 rounded-lg p-4">
        <div className="flex items-start space-x-2">
          <Zap className="text-candle-orange mt-1" size={20} />
          <div>
            <h4 className="font-semibold text-candle-dark dark:text-white mb-2 font-ai">How it works:</h4>
            <p className="text-sm text-candle-dark/80 dark:text-white/80 font-ai">
              Describe your mascot in natural language, and our AI will automatically extract the traits and create your custom mascot.
            </p>
          </div>
        </div>
      </div>

      {/* Prompt Input */}
      <div className="space-y-3">
        <label htmlFor="prompt" className="block text-lg font-semibold text-candle-dark dark:text-white font-ai">
          Describe your mascot:
        </label>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., 'A friendly orange mascot with blue eyes, wearing a red shirt and blue jeans, on a blue background with a hat'"
          className="w-full h-32 px-4 py-3 border-2 border-candle-orange/30 rounded-xl resize-none focus:border-candle-orange focus:outline-none transition-colors duration-200 bg-white dark:bg-candle-dark text-candle-dark dark:text-candle-light placeholder-gray-400 dark:placeholder-gray-500 font-ai text-base"
        />
        <p className="text-xs text-candle-dark/60 dark:text-white/60 font-ai">
          💡 <strong>Tip:</strong> Include background details like "on a blue background", "in a forest setting", "with a sunset behind", or "in space" for better results!
        </p>
      </div>

      {/* Example Prompts */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2 font-ai">Example Prompts:</h4>
        <div className="space-y-2">
          <div className="text-xs text-blue-700 dark:text-blue-300 font-ai">
            🎨 <strong>With Background:</strong> "A cheerful orange mascot with big blue eyes, wearing a red shirt and blue jeans, on a sunny beach background"
          </div>
          <div className="text-xs text-blue-700 dark:text-blue-300 font-ai">
            🌟 <strong>Creative Setting:</strong> "A sophisticated mascot with round glasses, a bow tie, and a hat, in a magical forest setting"
          </div>
          <div className="text-xs text-blue-700 dark:text-blue-300 font-ai">
            🚀 <strong>Space Theme:</strong> "A sporty mascot with sunglasses, athletic wear, and sneakers, floating in space with stars"
          </div>
          <div className="text-xs text-blue-700 dark:text-blue-300 font-ai">
            🎭 <strong>Colorful Background:</strong> "A friendly mascot with green eyes, wearing a purple shirt, on a bright yellow background"
          </div>
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerateFromPrompt}
        disabled={isProcessing || !prompt.trim()}
        className="w-full bg-gradient-to-r from-candle-orange via-candle-orange-light to-candle-orange-lighter text-white font-bold py-3 px-6 rounded-xl shadow-candle-glow hover:shadow-orange-glow transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:scale-100 font-ai"
      >
        {isProcessing ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>Processing...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center space-x-2">
            <Sparkles size={20} />
            <span>Generate Traits</span>
          </div>
        )}
      </button>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="text-red-600 dark:text-red-400" size={20} />
            <p className="text-red-600 dark:text-red-400 text-sm font-ai">{error}</p>
          </div>
        </div>
      )}

      {/* Generated Traits Display */}
      {generatedTraits && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-3">
            <CheckCircle className="text-green-600 dark:text-green-400" size={20} />
            <h4 className="font-semibold text-green-800 dark:text-green-200 font-ai">Traits Generated Successfully!</h4>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-green-700 dark:text-green-300 font-ai">
              AI extracted the following traits from your description:
            </p>
            <div className="flex flex-wrap gap-2">
              {extractedInfo.map((info, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-green-100 dark:bg-green-800/30 text-green-800 dark:text-green-200 text-xs rounded-full border border-green-200 dark:border-green-700"
                >
                  {info}
                </span>
              ))}
            </div>
          </div>

          <button
            onClick={handleUseTraits}
            className="mt-4 w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium py-2 px-4 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 hover:scale-105 font-ai"
          >
            Use These Traits
          </button>
        </div>
      )}

      {/* Example Prompts */}
      <div className="bg-gradient-to-r from-candle-light/50 to-candle-peach/50 dark:from-candle-dark/50 dark:to-candle-dark/50 border border-candle-orange/20 rounded-lg p-4">
        <div className="flex items-start space-x-2">
          <Lightbulb className="text-candle-orange mt-1" size={20} />
          <div>
            <h4 className="font-semibold text-candle-dark dark:text-white mb-2 font-ai">Example prompts:</h4>
            <div className="text-sm text-candle-dark dark:text-candle-light space-y-2">
              <div className="p-2 bg-white dark:bg-candle-dark/50 rounded border border-candle-orange/20 font-ai">
                "A cheerful orange mascot with big blue eyes, wearing a red shirt and blue jeans"
              </div>
              <div className="p-2 bg-white dark:bg-candle-dark/50 rounded border border-candle-orange/20 font-ai">
                "A sophisticated mascot with round glasses, a bow tie, and a hat"
              </div>
              <div className="p-2 bg-white dark:bg-candle-dark/50 rounded border border-candle-orange/20 font-ai">
                "A sporty mascot with sunglasses, athletic wear, and sneakers"
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 