'use client'

import { useState } from 'react'
import { TraitCategory, MascotTraits } from '@/types/mascot'

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
      { id: 'orange', name: 'Orange', color: '#FF6B35' },
      { id: 'blue', name: 'Blue', color: '#3B82F6' },
      { id: 'green', name: 'Green', color: '#10B981' },
      { id: 'red', name: 'Red', color: '#EF4444' },
    ]
  },
  {
    category: 'eyes' as TraitCategory,
    label: 'Eye Color',
    options: [
      { id: 'default', name: 'Default', color: '#000000' },
      { id: 'brown', name: 'Brown', color: '#8B4513' },
      { id: 'blue', name: 'Blue', color: '#3B82F6' },
      { id: 'green', name: 'Green', color: '#10B981' },
      { id: 'hazel', name: 'Hazel', color: '#CD853F' },
    ]
  },
  {
    category: 'glasses' as TraitCategory,
    label: 'Glasses',
    options: [
      { id: 'none', name: 'None', color: 'transparent' },
      { id: 'round', name: 'Round', color: '#6B7280' },
      { id: 'square', name: 'Square', color: '#374151' },
      { id: 'aviator', name: 'Aviator', color: '#1F2937' },
      { id: 'sunglasses', name: 'Sunglasses', color: '#111827' },
    ]
  },
  {
    category: 'shirt' as TraitCategory,
    label: 'Shirt Color',
    options: [
      { id: 'default', name: 'Default', color: '#F5F5DC' },
      { id: 'orange', name: 'Orange', color: '#FF6B35' },
      { id: 'blue', name: 'Blue', color: '#3B82F6' },
      { id: 'green', name: 'Green', color: '#10B981' },
      { id: 'red', name: 'Red', color: '#EF4444' },
    ]
  },
  {
    category: 'pants' as TraitCategory,
    label: 'Pants Color',
    options: [
      { id: 'default', name: 'Default', color: '#F5F5DC' },
      { id: 'blue', name: 'Blue', color: '#3B82F6' },
      { id: 'black', name: 'Black', color: '#000000' },
      { id: 'brown', name: 'Brown', color: '#8B4513' },
      { id: 'gray', name: 'Gray', color: '#6B7280' },
    ]
  },
  {
    category: 'shoes' as TraitCategory,
    label: 'Shoe Color',
    options: [
      { id: 'default', name: 'Default', color: '#F5F5DC' },
      { id: 'black', name: 'Black', color: '#000000' },
      { id: 'brown', name: 'Brown', color: '#8B4513' },
      { id: 'white', name: 'White', color: '#FFFFFF' },
      { id: 'red', name: 'Red', color: '#EF4444' },
    ]
  },
  {
    category: 'accessories' as TraitCategory,
    label: 'Accessories',
    options: [
      { id: 'none', name: 'None', color: 'transparent' },
      { id: 'hat', name: 'Hat', color: '#FF6B35' },
      { id: 'crown', name: 'Crown', color: '#F59E0B' },
      { id: 'bowtie', name: 'Bow Tie', color: '#EF4444' },
      { id: 'necklace', name: 'Necklace', color: '#8B5CF6' },
    ]
  }
]

export default function TraitSelector({ traits, onTraitChange }: TraitSelectorProps) {
  const [activeCategory, setActiveCategory] = useState<TraitCategory>('head')

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
              onTraitChange('pants', 'default')
              onTraitChange('shoes', 'default')
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