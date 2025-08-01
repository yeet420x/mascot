'use client'

import { useState } from 'react'
import { MascotTraits, TraitCategory } from '@/types/mascot'

interface TraitSelectorProps {
  traits: MascotTraits
  onTraitChange: (category: TraitCategory, value: string) => void
}

const traitCategories = [
  {
    category: 'head' as TraitCategory,
    label: 'Head Color',
    options: [
      { id: 'default', name: 'Default', color: '#FF6B35' },
      { id: 'orange', name: 'Orange', color: '#FF6B35' },
      { id: 'blue', name: 'Blue', color: '#3B82F6' },
      { id: 'green', name: 'Green', color: '#10B981' },
      { id: 'red', name: 'Red', color: '#EF4444' },
      { id: 'purple', name: 'Purple', color: '#8B5CF6' },
      { id: 'yellow', name: 'Yellow', color: '#F59E0B' },
      { id: 'pink', name: 'Pink', color: '#EC4899' },
      { id: 'gray', name: 'Gray', color: '#6B7280' },
      { id: 'black', name: 'Black', color: '#1F2937' },
    ]
  },
  {
    category: 'eyes' as TraitCategory,
    label: 'Eye Color',
    options: [
      { id: 'default', name: 'Default', color: '#2C1810' },
      { id: 'blue', name: 'Blue', color: '#3B82F6' },
      { id: 'green', name: 'Green', color: '#10B981' },
      { id: 'brown', name: 'Brown', color: '#8B4513' },
      { id: 'gray', name: 'Gray', color: '#6B7280' },
      { id: 'black', name: 'Black', color: '#1F2937' },
    ]
  },
  {
    category: 'glasses' as TraitCategory,
    label: 'Glasses',
    options: [
      { id: 'none', name: 'None', color: 'transparent' },
      { id: 'round', name: 'Round', color: '#2C1810' },
      { id: 'square', name: 'Square', color: '#2C1810' },
      { id: 'sunglasses', name: 'Sunglasses', color: '#1F2937' },
    ]
  },
  {
    category: 'shirt' as TraitCategory,
    label: 'Shirt Color',
    options: [
      { id: 'default', name: 'Default', color: '#FF6B35' },
      { id: 'orange', name: 'Orange', color: '#FF6B35' },
      { id: 'blue', name: 'Blue', color: '#3B82F6' },
      { id: 'green', name: 'Green', color: '#10B981' },
      { id: 'red', name: 'Red', color: '#EF4444' },
      { id: 'purple', name: 'Purple', color: '#8B5CF6' },
      { id: 'yellow', name: 'Yellow', color: '#F59E0B' },
      { id: 'pink', name: 'Pink', color: '#EC4899' },
      { id: 'gray', name: 'Gray', color: '#6B7280' },
      { id: 'black', name: 'Black', color: '#1F2937' },
      { id: 'white', name: 'White', color: '#FFFFFF' },
    ]
  },
  {
    category: 'pants' as TraitCategory,
    label: 'Pants Color',
    options: [
      { id: 'default', name: 'Default', color: '#2C1810' },
      { id: 'blue', name: 'Blue', color: '#3B82F6' },
      { id: 'black', name: 'Black', color: '#1F2937' },
      { id: 'gray', name: 'Gray', color: '#6B7280' },
      { id: 'brown', name: 'Brown', color: '#8B4513' },
      { id: 'green', name: 'Green', color: '#10B981' },
      { id: 'red', name: 'Red', color: '#EF4444' },
    ]
  },
  {
    category: 'shoes' as TraitCategory,
    label: 'Shoes Color',
    options: [
      { id: 'default', name: 'Default', color: '#1F2937' },
      { id: 'black', name: 'Black', color: '#1F2937' },
      { id: 'brown', name: 'Brown', color: '#8B4513' },
      { id: 'white', name: 'White', color: '#FFFFFF' },
      { id: 'red', name: 'Red', color: '#EF4444' },
      { id: 'blue', name: 'Blue', color: '#3B82F6' },
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
      <h3 className="text-xl font-bold text-candle-dark mb-4">Customize Your Mascot</h3>
      
      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {traitCategories.map((category) => (
          <button
            key={category.category}
            onClick={() => setActiveCategory(category.category)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeCategory === category.category
                ? 'bg-candle-orange text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Options for selected category */}
      <div className="space-y-4">
        <h4 className="font-semibold text-candle-dark">
          {traitCategories.find(c => c.category === activeCategory)?.label}
        </h4>
        
        <div className="grid grid-cols-3 gap-3">
          {traitCategories
            .find(c => c.category === activeCategory)
            ?.options.map((option) => (
              <button
                key={option.id}
                onClick={() => onTraitChange(activeCategory, option.id)}
                className={`p-3 rounded-lg border-2 transition-all trait-button ${
                  traits[activeCategory] === option.id
                    ? 'border-candle-orange bg-candle-light'
                    : 'border-gray-200 hover:border-candle-accent'
                }`}
              >
                <div className="flex flex-col items-center space-y-2">
                  <div
                    className="w-8 h-8 rounded-full border-2 border-gray-300"
                    style={{ backgroundColor: option.color }}
                  />
                  <span className="text-sm font-medium text-candle-dark">
                    {option.name}
                  </span>
                </div>
              </button>
            ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="pt-4 border-t border-gray-200">
        <h4 className="font-semibold text-candle-dark mb-3">Quick Actions</h4>
        <div className="flex gap-2">
          <button
            onClick={() => {
              Object.keys(traits).forEach((trait) => {
                onTraitChange(trait as TraitCategory, 'default')
              })
            }}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
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
            className="px-4 py-2 bg-candle-orange text-white rounded-lg hover:bg-candle-accent transition-colors"
          >
            Candle TV Theme
          </button>
        </div>
      </div>
    </div>
  )
} 