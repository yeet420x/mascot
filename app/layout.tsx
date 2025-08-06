import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { DynamicWalletProvider } from '../components/DynamicWalletProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Candle TV Mascot Creator',
  description: 'Create and customize your own Candle TV mascot with AI-powered generation',
  keywords: 'mascot, customization, AI, Candle TV, NFT',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <DynamicWalletProvider>
          <div className="min-h-screen bg-gradient-to-br from-candle-light via-white to-candle-orange">
            {children}
          </div>
        </DynamicWalletProvider>
      </body>
    </html>
  )
} 