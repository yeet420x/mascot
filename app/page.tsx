'use client'

import { useState } from 'react'
import Header from '../components/Header'
import AIImageGenerator from '../components/AIImageGenerator'
import BalanceDisplay from '../components/BalanceDisplay'

export default function Home() {
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = () => {
    setIsGenerating(true)
    setTimeout(() => setIsGenerating(false), 2000) // Simulate generation
    
    // Scroll to the Create Your Mascot section
    const mascotSection = document.getElementById('create-mascot-section')
    if (mascotSection) {
      mascotSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <main className="min-h-screen transition-all duration-300">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-16 px-6 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-candle-light via-candle-peach to-candle-orange-lighter dark:from-candle-dark dark:via-candle-dark dark:to-candle-dark opacity-50" />
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-candle-orange/20 rounded-full blur-xl animate-pulse" />
        <div className="absolute top-40 right-20 w-32 h-32 bg-candle-orange-light/20 rounded-full blur-xl animate-pulse delay-1000" />
        <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-candle-orange-lighter/20 rounded-full blur-xl animate-pulse delay-500" />
        
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 logo-text">
            Candle TV
          </h1>
          <p className="text-2xl md:text-3xl text-candle-orange-light dark:text-candle-orange-lighter font-fancy mb-8 animate-candle-flicker">
            Mascot Creator
          </p>
          <p className="text-lg md:text-xl text-candle-dark dark:text-candle-light mb-12 max-w-2xl mx-auto leading-relaxed">
            Create, customize, and mint your own unique Candle TV mascot using cutting-edge AI technology. 
            Design the perfect companion for your trading journey.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              onClick={handleGenerate}
              className="px-8 py-4 bg-gradient-to-r from-candle-orange via-candle-orange-light to-candle-orange-lighter text-white font-bold text-lg rounded-xl shadow-candle-glow hover:shadow-orange-glow transition-all duration-300 hover:scale-105 transform"
            >
              Start Creating
            </button>
            <button className="px-8 py-4 bg-white dark:bg-candle-dark text-candle-orange border-2 border-candle-orange font-bold text-lg rounded-xl hover:bg-candle-orange hover:text-white transition-all duration-300 hover:scale-105 transform">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Balance Display */}
      <div className="max-w-6xl mx-auto px-6 mb-8">
        <BalanceDisplay />
      </div>

      {/* Main Generator */}
      <div id="create-mascot-section">
        <AIImageGenerator onGenerate={handleGenerate} />
      </div>
      
      {/* Footer */}
      <footer className="bg-white dark:bg-candle-dark border-t border-candle-orange/20 mt-16 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-candle-dark dark:text-candle-light font-fancy">
            © 2024 Candle TV. Crafted with ❤️ and AI magic.
          </p>
        </div>
      </footer>
    </main>
  )
} 