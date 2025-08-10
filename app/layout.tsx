import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import { DynamicWalletProvider } from '../components/DynamicWalletProvider'

const metropolis = localFont({
  src: './fonts/Metropolis-Black.otf',
  variable: '--font-metropolis',
  display: 'swap',
})

const rollingBeat = localFont({
  src: './fonts/Rolling Beat.ttf',
  variable: '--font-rolling-beat',
  display: 'swap',
})

const wastedVindey = localFont({
  src: './fonts/Wasted-Vindey.ttf',
  variable: '--font-wasted-vindey',
  display: 'swap',
})

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
      <body className={`${metropolis.variable} ${rollingBeat.variable} ${wastedVindey.variable}`}>
        <DynamicWalletProvider>
          <div className="min-h-screen transition-all duration-300">
            {children}
          </div>
        </DynamicWalletProvider>
      </body>
    </html>
  )
} 