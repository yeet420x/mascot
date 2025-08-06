'use client'

import { FC, ReactNode } from 'react'
import dynamic from 'next/dynamic'

// Dynamically import the wallet provider to prevent hydration issues
const SimpleWalletProvider = dynamic(
  () => import('./SimpleWalletProvider').then(mod => ({ default: mod.SimpleWalletProvider })),
  { 
    ssr: false,
    loading: () => <div>Loading wallet...</div>
  }
)

interface Props {
  children: ReactNode
}

export const DynamicWalletProvider: FC<Props> = ({ children }) => {
  return <SimpleWalletProvider>{children}</SimpleWalletProvider>
} 