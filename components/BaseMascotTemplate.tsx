'use client'

import { useState } from 'react'
import { MascotTraits } from '@/types/mascot'

interface BaseMascotTemplateProps {
  traits: MascotTraits
  onTraitChange: (category: string, value: string) => void
}

export default function BaseMascotTemplate({ traits, onTraitChange }: BaseMascotTemplateProps) {
  const [showCustomization, setShowCustomization] = useState(false)

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
        <div className="w-8 h-8 bg-candle-orange rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-sm">C</span>
        </div>
        <h3 className="text-xl font-bold text-candle-dark">Base Mascot Template</h3>
      </div>

      {/* Base Mascot Preview */}
      <div className="bg-white rounded-lg p-6 border-2 border-candle-orange">
        <h4 className="font-semibold text-candle-dark mb-4">Base Design:</h4>
        <div className="text-sm text-gray-600 space-y-2">
          <p>• <strong>Head:</strong> Candle TV logo style (fixed)</p>
          <p>• <strong>Body:</strong> Chibi anthropomorphic cat style</p>
          <p>• <strong>Pose:</strong> Standing confidently, arms wide open</p>
          <p>• <strong>Clothes:</strong> Urban style with customizable elements</p>
          <p>• <strong>Style:</strong> Clean vector-style with bold outlines</p>
        </div>
      </div>

      {/* Customization Toggle */}
      <button
        onClick={() => setShowCustomization(!showCustomization)}
        className="w-full py-3 bg-candle-orange text-white rounded-lg hover:bg-candle-accent transition-colors"
      >
        {showCustomization ? 'Hide' : 'Show'} Customization Options
      </button>

      {showCustomization && (
        <div className="space-y-6">
          {/* Background Color */}
          <div>
            <h4 className="font-semibold text-candle-dark mb-3">Background Color:</h4>
            <div className="grid grid-cols-4 gap-2">
              {backgroundColors.map((color) => (
                <button
                  key={color.value}
                  onClick={() => onTraitChange('background', color.value)}
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
                  onClick={() => onTraitChange('glasses', style.value)}
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
                  onClick={() => onTraitChange('hat', style.value)}
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
                  onClick={() => onTraitChange('bowtie', color.value)}
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
                  onClick={() => onTraitChange('pants', color.value)}
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
      )}

      {/* Design Notes */}
      <div className="p-4 bg-candle-light rounded-lg">
        <h4 className="font-semibold text-candle-dark mb-2">🎨 Design Notes:</h4>
        <ul className="text-sm text-candle-dark space-y-1">
          <li>• <strong>Fixed Elements:</strong> Candle TV head, chibi body style, confident pose</li>
          <li>• <strong>Customizable:</strong> Background, glasses, hat, bowtie, pants colors</li>
          <li>• <strong>Style:</strong> Clean vector-style with bold outlines</li>
          <li>• <strong>Branding:</strong> Maintains Candle TV identity with orange/black theme</li>
        </ul>
      </div>
    </div>
  )
} 