'use client'

import { useState } from 'react'
import { TraitCategory, MascotTraits } from '@/types/mascot'
import ColorWheel from './ColorWheel'

interface TraitSelectorProps {
  traits: MascotTraits
  onTraitChange: (category: TraitCategory, value: string) => void
}

const traitCategories = [
  {
    category: 'head' as TraitCategory,
    label: 'Head Style',
    options: [
      { id: 'default', name: 'Default', color: '#F5F5DC' },
      { id: 'sharp-jawline', name: 'Sharp Jawline', color: '#FFB74D' },
      { id: 'pepe', name: 'Pepe Style', color: '#4CAF50' },
      { id: 'doge', name: 'Doge Style', color: '#FFD700' },
      { id: 'goku', name: 'Goku Style', color: '#FF5722' },
      { id: 'matrix', name: 'Matrix Code', color: '#00FF00' },
      { id: 'pixel', name: '8-bit Style', color: '#2196F3' },
      { id: 'anime', name: 'Anime Style', color: '#E91E63' },
      { id: 'metallic', name: 'Metallic', color: '#9E9E9E' },
      { id: 'neon', name: 'Neon Glow', color: '#00BCD4' },
      { id: 'cyber', name: 'Cyberpunk', color: '#7C4DFF' }
    ],
    hasColorWheel: false
  },
  {
    category: 'eyes' as TraitCategory,
    label: 'Eye Style',
    options: [
      { id: 'default', name: 'Default', color: '#000000' },
      { id: 'glowing-blue', name: 'Glowing Blue', color: '#2196F3' },
      { id: 'glowing-red', name: 'Glowing Red', color: '#F44336' },
      { id: 'glowing-green', name: 'Glowing Green', color: '#4CAF50' },
      { id: 'anime-sparkle', name: 'Anime Sparkle', color: '#E91E63' },
      { id: 'laser', name: 'Laser Eyes', color: '#FF5722' },
      { id: 'rainbow', name: 'Rainbow', color: '#9C27B0' },
      { id: 'galaxy', name: 'Galaxy', color: '#3F51B5' },
      { id: 'demonic', name: 'Demonic', color: '#D32F2F' },
      { id: 'angelic', name: 'Angelic', color: '#FFC107' },
      { id: 'custom', name: 'Custom Color', color: '#000000' }
    ],
    hasColorWheel: true
  },
  {
    category: 'glasses' as TraitCategory,
    label: 'Glasses',
    options: [
      { id: 'none', name: 'None', color: 'transparent' },
      { id: 'round-tech', name: 'Round Tech', color: '#2196F3' },
      { id: 'cyber-visor', name: 'Cyber Visor', color: '#7C4DFF' },
      { id: 'matrix-shades', name: 'Matrix Shades', color: '#000000' },
      { id: 'vintage-round', name: 'Vintage Round', color: '#795548' },
      { id: 'steampunk', name: 'Steampunk', color: '#FF9800' },
      { id: 'neon-rim', name: 'Neon Rim', color: '#00BCD4' },
      { id: 'hologram', name: 'Hologram', color: '#4CAF50' },
      { id: 'pixel-shades', name: '8-bit Shades', color: '#9E9E9E' },
      { id: 'star-shaped', name: 'Star Shaped', color: '#FFC107' },
      { id: 'custom', name: 'Custom Style', color: '#000000' }
    ],
    hasColorWheel: true
  },
  {
    category: 'shirt' as TraitCategory,
    label: 'Shirt Style',
    options: [
      { id: 'default', name: 'Default', color: '#F5F5DC' },
      { id: 'hoodie', name: 'Hoodie', color: '#FF5722' },
      { id: 'cyber-jacket', name: 'Cyber Jacket', color: '#7C4DFF' },
      { id: 'tank-top', name: 'Tank Top', color: '#2196F3' },
      { id: 'suit', name: 'Suit', color: '#000000' },
      { id: 'neon-vest', name: 'Neon Vest', color: '#00BCD4' },
      { id: 'pixel-shirt', name: '8-bit Shirt', color: '#4CAF50' },
      { id: 'space-suit', name: 'Space Suit', color: '#9E9E9E' },
      { id: 'ninja-gi', name: 'Ninja Gi', color: '#212121' },
      { id: 'mage-robe', name: 'Mage Robe', color: '#673AB7' },
      { id: 'custom', name: 'Custom Style', color: '#FF6B35' }
    ],
    hasColorWheel: true
  },
  {
    category: 'accessories' as TraitCategory,
    label: 'Accessories',
    options: [
      { id: 'none', name: 'None', color: 'transparent' },
      { id: 'sword', name: 'Sword', color: '#9E9E9E' },
      { id: 'lightsaber', name: 'Lightsaber', color: '#2196F3' },
      { id: 'cyber-arm', name: 'Cyber Arm', color: '#7C4DFF' },
      { id: 'magic-staff', name: 'Magic Staff', color: '#E91E63' },
      { id: 'holo-wings', name: 'Holo Wings', color: '#00BCD4' },
      { id: 'jetpack', name: 'Jetpack', color: '#FF5722' },
      { id: 'energy-shield', name: 'Energy Shield', color: '#4CAF50' },
      { id: 'pixel-weapon', name: '8-bit Weapon', color: '#9C27B0' },
      { id: 'dragon-pet', name: 'Dragon Pet', color: '#FF9800' },
      { id: 'custom', name: 'Custom Item', color: '#000000' }
    ],
    hasColorWheel: true
  },
  {
    category: 'background' as TraitCategory,
    label: 'Background',
    options: [
      { id: 'default', name: 'Default', color: '#F5F5DC' },
      { id: 'matrix-rain', name: 'Matrix Rain', color: '#000000' },
      { id: 'cyber-city', name: 'Cyber City', color: '#7C4DFF' },
      { id: 'space-nebula', name: 'Space Nebula', color: '#3F51B5' },
      { id: 'pixel-landscape', name: 'Pixel Landscape', color: '#4CAF50' },
      { id: 'magic-realm', name: 'Magic Realm', color: '#9C27B0' },
      { id: 'neon-grid', name: 'Neon Grid', color: '#00BCD4' },
      { id: 'abstract-art', name: 'Abstract Art', color: '#FF5722' },
      { id: 'rainbow-waves', name: 'Rainbow Waves', color: '#E91E63' },
      { id: 'star-field', name: 'Star Field', color: '#FFC107' },
      { id: 'custom', name: 'Custom Color', color: '#F5F5DC' }
    ],
    hasColorWheel: true
  }
]

export default function TraitSelector({ traits, onTraitChange }: TraitSelectorProps) {
  const [activeCategory, setActiveCategory] = useState<TraitCategory>('head')
  const [customColors, setCustomColors] = useState<Record<TraitCategory, string>>({
    head: '#F5F5DC',
    eyes: '#000000',
    glasses: '#000000',
    shirt: '#FF6B35',
    pants: '#3B82F6',
    shoes: '#000000',
    accessories: '#000000',
    background: '#F5F5DC',
    hat: '#000000',
    bowtie: '#000000'
  })

  const handleColorChange = (category: TraitCategory, color: string) => {
    setCustomColors(prev => ({ ...prev, [category]: color }))
    onTraitChange(category, `custom-${color.replace('#', '')}`)
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-candle-dark dark:text-white mb-4 font-ai">Customize Your Mascot</h3>
      
      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {traitCategories.map((category) => (
          <button
            key={category.category}
            onClick={() => setActiveCategory(category.category)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 font-ai ${
              activeCategory === category.category
                ? 'bg-gradient-to-r from-candle-orange to-candle-orange-light text-white shadow-candle-glow'
                : 'bg-gray-100 dark:bg-candle-dark text-gray-700 dark:text-candle-light hover:bg-gray-200 dark:hover:bg-candle-dark/80 border border-gray-200 dark:border-candle-orange/20'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Options for selected category */}
      <div className="space-y-4">
        <h4 className="font-semibold text-candle-dark dark:text-white font-ai">
          {traitCategories.find(c => c.category === activeCategory)?.label}
        </h4>
        
        <div className="grid grid-cols-3 gap-3">
          {traitCategories
            .find(c => c.category === activeCategory)
            ?.options.map((option) => (
              <button
                key={option.id}
                onClick={() => onTraitChange(activeCategory, option.id)}
                className={`p-3 rounded-lg border-2 transition-all duration-200 trait-button ${
                  traits[activeCategory] === option.id
                    ? 'border-candle-orange bg-candle-light dark:bg-candle-orange/20 shadow-candle-glow'
                    : 'border-gray-200 dark:border-candle-orange/20 hover:border-candle-accent dark:hover:border-candle-orange-light bg-white dark:bg-candle-dark'
                }`}
              >
                <div className="flex flex-col items-center space-y-2">
                  <div
                    className="w-8 h-8 rounded-full border-2 border-gray-300 dark:border-candle-orange/30"
                    style={{ backgroundColor: option.color }}
                  />
                  <span className="text-sm font-medium text-candle-dark dark:text-candle-light font-ai">
                    {option.name}
                  </span>
                </div>
              </button>
            ))}
        </div>

        {/* Color Wheel for customizable categories */}
        {traitCategories.find(c => c.category === activeCategory)?.hasColorWheel && (
          <div className="mt-4 p-4 bg-white dark:bg-candle-dark rounded-lg border border-gray-200 dark:border-candle-orange/20">
            <h5 className="text-sm font-medium text-candle-dark dark:text-white mb-3 font-ai">Custom Color</h5>
            <ColorWheel
              color={customColors[activeCategory]}
              onChange={(color) => handleColorChange(activeCategory, color)}
            />
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="pt-4 border-t border-gray-200 dark:border-candle-orange/20">
        <h4 className="font-semibold text-candle-dark dark:text-white mb-3 font-ai">Quick Actions</h4>
        <div className="flex gap-2">
          <button
            onClick={() => {
              Object.keys(traits).forEach((trait) => {
                onTraitChange(trait as TraitCategory, 'default')
              })
            }}
            className="px-4 py-2 bg-gray-100 dark:bg-candle-dark text-gray-700 dark:text-candle-light rounded-lg hover:bg-gray-200 dark:hover:bg-candle-dark/80 transition-all duration-200 border border-gray-200 dark:border-candle-orange/20 font-ai"
          >
            Reset to Default
          </button>
          <button
            onClick={() => {
              onTraitChange('head', 'orange')
              onTraitChange('shirt', 'orange')
              onTraitChange('eyes', 'default')
              onTraitChange('glasses', 'none')
              onTraitChange('background', 'default')
              onTraitChange('accessories', 'none')
            }}
            className="px-4 py-2 bg-gradient-to-r from-candle-orange to-candle-orange-light text-white rounded-lg hover:from-candle-orange-light hover:to-candle-orange-lighter transition-all duration-200 shadow-candle-glow hover:shadow-orange-glow font-ai"
          >
            Candle TV Theme
          </button>
        </div>
      </div>
    </div>
  )
}