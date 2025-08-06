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
        <h3 className="text-xl font-bold text-candle-dark">AI-Powered Mascot Generator</h3>
      </div>

      {/* Enhanced Instructions */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-2">
          <Zap className="text-blue-600 mt-1" size={20} />
          <div>
            <h4 className="font-semibold text-blue-800 mb-2">🎨 Complete Freedom to Describe Your Mascot:</h4>
            <p className="text-blue-700 text-sm mb-3">
              Describe your mascot in any way you want! Our AI will intelligently extract colors, accessories, and styles from your description.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded p-2 mb-3">
              <p className="text-yellow-800 text-xs font-medium">💡 <strong>Face Styles Note:</strong> Creative styles like "doge", "goku", "matrix" are displayed <em>inside</em> the mascot's screen/face, not replacing the entire face structure.</p>
            </div>
            <div className="text-blue-700 text-sm">
              <p className="font-medium mb-2">What the AI can understand:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="text-green-600" size={14} />
                  <span><strong>Colors:</strong> Any color name (red, blue, green, etc.)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="text-green-600" size={14} />
                  <span><strong>Accessories:</strong> crown, necklace, watch, bracelet, etc.</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="text-green-600" size={14} />
                  <span><strong>Clothing:</strong> shirts, pants, shoes, hats, glasses</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="text-green-600" size={14} />
                  <span><strong>Styles:</strong> round glasses, square glasses, etc.</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="text-green-600" size={14} />
                  <span><strong>Face Styles:</strong> pepe, doge, goku, matrix, anime, pixel (inside screen)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="text-green-600" size={14} />
                  <span><strong>Backgrounds:</strong> matrix, cyber, neon, space, fantasy themes</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="text-green-600" size={14} />
                  <span><strong>Weapons:</strong> lightsaber, sword, dagger, bow, gun, staff</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="text-green-600" size={14} />
                  <span><strong>Memes:</strong> pepe, doge, wojak, chad, virgin, stonks</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="text-green-600" size={14} />
                  <span><strong>Anime:</strong> goku, naruto, luffy, saitama, deku, allmight</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="text-green-600" size={14} />
                  <span><strong>Gaming:</strong> minecraft, roblox, fortnite, valorant, pokemon</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="text-green-600" size={14} />
                  <span><strong>Sci-fi:</strong> lightsaber, blaster, alien, space, galaxy, robot</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="text-green-600" size={14} />
                  <span><strong>Fantasy:</strong> dragon, unicorn, wizard, elf, fairy, magic</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Example Prompts */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="font-semibold text-gray-800 mb-2">💡 Example prompts (be creative!):</h4>
        <div className="space-y-2 text-sm text-gray-700">
          <p>• "A pepe face mascot with neon eyes, cyber glasses, wearing a black shirt and red pants holding a lightsaber"</p>
          <p>• "A goku face mascot with anime eyes, pixel style, purple shirt and green pants with a crown"</p>
          <p>• "A doge face mascot with glowing eyes, tech glasses, wearing a white jacket and blue jeans"</p>
          <p>• "A matrix face mascot with digital eyes, cyber background, holding a blaster and wearing armor"</p>
          <p>• "A chad face mascot with laser eyes, metallic glasses, wearing a gold shirt and silver pants with a sword"</p>
          <p>• "A wojak face mascot with sad eyes, vintage glasses, wearing a gray hoodie and black pants"</p>
        </div>
      </div>

      {/* Prompt Input */}
      <div className="space-y-3">
        <label htmlFor="prompt" className="block text-sm font-medium text-candle-dark">
          Describe your mascot (be as creative as you want!):
        </label>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your mascot here... (e.g., 'A majestic mascot with golden hair, emerald eyes, wearing a royal purple shirt with a silver crown')"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-candle-orange focus:border-transparent resize-none"
          rows={4}
        />
      </div>

      {/* Error Display */}
      {error && (
        <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="text-red-600" size={20} />
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Generate Button */}
      <button
        onClick={handleGenerateFromPrompt}
        disabled={isProcessing || !prompt.trim()}
        className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-candle-orange to-purple-600 text-white rounded-lg hover:from-candle-accent hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isProcessing ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>AI Processing Your Description...</span>
          </>
        ) : (
          <>
            <Sparkles size={20} />
            <span>Generate Mascot from Description</span>
          </>
        )}
      </button>

      {/* Extracted Information Display */}
      {extractedInfo.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-semibold text-yellow-800 mb-3">🔍 AI Extracted Information:</h4>
          <div className="space-y-1 text-sm">
            {extractedInfo.map((info, index) => (
              <div key={index} className="flex items-center space-x-2">
                <CheckCircle className="text-yellow-600" size={14} />
                <span className="text-yellow-700">{info}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Generated Traits Display */}
      {generatedTraits && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-semibold text-green-800 mb-3">✨ Generated Traits:</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {Object.entries(generatedTraits).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="text-green-700 capitalize">{key}:</span>
                <span className="text-green-800 font-medium">{value}</span>
              </div>
            ))}
          </div>
          <button
            onClick={handleUseTraits}
            className="mt-3 w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Use These Traits
          </button>
        </div>
      )}
    </div>
  )
} 