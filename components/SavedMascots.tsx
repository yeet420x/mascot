'use client'

import { useState, useEffect } from 'react'
import { MascotData } from '@/types/mascot'
import { Trash2, Eye, RefreshCw, X } from 'lucide-react'

interface SavedMascotsProps {
  onLoadMascot: (mascot: MascotData) => void
  onDeleteMascot?: (id: string) => void
}

export default function SavedMascots({ onLoadMascot, onDeleteMascot }: SavedMascotsProps) {
  const [mascots, setMascots] = useState<MascotData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedMascot, setSelectedMascot] = useState<MascotData | null>(null)
  const [zoomedMascot, setZoomedMascot] = useState<MascotData | null>(null)


  const fetchMascots = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Fetch mascots from Shadow Drive only
      const response = await fetch('/api/get-shadow-drive-mascots')
      
      if (!response.ok) {
        throw new Error(`Failed to fetch mascots: ${response.status} ${response.statusText}`)
      }
      
      const data = await response.json()
      if (data.success) {
        setMascots(data.mascots)
      } else {
        throw new Error(data.error || 'Failed to fetch mascots from Shadow Drive')
      }
    } catch (err) {
      console.error('Error fetching mascots:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch mascots from Shadow Drive')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMascots()
  }, [])

  const zoomMascot = (mascot: MascotData) => {
    setZoomedMascot(mascot)
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-candle-orange mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Loading mascots...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 mb-4">
          <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-red-600 mb-2 font-ai">Error Loading Mascots</h3>
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={fetchMascots}
          className="px-4 py-2 bg-candle-orange text-white rounded-lg hover:bg-candle-accent transition-colors font-ai"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (mascots.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 mb-4">
          <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-600 mb-2 font-ai">No Mascots Found</h3>
        <p className="text-gray-500 mb-4">No mascots have been generated yet. Create your first mascot to see it here!</p>
        <div className="space-y-2">
          <p className="text-xs text-gray-400">If you just uploaded a mascot, try refreshing the gallery.</p>
          <button
            onClick={fetchMascots}
            className="px-4 py-2 bg-candle-orange text-white rounded-lg hover:bg-candle-accent transition-colors text-sm font-ai"
          >
            <RefreshCw size={14} className="inline mr-2" />
            Check Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-candle-dark font-ai">Shadow Drive Mascot Gallery</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={fetchMascots}
            className="flex items-center space-x-2 px-4 py-2 bg-candle-orange text-white rounded-lg hover:bg-candle-accent transition-colors font-ai"
            title="Refresh Mascots"
          >
            <RefreshCw size={18} />
            <span>Refresh Gallery</span>
          </button>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {mascots.length > 0 ? `${mascots.length} mascots found` : 'No mascots yet'}
          </span>
        </div>
      </div>
      
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <p className="text-blue-700 dark:text-blue-300 text-sm text-center">
          🖼️ This gallery shows all mascots stored on Shadow Drive for viewing purposes only. 
          <br />
          <span className="font-semibold">Mascots cannot be regenerated or minted as new NFTs.</span>
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mascots.map((mascot) => (
          <div
            key={mascot.id}
            className="bg-white dark:bg-candle-dark border-2 border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-candle-orange transition-colors"
          >
            {/* Mascot Preview */}
            <div className="flex justify-center mb-3">
              {mascot.imageUrl ? (
                <img
                  src={mascot.imageUrl}
                  alt={mascot.name || 'Mascot'}
                  className="w-24 h-24 rounded-full object-cover border-2 border-candle-orange"
                />
              ) : (
                <div className="w-24 h-24 bg-candle-light dark:bg-candle-orange/20 rounded-full flex items-center justify-center border-2 border-candle-orange">
                  <span className="text-candle-orange font-bold text-lg font-ai">
                    {mascot.name?.charAt(0).toUpperCase() || 'M'}
                  </span>
                </div>
              )}
            </div>
            
            {/* Mascot Info */}
            <div className="text-center mb-4">
              <h4 className="font-semibold text-candle-dark dark:text-white mb-1 font-ai">
                {mascot.name || 'Unnamed Mascot'}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Created {mascot.createdAt ? new Date(mascot.createdAt).toLocaleDateString() : 'Recently'}
              </p>
              {mascot.description && (
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 line-clamp-2">
                  {mascot.description}
                </p>
              )}
              {mascot.fileUrl && (
                <p className="text-xs text-blue-500 dark:text-blue-400 mt-1">
                  📁 Shadow Drive
                </p>
              )}
            </div>
            
            {/* Actions */}
            <div className="flex justify-center space-x-2">
              {mascot.imageUrl && (
                <button
                  onClick={() => zoomMascot(mascot)}
                  className="flex items-center space-x-1 px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors font-ai"
                  title="View Full Size"
                >
                  <Eye size={14} />
                  <span>View</span>
                </button>
              )}
              
              {onDeleteMascot && (
                <button
                  onClick={() => onDeleteMascot(mascot.id!)}
                  className="flex items-center space-x-1 px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors font-ai"
                  title="Delete Mascot"
                >
                  <Trash2 size={14} />
                  <span>Delete</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Bulk Actions */}
      {mascots.length > 1 && onDeleteMascot && (
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <h4 className="font-semibold text-candle-dark dark:text-white mb-3 font-ai">Bulk Actions</h4>
          <div className="flex gap-2">
            <button
              onClick={() => {
                if (confirm('Are you sure you want to delete all mascots? This action cannot be undone.')) {
                  mascots.forEach(mascot => onDeleteMascot(mascot.id!))
                }
              }}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-ai"
            >
              Delete All
            </button>
          </div>
        </div>
      )}
      
      {/* Zoom Modal */}
      {zoomedMascot && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-candle-dark rounded-2xl max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-2xl font-bold text-candle-dark dark:text-white font-ai">
                {zoomedMascot.name || 'Mascot'}
              </h3>
              <button
                onClick={() => setZoomedMascot(null)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                title="Close"
              >
                <X size={24} className="text-gray-600 dark:text-gray-400" />
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="p-6">
              {zoomedMascot.imageUrl ? (
                <div className="flex flex-col items-center space-y-4">
                  <img
                    src={zoomedMascot.imageUrl}
                    alt={zoomedMascot.name || 'Mascot'}
                    className="max-w-full max-h-[60vh] object-contain rounded-xl border-2 border-candle-orange/30"
                  />
                  {zoomedMascot.description && (
                    <p className="text-gray-600 dark:text-gray-400 text-center max-w-2xl">
                      {zoomedMascot.description}
                    </p>
                  )}
                  {zoomedMascot.traits && Array.isArray(zoomedMascot.traits) && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                      {zoomedMascot.traits.map((trait: any, index: number) => (
                        <div key={index} className="bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded-lg">
                          <span className="font-semibold text-candle-orange">{trait.trait_type}:</span>
                          <span className="ml-2 text-gray-700 dark:text-gray-300">{trait.value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-32 h-32 bg-candle-light dark:bg-candle-orange/20 rounded-full flex items-center justify-center border-2 border-candle-orange mx-auto mb-4">
                    <span className="text-candle-orange font-bold text-4xl font-ai">
                      {zoomedMascot.name?.charAt(0).toUpperCase() || 'M'}
                    </span>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400">No image available for this mascot</p>
                </div>
              )}
            </div>
            
            {/* Modal Footer */}
            <div className="flex justify-center p-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-gray-500 dark:text-gray-400 text-sm text-center">
                This mascot has already been generated and stored. 
                <br />
                <span className="text-candle-orange font-semibold">View only - no regeneration allowed.</span>
              </p>
            </div>
          </div>
        </div>
      )}
      

    </div>
  )
} 