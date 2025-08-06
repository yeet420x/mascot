'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import AIImageGenerator from '@/components/AIImageGenerator'
import SavedMascots from '@/components/SavedMascots'
import BalanceDisplay from '@/components/BalanceDisplay'
import { MascotData } from '@/types/mascot'

export default function Home() {
  const [savedMascots, setSavedMascots] = useState<MascotData[]>([])
  const [activeTab, setActiveTab] = useState<'ai-image' | 'saved'>('ai-image')

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - AI Image Generator (Main Content) */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 candle-shadow">
              <AIImageGenerator
                onMascotGenerated={(imageUrl, traits) => {
                  console.log('Generated AI mascot:', imageUrl, traits)
                }}
              />
            </div>
          </div>

          {/* Right Panel - Controls */}
          <div className="space-y-6">
            {/* Tab Navigation */}
            <div className="bg-white rounded-2xl p-4 candle-shadow">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveTab('ai-image')}
                  className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-colors ${
                    activeTab === 'ai-image'
                      ? 'bg-candle-orange text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  AI Image Gen
                </button>
                <button
                  onClick={() => setActiveTab('saved')}
                  className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-colors ${
                    activeTab === 'saved'
                      ? 'bg-candle-orange text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Saved
                </button>
              </div>
            </div>

                         {/* Tab Content */}
             <div className="bg-white rounded-2xl p-6 candle-shadow">
               {activeTab === 'ai-image' && (
                 <div className="space-y-4">
                   <BalanceDisplay />
                   <div className="text-center text-gray-600">
                     <p>AI Image Generator is now the main content area.</p>
                     <p className="text-sm mt-2">Use the controls on the left to generate your mascot.</p>
                   </div>
                 </div>
               )}
               
               {activeTab === 'saved' && (
                 <SavedMascots
                   savedMascots={savedMascots}
                   onLoadMascot={() => {}}
                   onDeleteMascot={(id) => setSavedMascots(prev => prev.filter(m => m.id !== id))}
                 />
               )}
             </div>
          </div>
        </div>
      </main>
    </div>
  )
} 