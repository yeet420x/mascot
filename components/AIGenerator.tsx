'use client'

import { useState } from 'react'
import { MascotData } from '@/types/mascot'
import { Sparkles, Loader2 } from 'lucide-react'

interface AIGeneratorProps {
  onMascotGenerated: (mascot: MascotData) => void
}

export default function AIGenerator({ onMascotGenerated }: AIGeneratorProps) {
  const [description, setDescription] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState('')

  const generateMascot = async () => {
    if (!description.trim()) {
      setError('Please enter a description')
      return
    }

    setIsGenerating(true)
    setError('')

    try {
      const response = await fetch('/api/generate-mascot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: description,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate mascot')
      }

      const data = await response.json()
      
      if (data.mascot) {
        onMascotGenerated(data.mascot)
        setDescription('')
      } else {
        setError('Failed to generate mascot. Please try again.')
      }
    } catch (err) {
      setError('An error occurred while generating the mascot. Please try again.')
      console.error('Error generating mascot:', err)
    } finally {
      setIsGenerating(false)
    }
  }

  const exampleDescriptions = [
    "A friendly orange mascot with blue eyes wearing a red shirt and black pants",
    "A cool mascot with sunglasses, purple shirt, and white shoes",
    "A cute mascot with green eyes, yellow shirt, and a crown accessory",
    "A professional mascot with black glasses, white shirt, and brown shoes"
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Sparkles className="text-candle-orange" size={24} />
        <h3 className="text-xl font-bold text-candle-dark">AI Mascot Generator</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-candle-dark mb-2">
            Describe your ideal mascot:
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the mascot you want to create... (e.g., 'A friendly orange mascot with blue eyes wearing a red shirt')"
            className="w-full h-32 px-4 py-3 border-2 border-candle-orange rounded-lg focus:outline-none focus:ring-2 focus:ring-candle-accent resize-none"
            disabled={isGenerating}
          />
        </div>

        {error && (
          <div className="p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <button
          onClick={generateMascot}
          disabled={isGenerating || !description.trim()}
          className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-candle-orange text-white rounded-lg font-semibold hover:bg-candle-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors trait-button"
        >
          {isGenerating ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Sparkles size={20} />
              <span>Generate Mascot</span>
            </>
          )}
        </button>
      </div>

      {/* Example Descriptions */}
      <div className="space-y-3">
        <h4 className="font-semibold text-candle-dark">Example Descriptions:</h4>
        <div className="space-y-2">
          {exampleDescriptions.map((example, index) => (
            <button
              key={index}
              onClick={() => setDescription(example)}
              className="block w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-sm text-gray-700"
            >
              "{example}"
            </button>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="p-4 bg-candle-light rounded-lg">
        <h4 className="font-semibold text-candle-dark mb-2">💡 Tips for better results:</h4>
        <ul className="text-sm text-candle-dark space-y-1">
          <li>• Mention colors for different parts (head, shirt, pants, shoes)</li>
          <li>• Specify accessories like glasses, hats, or crowns</li>
          <li>• Describe the personality or style you want</li>
          <li>• Be specific about eye colors and facial features</li>
        </ul>
      </div>
    </div>
  )
} 