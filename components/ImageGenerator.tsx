'use client'

import { useState } from 'react'
import { Sparkles, Loader2, Download, Image as ImageIcon } from 'lucide-react'

interface ImageGeneratorProps {
  onImageGenerated?: (imageUrl: string, description: string) => void
}

export default function ImageGenerator({ onImageGenerated }: ImageGeneratorProps) {
  const [description, setDescription] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState('')
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [generatedDescription, setGeneratedDescription] = useState('')

  const generateImage = async () => {
    if (!description.trim()) {
      setError('Please enter a description')
      return
    }

    setIsGenerating(true)
    setError('')
    setGeneratedImage(null)

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: description.trim() }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate image')
      }

      const data = await response.json()
      
      if (data.imageUrl) {
        setGeneratedImage(data.imageUrl)
        setGeneratedDescription(data.description)
        onImageGenerated?.(data.imageUrl, data.description)
        setDescription('')
      } else {
        setError('Failed to generate image. Please try again.')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while generating the image.')
      console.error('Error generating image:', err)
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadImage = async () => {
    if (!generatedImage) return

    try {
      const response = await fetch(generatedImage)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `candle-mascot-${Date.now()}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading image:', error)
      setError('Failed to download image')
    }
  }

  const examplePrompts = [
    "A cute orange mascot with black eyes, wearing a blue shirt and black pants",
    "A friendly cartoon character with glasses, orange hat, and a bowtie",
    "A mascot with green eyes, purple shirt, and a crown accessory",
    "A character with round glasses, red shirt, and white shoes",
    "A cute mascot with sunglasses, yellow shirt, and a necklace"
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <ImageIcon className="text-candle-orange" size={24} />
        <h3 className="text-xl font-bold text-candle-dark">AI Image Generator</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-candle-dark mb-2">
            Describe your ideal mascot:
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your mascot in detail... (e.g., 'A cute orange mascot with black eyes, wearing a blue shirt')"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-candle-orange focus:border-transparent resize-none"
            rows={4}
            disabled={isGenerating}
          />
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <button
          onClick={generateImage}
          disabled={isGenerating || !description.trim()}
          className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-candle-orange text-white rounded-lg hover:bg-candle-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed trait-button"
        >
          {isGenerating ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              <span>Generating Image...</span>
            </>
          ) : (
            <>
              <Sparkles size={20} />
              <span>Generate Image</span>
            </>
          )}
        </button>
      </div>

      {generatedImage && (
        <div className="space-y-4">
          <h4 className="font-semibold text-candle-dark">Generated Image:</h4>
          <div className="relative">
            <img
              src={generatedImage}
              alt="Generated mascot"
              className="w-full rounded-lg border-2 border-candle-orange"
            />
            <button
              onClick={downloadImage}
              className="absolute top-2 right-2 p-2 bg-candle-orange text-white rounded-lg hover:bg-candle-accent transition-colors"
              title="Download image"
            >
              <Download size={16} />
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        <h4 className="font-semibold text-candle-dark">Example Prompts:</h4>
        <div className="space-y-2">
          {examplePrompts.map((prompt, index) => (
            <button
              key={index}
              onClick={() => setDescription(prompt)}
              className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-candle-dark transition-colors"
            >
              "{prompt}"
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 bg-candle-light rounded-lg">
        <h4 className="font-semibold text-candle-dark mb-2">💡 Tips for better results:</h4>
        <ul className="text-sm text-candle-dark space-y-1">
          <li>• Be specific about colors, clothing, and accessories</li>
          <li>• Mention "cute" or "friendly" for better character style</li>
          <li>• Include details about eyes, glasses, clothing items</li>
          <li>• Keep descriptions clear and concise</li>
          <li>• Each generation costs $0.040 - use wisely!</li>
        </ul>
      </div>
    </div>
  )
} 