'use client'

import { useState } from 'react'
import { MascotData } from '@/types/mascot'
import { Download, Trash2, Eye } from 'lucide-react'

interface SavedMascotsProps {
  savedMascots: MascotData[]
  onLoadMascot: (mascot: MascotData) => void
  onDeleteMascot: (id: string) => void
}

export default function SavedMascots({ savedMascots, onLoadMascot, onDeleteMascot }: SavedMascotsProps) {
  const [selectedMascot, setSelectedMascot] = useState<MascotData | null>(null)

  const downloadMascot = (mascot: MascotData) => {
    // Create a simple SVG representation for download
    const svgContent = `
      <svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="200" fill="white"/>
        <circle cx="100" cy="100" r="75" fill="#FFE4D6" stroke="#FF6B35" stroke-width="2"/>
        <circle cx="90" cy="85" r="8" fill="#2C1810"/>
        <circle cx="110" cy="85" r="8" fill="#2C1810"/>
        <rect x="70" y="110" width="60" height="40" fill="#FF6B35" stroke="#2C1810" stroke-width="1" rx="5"/>
        <text x="100" y="180" text-anchor="middle" fill="#2C1810" font-size="12" font-weight="bold">${mascot.name}</text>
      </svg>
    `
    
    const blob = new Blob([svgContent], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${mascot.name || 'mascot'}.svg`
    link.click()
    URL.revokeObjectURL(url)
  }

  if (savedMascots.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 mb-4">
          <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-600 mb-2 font-ai">No Saved Mascots</h3>
        <p className="text-gray-500">Create and save your first mascot to see it here!</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-candle-dark font-ai">Saved Mascots</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {savedMascots.map((mascot) => (
          <div
            key={mascot.id}
            className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-candle-orange transition-colors"
          >
            {/* Mascot Preview */}
            <div className="flex justify-center mb-3">
              <div className="w-24 h-24 bg-candle-light rounded-full flex items-center justify-center border-2 border-candle-orange">
                <span className="text-candle-orange font-bold text-lg font-ai">
                  {mascot.name.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
            
            {/* Mascot Info */}
            <div className="text-center mb-4">
              <h4 className="font-semibold text-candle-dark mb-1 font-ai">
                {mascot.name || 'Unnamed Mascot'}
              </h4>
              <p className="text-sm text-gray-600">
                Created {mascot.id ? new Date(parseInt(mascot.id)).toLocaleDateString() : 'Recently'}
              </p>
            </div>
            
            {/* Actions */}
            <div className="flex justify-center space-x-2">
              <button
                onClick={() => onLoadMascot(mascot)}
                className="flex items-center space-x-1 px-3 py-1 bg-candle-orange text-white rounded text-sm hover:bg-candle-accent transition-colors font-ai"
                title="Load Mascot"
              >
                <Eye size={14} />
                <span>Load</span>
              </button>
              
              <button
                onClick={() => downloadMascot(mascot)}
                className="flex items-center space-x-1 px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-colors font-ai"
                title="Download Mascot"
              >
                <Download size={14} />
                <span>Save</span>
              </button>
              
              <button
                onClick={() => onDeleteMascot(mascot.id!)}
                className="flex items-center space-x-1 px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors font-ai"
                title="Delete Mascot"
              >
                <Trash2 size={14} />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Bulk Actions */}
      {savedMascots.length > 1 && (
        <div className="pt-4 border-t border-gray-200">
          <h4 className="font-semibold text-candle-dark mb-3 font-ai">Bulk Actions</h4>
          <div className="flex gap-2">
            <button
              onClick={() => {
                savedMascots.forEach(mascot => downloadMascot(mascot))
              }}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-ai"
            >
              Download All
            </button>
            <button
              onClick={() => {
                if (confirm('Are you sure you want to delete all saved mascots?')) {
                  savedMascots.forEach(mascot => onDeleteMascot(mascot.id!))
                }
              }}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-ai"
            >
              Delete All
            </button>
          </div>
        </div>
      )}
    </div>
  )
} 