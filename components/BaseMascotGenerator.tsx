'use client'

import { useState } from 'react'
import { Sparkles, Loader2, Download, Image as ImageIcon, Palette } from 'lucide-react'
import { MascotTraits } from '@/types/mascot'

interface BaseMascotGeneratorProps {
  onMascotGenerated?: (imageUrl: string, traits: MascotTraits) => void
}

export default function BaseMascotGenerator({ onMascotGenerated }: BaseMascotGeneratorProps) {
  const [traits, setTraits] = useState<MascotTraits>({
    head: 'candle-tv',
    eyes: 'default',
    glasses: 'black-sunglasses',
    shirt: 'white-buttoned',
    pants: 'pink',
    shoes: 'brown-loafers',
    accessories: 'suspenders',
    background: '#F5F5DC',
    hat: 'red-cap',
    bowtie: 'red'
  })
  
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState('')
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)

  const handleTraitChange = (category: string, value: string) => {
    setTraits(prev => ({
      ...prev,
      [category]: value
    }))
  }

  const generateMascot = async () => {
    setIsGenerating(true)
    setError('')
    setGeneratedImage(null)

    try {
      const response = await fetch('/api/generate-base-mascot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ traits }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate mascot')
      }

      const data = await response.json()
      
      if (data.imageUrl) {
        setGeneratedImage(data.imageUrl)
        onMascotGenerated?.(data.imageUrl, traits)
      } else {
        setError('Failed to generate mascot. Please try again.')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while generating the mascot.')
      console.error('Error generating mascot:', err)
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
      link.download = `candle-tv-mascot-${Date.now()}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading image:', error)
      setError('Failed to download image')
    }
  }

  const backgroundColors = [
    { name: 'Light Beige', value: '#F5F5DC', class: 'bg-amber-50' },
    { name: 'Orange', value: '#FF6B35', class: 'bg-candle-orange' },
    { name: 'Blue', value: '#3B82F6', class: 'bg-blue-500' },
    { name: 'Green', value: '#10B981', class: 'bg-green-500' },
    { name: 'Purple', value: '#8B5CF6', class: 'bg-purple-500' },
    { name: 'Pink', value: '#EC4899', class: 'bg-pink-500' },
    { name: 'Gray', value: '#6B7280', class: 'bg-gray-500' },
    { name: 'White', value: '#FFFFFF', class: 'bg-white' }
  ]

  const glassesStyles = [
    { name: 'Black Sunglasses', value: 'black-sunglasses' },
    { name: 'Round Glasses', value: 'round-glasses' },
    { name: 'Square Glasses', value: 'square-glasses' },
    { name: 'No Glasses', value: 'none' }
  ]

  const hatStyles = [
    { name: 'Red Baseball Cap', value: 'red-cap' },
    { name: 'Orange Cap', value: 'orange-cap' },
    { name: 'Blue Cap', value: 'blue-cap' },
    { name: 'No Hat', value: 'none' }
  ]

  const bowtieColors = [
    { name: 'Red Bowtie', value: 'red' },
    { name: 'Orange Bowtie', value: 'orange' },
    { name: 'Blue Bowtie', value: 'blue' },
    { name: 'No Bowtie', value: 'none' }
  ]

  const pantsColors = [
    { name: 'Pink Pants', value: 'pink' },
    { name: 'Blue Pants', value: 'blue' },
    { name: 'Black Pants', value: 'black' },
    { name: 'Orange Pants', value: 'orange' }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Palette className="text-candle-orange" size={24} />
        <h3 className="text-xl font-bold text-candle-dark">Base Mascot Generator</h3>
      </div>

      {/* Base Design Info */}
      <div className="bg-white rounded-lg p-6 border-2 border-candle-orange">
        <h4 className="font-semibold text-candle-dark mb-4">Base Design:</h4>
        <div className="text-sm text-gray-600 space-y-2">
          <p>• <strong>Head:</strong> Candle TV logo style (orange "C" in circle)</p>
          <p>• <strong>Body:</strong> Chibi anthropomorphic cat style</p>
          <p>• <strong>Pose:</strong> Standing confidently, arms wide open</p>
          <p>• <strong>Style:</strong> Clean vector-style with bold outlines</p>
          <p>• <strong>Fixed:</strong> White shirt, navy suspenders, brown loafers</p>
        </div>
      </div>

      {/* Customization Options */}
      <div className="space-y-6">
        {/* Background Color */}
        <div>
          <h4 className="font-semibold text-candle-dark mb-3">Background Color:</h4>
          <div className="grid grid-cols-4 gap-2">
            {backgroundColors.map((color) => (
              <button
                key={color.value}
                onClick={() => handleTraitChange('background', color.value)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  traits.background === color.value
                    ? 'border-candle-orange shadow-lg'
                    : 'border-gray-200 hover:border-candle-orange'
                }`}
              >
                <div className={`w-full h-8 rounded ${color.class} mb-2`}></div>
                <span className="text-xs text-candle-dark">{color.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Glasses */}
        <div>
          <h4 className="font-semibold text-candle-dark mb-3">Glasses Style:</h4>
          <div className="grid grid-cols-2 gap-2">
            {glassesStyles.map((style) => (
              <button
                key={style.value}
                onClick={() => handleTraitChange('glasses', style.value)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  traits.glasses === style.value
                    ? 'border-candle-orange bg-candle-light'
                    : 'border-gray-200 hover:border-candle-orange'
                }`}
              >
                <span className="text-sm text-candle-dark">{style.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Hat */}
        <div>
          <h4 className="font-semibold text-candle-dark mb-3">Hat Style:</h4>
          <div className="grid grid-cols-2 gap-2">
            {hatStyles.map((style) => (
              <button
                key={style.value}
                onClick={() => handleTraitChange('hat', style.value)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  traits.hat === style.value
                    ? 'border-candle-orange bg-candle-light'
                    : 'border-gray-200 hover:border-candle-orange'
                }`}
              >
                <span className="text-sm text-candle-dark">{style.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Bowtie */}
        <div>
          <h4 className="font-semibold text-candle-dark mb-3">Bowtie Color:</h4>
          <div className="grid grid-cols-2 gap-2">
            {bowtieColors.map((color) => (
              <button
                key={color.value}
                onClick={() => handleTraitChange('bowtie', color.value)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  traits.bowtie === color.value
                    ? 'border-candle-orange bg-candle-light'
                    : 'border-gray-200 hover:border-candle-orange'
                }`}
              >
                <span className="text-sm text-candle-dark">{color.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Pants */}
        <div>
          <h4 className="font-semibold text-candle-dark mb-3">Pants Color:</h4>
          <div className="grid grid-cols-2 gap-2">
            {pantsColors.map((color) => (
              <button
                key={color.value}
                onClick={() => handleTraitChange('pants', color.value)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  traits.pants === color.value
                    ? 'border-candle-orange bg-candle-light'
                    : 'border-gray-200 hover:border-candle-orange'
                }`}
              >
                <span className="text-sm text-candle-dark">{color.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Generate Button */}
      <button
        onClick={generateMascot}
        disabled={isGenerating}
        className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-candle-orange text-white rounded-lg hover:bg-candle-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed trait-button"
      >
        {isGenerating ? (
          <>
            <Loader2 className="animate-spin" size={20} />
            <span>Generating Mascot...</span>
          </>
        ) : (
          <>
            <Sparkles size={20} />
            <span>Generate Candle TV Mascot</span>
          </>
        )}
      </button>

      {/* Generated Result */}
      {generatedImage && (
        <div className="space-y-4">
          <h4 className="font-semibold text-candle-dark">Generated Mascot:</h4>
          <div className="relative">
            <img
              src={generatedImage}
              alt="Generated Candle TV mascot"
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

      {/* Design Notes */}
      <div className="p-4 bg-candle-light rounded-lg">
        <h4 className="font-semibold text-candle-dark mb-2">🎨 Design Notes:</h4>
        <ul className="text-sm text-candle-dark space-y-1">
          <li>• <strong>Fixed Elements:</strong> Candle TV head, chibi body, confident pose</li>
          <li>• <strong>Customizable:</strong> Background, glasses, hat, bowtie, pants</li>
          <li>• <strong>Style:</strong> Clean vector-style with bold outlines</li>
          <li>• <strong>Branding:</strong> Maintains Candle TV identity</li>
          <li>• <strong>Cost:</strong> $0.040 per generation</li>
        </ul>
      </div>
    </div>
  )
} 