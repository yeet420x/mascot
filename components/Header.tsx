'use client'

import { BarChart3, ExternalLink } from 'lucide-react'
import WalletConnect from './WalletConnect'
import DarkModeToggle from './DarkModeToggle'
import xLogo from '../app/images/X.svg'

export default function Header() {
  return (
    <header className="bg-white dark:bg-candle-dark shadow-lg dark:shadow-dark-elegant transition-all duration-300">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Enhanced Logo and Title */}
          <div className="flex items-center space-x-4">
            {/* Fancy Logo with enhanced styling */}
            <div className="relative w-16 h-16 bg-gradient-to-br from-candle-orange via-candle-orange-light to-candle-orange-lighter rounded-2xl flex items-center justify-center shadow-candle-glow hover:shadow-orange-glow transition-all duration-300 hover:scale-105 group">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-candle-orange/20 to-candle-orange-light/20 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Logo letter with fancy font */}
              <span className="relative z-10 text-white font-display text-3xl font-bold tracking-wider animate-logo-float">
                C
              </span>
              
              {/* Subtle border glow */}
              <div className="absolute inset-0 rounded-2xl border-2 border-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            
            {/* Enhanced Title with fancy fonts */}
            <div className="space-y-1">
              <h1 className="text-3xl font-bold logo-text">
                Candle TV
              </h1>
              <p className="text-sm font-fancy text-candle-orange-light dark:text-candle-orange-lighter animate-candle-flicker">
                Mascot Creator
              </p>
            </div>
          </div>

          {/* Social Links, Dark Mode Toggle, and Wallet */}
          <div className="flex items-center space-x-4">
            {/* Dark Mode Toggle */}
            <DarkModeToggle />
            
            {/* Enhanced Social Links */}
            <a
              href="https://twitter.com/candletv"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-candle-orange to-candle-orange-light text-white rounded-lg hover:from-candle-orange-light hover:to-candle-orange-lighter transition-all duration-300 trait-button group"
            >
              <img 
                src={xLogo.src} 
                alt="X (Twitter)" 
                width={20} 
                height={20} 
                className="group-hover:scale-110 transition-transform duration-200"
              />
              <span className="font-medium">X</span>
            </a>
            
            <a
              href="https://chart.candle.tv"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-candle-dark to-gray-800 dark:from-gray-700 dark:to-gray-800 text-white rounded-lg hover:from-gray-800 hover:to-gray-900 dark:hover:from-gray-600 dark:hover:to-gray-700 transition-all duration-300 trait-button group"
            >
              <BarChart3 size={20} className="group-hover:scale-110 transition-transform duration-200" />
              <span className="font-medium">Chart</span>
            </a>
            
            <a
              href="https://etherscan.io/address/0x1234567890123456789012345678901234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-candle-bronze to-candle-copper text-white rounded-lg hover:from-candle-copper hover:to-candle-amber transition-all duration-300 trait-button group"
            >
              <ExternalLink size={20} className="group-hover:scale-110 transition-transform duration-200" />
              <span className="font-medium">Contract</span>
            </a>

            {/* Wallet Connect Button */}
            <WalletConnect />
          </div>
        </div>
      </div>
    </header>
  )
} 