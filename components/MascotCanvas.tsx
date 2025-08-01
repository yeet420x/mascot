'use client'

import { useRef, useEffect } from 'react'
import { MascotData } from '@/types/mascot'
import { Download } from 'lucide-react'

interface MascotCanvasProps {
  mascotData: MascotData
}

export default function MascotCanvas({ mascotData }: MascotCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null)

  const downloadMascot = () => {
    if (canvasRef.current) {
      // Create a canvas element to capture the SVG
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const svgElement = canvasRef.current.querySelector('svg')
      
      if (svgElement && ctx) {
        const svgData = new XMLSerializer().serializeToString(svgElement)
        const img = new Image()
        
        img.onload = () => {
          canvas.width = 400
          canvas.height = 400
          ctx.fillStyle = 'white'
          ctx.fillRect(0, 0, 400, 400)
          ctx.drawImage(img, 0, 0, 400, 400)
          
          // Download the image
          const link = document.createElement('a')
          link.download = `${mascotData.name || 'candle-mascot'}.png`
          link.href = canvas.toDataURL()
          link.click()
        }
        
        img.src = 'data:image/svg+xml;base64,' + btoa(svgData)
      }
    }
  }

  const getTraitColor = (trait: string) => {
    const colors: { [key: string]: string } = {
      'orange': '#FF6B35',
      'blue': '#3B82F6',
      'green': '#10B981',
      'red': '#EF4444',
      'purple': '#8B5CF6',
      'yellow': '#F59E0B',
      'pink': '#EC4899',
      'gray': '#6B7280',
      'black': '#1F2937',
      'white': '#FFFFFF'
    }
    return colors[trait] || '#FF6B35'
  }

  const renderTrait = (traitType: string, traitValue: string) => {
    switch (traitType) {
      case 'head':
        return (
          <circle
            cx="200"
            cy="120"
            r="60"
            fill={getTraitColor(traitValue)}
            stroke="#2C1810"
            strokeWidth="3"
          />
        )
      case 'eyes':
        const eyeColor = traitValue === 'default' ? '#2C1810' : getTraitColor(traitValue)
        return (
          <>
            <circle cx="180" cy="110" r="8" fill={eyeColor} />
            <circle cx="220" cy="110" r="8" fill={eyeColor} />
          </>
        )
      case 'glasses':
        if (traitValue === 'none') return null
        return (
          <g stroke="#2C1810" strokeWidth="3" fill="none">
            <circle cx="180" cy="110" r="15" />
            <circle cx="220" cy="110" r="15" />
            <line x1="195" y1="110" x2="205" y2="110" />
          </g>
        )
      case 'shirt':
        return (
          <rect
            x="140"
            y="180"
            width="120"
            height="80"
            fill={getTraitColor(traitValue)}
            stroke="#2C1810"
            strokeWidth="2"
            rx="10"
          />
        )
      case 'pants':
        return (
          <rect
            x="150"
            y="260"
            width="100"
            height="60"
            fill={getTraitColor(traitValue)}
            stroke="#2C1810"
            strokeWidth="2"
            rx="5"
          />
        )
      case 'shoes':
        return (
          <>
            <ellipse cx="170" cy="340" rx="25" ry="15" fill={getTraitColor(traitValue)} stroke="#2C1810" strokeWidth="2" />
            <ellipse cx="230" cy="340" rx="25" ry="15" fill={getTraitColor(traitValue)} stroke="#2C1810" strokeWidth="2" />
          </>
        )
      case 'accessories':
        if (traitValue === 'none') return null
        return (
          <circle
            cx="200"
            cy="100"
            r="8"
            fill={getTraitColor(traitValue)}
            stroke="#2C1810"
            strokeWidth="2"
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="flex flex-col items-center">
      <div ref={canvasRef} className="relative">
        <svg width="400" height="400" viewBox="0 0 400 400" className="mascot-canvas">
          {/* Background */}
          <rect width="400" height="400" fill="white" />
          
          {/* Candle TV Logo Base */}
          <circle cx="200" cy="200" r="150" fill="#FFE4D6" stroke="#FF6B35" strokeWidth="5" />
          
          {/* Render all traits */}
          {Object.entries(mascotData.traits).map(([traitType, traitValue]) => (
            <g key={traitType}>
              {renderTrait(traitType, traitValue)}
            </g>
          ))}
          
          {/* Name display */}
          {mascotData.name && (
            <text
              x="200"
              y="380"
              textAnchor="middle"
              fill="#2C1810"
              fontSize="16"
              fontWeight="bold"
            >
              {mascotData.name}
            </text>
          )}
        </svg>
      </div>
      
      <button
        onClick={downloadMascot}
        className="mt-4 flex items-center space-x-2 px-6 py-3 bg-candle-orange text-white rounded-lg font-semibold hover:bg-candle-accent transition-colors trait-button"
      >
        <Download size={20} />
        <span>Download Mascot</span>
      </button>
    </div>
  )
} 