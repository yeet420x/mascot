'use client'

import { useState, useRef, useEffect } from 'react'
import { HexColorPicker } from 'react-colorful'

interface ColorWheelProps {
  color: string
  onChange: (color: string) => void
  label?: string
}

export default function ColorWheel({ color, onChange, label }: ColorWheelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const popover = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popover.current && !popover.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative">
      <div className="flex items-center space-x-2">
        <button
          className="w-10 h-10 rounded-full border-2 border-gray-300 dark:border-candle-orange/30 cursor-pointer"
          style={{ backgroundColor: color }}
          onClick={() => setIsOpen(true)}
        />
        {label && (
          <span className="text-sm font-medium text-candle-dark dark:text-candle-light font-ai">
            {label}
          </span>
        )}
      </div>

      {isOpen && (
        <div
          ref={popover}
          className="absolute z-50 top-12 bg-white dark:bg-candle-dark rounded-lg shadow-lg p-3 border border-gray-200 dark:border-candle-orange/20"
        >
          <HexColorPicker color={color} onChange={onChange} />
        </div>
      )}
    </div>
  )
}
