'use client'

import { Twitter, BarChart3, ExternalLink } from 'lucide-react'
import WalletConnect from './WalletConnect'

export default function Header() {
  return (
    <header className="bg-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-candle-orange rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">C</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-candle-dark">Candle TV</h1>
              <p className="text-sm text-gray-600">Mascot Creator</p>
            </div>
          </div>

          {/* Social Links and Wallet */}
          <div className="flex items-center space-x-4">
            <a
              href="https://twitter.com/candletv"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-4 py-2 bg-candle-orange text-white rounded-lg hover:bg-candle-accent transition-colors trait-button"
            >
              <Twitter size={20} />
              <span>X</span>
            </a>
            
            <a
              href="https://chart.candle.tv"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-4 py-2 bg-candle-dark text-white rounded-lg hover:bg-gray-800 transition-colors trait-button"
            >
              <BarChart3 size={20} />
              <span>Chart</span>
            </a>
            
            <a
              href="https://etherscan.io/address/0x1234567890123456789012345678901234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors trait-button"
            >
              <ExternalLink size={20} />
              <span>Contract</span>
            </a>

            {/* Wallet Connect Button */}
            <WalletConnect />
          </div>
        </div>
      </div>
    </header>
  )
} 