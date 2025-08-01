'use client'

import { useState } from 'react'
import { Sparkles, Loader2, Download, Shuffle, Palette } from 'lucide-react'
import { MascotTraits } from '@/types/mascot'

interface AIImageGeneratorProps {
  onMascotGenerated?: (imageUrl: string, traits: MascotTraits) => void
}

export default function AIImageGenerator({ onMascotGenerated }: AIImageGeneratorProps) {
  const [traits, setTraits] = useState<MascotTraits>({
    head: 'default',
    eyes: 'default',
    glasses: 'none',
    shirt: 'default',
    pants: 'default',
    shoes: 'default',
    accessories: 'none',
    background: '#F5F5DC',
    hat: 'none',
    bowtie: 'none'
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

  const generateRandomTraits = () => {
    const headColors = ['default', 'orange', 'blue', 'green', 'red', 'purple', 'yellow', 'pink', 'gray', 'black']
    const eyeColors = ['default', 'blue', 'green', 'brown', 'gray', 'black']
    const glassesStyles = ['none', 'round', 'square', 'sunglasses']
    const shirtColors = ['default', 'orange', 'blue', 'green', 'red', 'purple', 'yellow', 'pink', 'gray', 'black', 'white']
    const pantsColors = ['default', 'blue', 'black', 'gray', 'brown', 'green', 'red']
    const shoeColors = ['default', 'black', 'brown', 'white', 'red', 'blue']
    const accessories = ['none', 'hat', 'crown', 'bowtie', 'necklace']
    const backgroundColors = ['#F5F5DC', '#FF6B35', '#3B82F6', '#10B981', '#8B5CF6', '#EC4899', '#6B7280', '#FFFFFF']
    const hatStyles = ['none', 'red-cap', 'orange-cap', 'blue-cap']
    const bowtieColors = ['none', 'red', 'orange', 'blue']

    const randomTraits: MascotTraits = {
      head: headColors[Math.floor(Math.random() * headColors.length)],
      eyes: eyeColors[Math.floor(Math.random() * eyeColors.length)],
      glasses: glassesStyles[Math.floor(Math.random() * glassesStyles.length)],
      shirt: shirtColors[Math.floor(Math.random() * shirtColors.length)],
      pants: pantsColors[Math.floor(Math.random() * pantsColors.length)],
      shoes: shoeColors[Math.floor(Math.random() * shoeColors.length)],
      accessories: accessories[Math.floor(Math.random() * accessories.length)],
      background: backgroundColors[Math.floor(Math.random() * backgroundColors.length)],
      hat: hatStyles[Math.floor(Math.random() * hatStyles.length)],
      bowtie: bowtieColors[Math.floor(Math.random() * bowtieColors.length)]
    }

    setTraits(randomTraits)
  }

  const generateMascot = async () => {
    setIsGenerating(true)
    setError('')
    setGeneratedImage(null)

    try {
      const response = await fetch('/api/generate-image-gemini', {
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

  const headColors = [
    { name: 'Default', value: 'default', class: 'bg-gray-300' },
    { name: 'Orange', value: 'orange', class: 'bg-candle-orange' },
    { name: 'Blue', value: 'blue', class: 'bg-blue-500' },
    { name: 'Green', value: 'green', class: 'bg-green-500' },
    { name: 'Red', value: 'red', class: 'bg-red-500' },
    { name: 'Purple', value: 'purple', class: 'bg-purple-500' },
    { name: 'Yellow', value: 'yellow', class: 'bg-yellow-500' },
    { name: 'Pink', value: 'pink', class: 'bg-pink-500' },
    { name: 'Gray', value: 'gray', class: 'bg-gray-500' },
    { name: 'Black', value: 'black', class: 'bg-black' }
  ]

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
    { name: 'No Glasses', value: 'none' },
    { name: 'Round Glasses', value: 'round' },
    { name: 'Square Glasses', value: 'square' },
    { name: 'Sunglasses', value: 'sunglasses' }
  ]

  const hatStyles = [
    { name: 'No Hat', value: 'none' },
    { name: 'Red Cap', value: 'red-cap' },
    { name: 'Orange Cap', value: 'orange-cap' },
    { name: 'Blue Cap', value: 'blue-cap' }
  ]

  const bowtieColors = [
    { name: 'No Bowtie', value: 'none' },
    { name: 'Red Bowtie', value: 'red' },
    { name: 'Orange Bowtie', value: 'orange' },
    { name: 'Blue Bowtie', value: 'blue' }
  ]

  const pantsColors = [
    { name: 'Default', value: 'default', class: 'bg-gray-300' },
    { name: 'Blue', value: 'blue', class: 'bg-blue-500' },
    { name: 'Black', value: 'black', class: 'bg-black' },
    { name: 'Gray', value: 'gray', class: 'bg-gray-500' },
    { name: 'Brown', value: 'brown', class: 'bg-amber-700' },
    { name: 'Green', value: 'green', class: 'bg-green-500' },
    { name: 'Red', value: 'red', class: 'bg-red-500' }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Sparkles className="text-candle-orange" size={24} />
        <h3 className="text-xl font-bold text-candle-dark">AI Mascot Generator</h3>
      </div>

      {/* Random Button */}
      <button
        onClick={generateRandomTraits}
        className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
      >
        <Shuffle size={20} />
        <span>Randomize All Traits</span>
      </button>

      {/* Customization Options */}
      <div className="space-y-6">
        {/* Head Color */}
        <div>
          <h4 className="font-semibold text-candle-dark mb-3">Head Color:</h4>
          <div className="grid grid-cols-5 gap-2">
            {headColors.map((color) => (
              <button
                key={color.value}
                onClick={() => handleTraitChange('head', color.value)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  traits.head === color.value
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
          <div className="grid grid-cols-4 gap-2">
            {pantsColors.map((color) => (
              <button
                key={color.value}
                onClick={() => handleTraitChange('pants', color.value)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  traits.pants === color.value
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

             {/* Info */}
       <div className="p-4 bg-candle-light rounded-lg">
         <h4 className="font-semibold text-candle-dark mb-2">🎨 How it works:</h4>
                  <ul className="text-sm text-candle-dark space-y-1">
            <li>• <strong>Candle TV Style:</strong> Inspired by https://candle.tv/ branding</li>
            <li>• <strong>Customization:</strong> Apply colors and accessories to your mascot</li>
            <li>• <strong>Random:</strong> Click "Randomize" to generate random traits</li>
           
          </ul>
       </div>
    </div>
  )
} 