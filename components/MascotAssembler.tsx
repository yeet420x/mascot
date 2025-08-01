'use client'

import { useState, useRef } from 'react'
import { Sparkles, Loader2, Download, Image as ImageIcon, Upload, Scissors, Eye } from 'lucide-react'

interface MascotAssemblerProps {
  onMascotAssembled?: (imageUrl: string, analysis: string) => void
}

export default function MascotAssembler({ onMascotAssembled }: MascotAssemblerProps) {
  const [headImage, setHeadImage] = useState<string | null>(null)
  const [bodyImage, setBodyImage] = useState<string | null>(null)
  const [additionalDescription, setAdditionalDescription] = useState('')
  const [accessories, setAccessories] = useState('')
  const [isAssembling, setIsAssembling] = useState(false)
  const [error, setError] = useState('')
  const [assembledImage, setAssembledImage] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<string | null>(null)
  
  const headFileRef = useRef<HTMLInputElement>(null)
  const bodyFileRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'head' | 'body') => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        if (type === 'head') {
          setHeadImage(result)
        } else {
          setBodyImage(result)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const assembleMascot = async () => {
    if (!headImage || !bodyImage) {
      setError('Please upload both head and body images')
      return
    }

    setIsAssembling(true)
    setError('')
    setAssembledImage(null)
    setAnalysis(null)

    try {
      const response = await fetch('/api/assemble-mascot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          headImage,
          bodyImage,
          additionalDescription: additionalDescription.trim(),
          accessories: accessories.trim()
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to assemble mascot')
      }

      const data = await response.json()
      
      if (data.imageUrl) {
        setAssembledImage(data.imageUrl)
        setAnalysis(data.analysis)
        onMascotAssembled?.(data.imageUrl, data.analysis)
      } else {
        setError('Failed to assemble mascot. Please try again.')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while assembling the mascot.')
      console.error('Error assembling mascot:', err)
    } finally {
      setIsAssembling(false)
    }
  }

  const downloadImage = async () => {
    if (!assembledImage) return

    try {
      const response = await fetch(assembledImage)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `assembled-mascot-${Date.now()}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading image:', error)
      setError('Failed to download image')
    }
  }

  const removeImage = (type: 'head' | 'body') => {
    if (type === 'head') {
      setHeadImage(null)
      if (headFileRef.current) headFileRef.current.value = ''
    } else {
      setBodyImage(null)
      if (bodyFileRef.current) bodyFileRef.current.value = ''
    }
  }

  const accessoryOptions = [
    'Hat', 'Glasses', 'Bowtie', 'Necklace', 'Crown', 'Sunglasses', 'Scarf', 'Tie'
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Scissors className="text-candle-orange" size={24} />
        <h3 className="text-xl font-bold text-candle-dark">Mascot Assembler</h3>
      </div>

      {/* Image Upload Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Head Image Upload */}
        <div className="space-y-4">
          <h4 className="font-semibold text-candle-dark">Upload Head Image:</h4>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              ref={headFileRef}
              type="file"
              accept="image/*"
              onChange={(e) => handleFileUpload(e, 'head')}
              className="hidden"
            />
            {!headImage ? (
              <button
                onClick={() => headFileRef.current?.click()}
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-candle-orange text-white rounded-lg hover:bg-candle-accent transition-colors"
              >
                <Upload size={20} />
                <span>Upload Head</span>
              </button>
            ) : (
              <div className="space-y-3">
                <img
                  src={headImage}
                  alt="Head"
                  className="max-w-xs mx-auto rounded-lg border-2 border-candle-orange"
                />
                <button
                  onClick={() => removeImage('head')}
                  className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors"
                >
                  Remove Head
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Body Image Upload */}
        <div className="space-y-4">
          <h4 className="font-semibold text-candle-dark">Upload Body Image:</h4>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              ref={bodyFileRef}
              type="file"
              accept="image/*"
              onChange={(e) => handleFileUpload(e, 'body')}
              className="hidden"
            />
            {!bodyImage ? (
              <button
                onClick={() => bodyFileRef.current?.click()}
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-candle-orange text-white rounded-lg hover:bg-candle-accent transition-colors"
              >
                <Upload size={20} />
                <span>Upload Body</span>
              </button>
            ) : (
              <div className="space-y-3">
                <img
                  src={bodyImage}
                  alt="Body"
                  className="max-w-xs mx-auto rounded-lg border-2 border-candle-orange"
                />
                <button
                  onClick={() => removeImage('body')}
                  className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors"
                >
                  Remove Body
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Additional Options */}
      <div className="space-y-4">
        <h4 className="font-semibold text-candle-dark">Additional Options:</h4>
        
        {/* Accessories */}
        <div>
          <label className="block text-sm font-medium text-candle-dark mb-2">
            Accessories to Add:
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {accessoryOptions.map((accessory) => (
              <label key={accessory} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={accessories.includes(accessory)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setAccessories(prev => prev ? `${prev}, ${accessory}` : accessory)
                    } else {
                      setAccessories(prev => prev.replace(new RegExp(`(^|, )${accessory}(, |$)`), '').replace(/^, |, $/g, ''))
                    }
                  }}
                  className="text-candle-orange"
                />
                <span className="text-sm">{accessory}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Additional Description */}
        <div>
          <label className="block text-sm font-medium text-candle-dark mb-2">
            Additional Description:
          </label>
          <textarea
            value={additionalDescription}
            onChange={(e) => setAdditionalDescription(e.target.value)}
            placeholder="Describe any additional requirements or modifications..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-candle-orange focus:border-transparent resize-none"
            rows={3}
            disabled={isAssembling}
          />
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Assemble Button */}
      <button
        onClick={assembleMascot}
        disabled={isAssembling || !headImage || !bodyImage}
        className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-candle-orange text-white rounded-lg hover:bg-candle-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed trait-button"
      >
        {isAssembling ? (
          <>
            <Loader2 className="animate-spin" size={20} />
            <span>Assembling Mascot...</span>
          </>
        ) : (
          <>
            <Scissors size={20} />
            <span>Assemble Mascot</span>
          </>
        )}
      </button>

      {/* Assembled Result */}
      {assembledImage && (
        <div className="space-y-4">
          <h4 className="font-semibold text-candle-dark">Assembled Mascot:</h4>
          <div className="relative">
            <img
              src={assembledImage}
              alt="Assembled mascot"
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
          
          {analysis && (
            <div className="bg-candle-light p-4 rounded-lg">
              <h5 className="font-semibold text-candle-dark mb-2 flex items-center">
                <Eye size={16} className="mr-2" />
                GPT-4V Assembly Analysis:
              </h5>
              <p className="text-sm text-candle-dark">{analysis}</p>
            </div>
          )}
        </div>
      )}

      {/* Tips */}
      <div className="p-4 bg-candle-light rounded-lg">
        <h4 className="font-semibold text-candle-dark mb-2">💡 Assembly Tips:</h4>
        <ul className="text-sm text-candle-dark space-y-1">
          <li>• Upload clear, high-quality head and body images</li>
          <li>• Ensure the head and body styles are compatible</li>
          <li>• Use similar art styles for better results</li>
          <li>• Add accessories to enhance the final mascot</li>
          <li>• GPT-4V will analyze and suggest improvements</li>
          <li>• The AI will maintain Candle TV branding automatically</li>
        </ul>
      </div>
    </div>
  )
} 