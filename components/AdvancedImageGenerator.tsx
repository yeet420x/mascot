'use client'

import { useState, useRef } from 'react'
import { Sparkles, Loader2, Download, Image as ImageIcon, Upload, Eye } from 'lucide-react'

interface AdvancedImageGeneratorProps {
  onImageGenerated?: (imageUrl: string, description: string, analysis?: string) => void
}

export default function AdvancedImageGenerator({ onImageGenerated }: AdvancedImageGeneratorProps) {
  const [description, setDescription] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState('')
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<string | null>(null)
  const [referenceImage, setReferenceImage] = useState<string | null>(null)
  const [useGPT4V, setUseGPT4V] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setReferenceImage(result)
        setUseGPT4V(true)
      }
      reader.readAsDataURL(file)
    }
  }

  const generateImage = async () => {
    if (!description.trim()) {
      setError('Please enter a description')
      return
    }

    setIsGenerating(true)
    setError('')
    setGeneratedImage(null)
    setAnalysis(null)

    try {
      const endpoint = useGPT4V ? '/api/generate-image-gpt4v' : '/api/generate-image'
      const payload = useGPT4V 
        ? { description: description.trim(), referenceImage }
        : { description: description.trim() }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate image')
      }

      const data = await response.json()
      
      if (data.imageUrl) {
        setGeneratedImage(data.imageUrl)
        setAnalysis(data.analysis || null)
        onImageGenerated?.(data.imageUrl, data.description, data.analysis)
        setDescription('')
      } else {
        setError('Failed to generate image. Please try again.')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while generating the image.')
      console.error('Error generating image:', err)
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
      link.download = `candle-mascot-${Date.now()}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading image:', error)
      setError('Failed to download image')
    }
  }

  const removeReferenceImage = () => {
    setReferenceImage(null)
    setUseGPT4V(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const examplePrompts = [
    "A cute orange mascot with black eyes, wearing a blue shirt and black pants",
    "A friendly cartoon character with glasses, orange hat, and a bowtie",
    "A mascot with green eyes, purple shirt, and a crown accessory",
    "A character with round glasses, red shirt, and white shoes",
    "A cute mascot with sunglasses, yellow shirt, and a necklace"
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <ImageIcon className="text-candle-orange" size={24} />
        <h3 className="text-xl font-bold text-candle-dark">Advanced AI Image Generator</h3>
      </div>

      {/* Mode Selection */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold text-candle-dark mb-3">Generation Mode:</h4>
        <div className="space-y-3">
          <label className="flex items-center space-x-3">
            <input
              type="radio"
              name="mode"
              checked={!useGPT4V}
              onChange={() => setUseGPT4V(false)}
              className="text-candle-orange"
            />
            <div>
              <div className="font-medium">DALL-E 3 Only</div>
              <div className="text-sm text-gray-600">Direct image generation from text ($0.040 per image)</div>
            </div>
          </label>
          <label className="flex items-center space-x-3">
            <input
              type="radio"
              name="mode"
              checked={useGPT4V}
              onChange={() => setUseGPT4V(true)}
              className="text-candle-orange"
            />
            <div>
              <div className="font-medium">GPT-4V + DALL-E 3</div>
              <div className="text-sm text-gray-600">Analyze reference image + generate improved version (More cost-effective)</div>
            </div>
          </label>
        </div>
      </div>

      {/* Reference Image Upload */}
      {useGPT4V && (
        <div className="space-y-4">
          <h4 className="font-semibold text-candle-dark">Upload Reference Image (Optional):</h4>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            {!referenceImage ? (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-candle-orange text-white rounded-lg hover:bg-candle-accent transition-colors"
              >
                <Upload size={20} />
                <span>Upload Reference Image</span>
              </button>
            ) : (
              <div className="space-y-3">
                <img
                  src={referenceImage}
                  alt="Reference"
                  className="max-w-xs mx-auto rounded-lg border-2 border-candle-orange"
                />
                <button
                  onClick={removeReferenceImage}
                  className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors"
                >
                  Remove Image
                </button>
              </div>
            )}
            <p className="text-sm text-gray-600 mt-2">
              Upload a mascot image for GPT-4V to analyze and improve upon
            </p>
          </div>
        </div>
      )}

      {/* Description Input */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-candle-dark mb-2">
            Describe your ideal mascot:
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your mascot in detail... (e.g., 'A cute orange mascot with black eyes, wearing a blue shirt')"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-candle-orange focus:border-transparent resize-none"
            rows={4}
            disabled={isGenerating}
          />
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <button
          onClick={generateImage}
          disabled={isGenerating || !description.trim()}
          className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-candle-orange text-white rounded-lg hover:bg-candle-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed trait-button"
        >
          {isGenerating ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              <span>Generating Image...</span>
            </>
          ) : (
            <>
              <Sparkles size={20} />
              <span>Generate Image</span>
            </>
          )}
        </button>
      </div>

      {/* Generated Image and Analysis */}
      {generatedImage && (
        <div className="space-y-4">
          <h4 className="font-semibold text-candle-dark">Generated Image:</h4>
          <div className="relative">
            <img
              src={generatedImage}
              alt="Generated mascot"
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
                GPT-4V Analysis:
              </h5>
              <p className="text-sm text-candle-dark">{analysis}</p>
            </div>
          )}
        </div>
      )}

      {/* Example Prompts */}
      <div className="space-y-3">
        <h4 className="font-semibold text-candle-dark">Example Prompts:</h4>
        <div className="space-y-2">
          {examplePrompts.map((prompt, index) => (
            <button
              key={index}
              onClick={() => setDescription(prompt)}
              className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-candle-dark transition-colors"
            >
              "{prompt}"
            </button>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="p-4 bg-candle-light rounded-lg">
        <h4 className="font-semibold text-candle-dark mb-2">💡 Tips for better results:</h4>
        <ul className="text-sm text-candle-dark space-y-1">
          <li>• <strong>DALL-E 3 Only</strong>: Be specific about colors, clothing, and accessories</li>
          <li>• <strong>GPT-4V Mode</strong>: Upload a reference image for better analysis and results</li>
          <li>• Mention "cute" or "friendly" for better character style</li>
          <li>• Include details about eyes, glasses, clothing items</li>
          <li>• Keep descriptions clear and concise</li>
          <li>• GPT-4V mode is more cost-effective for analysis + generation</li>
        </ul>
      </div>
    </div>
  )
} 