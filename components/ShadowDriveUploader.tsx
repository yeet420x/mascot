'use client'

import { useWallet } from '@solana/wallet-adapter-react'
import { useConnection } from '@solana/wallet-adapter-react'
import { Connection, PublicKey } from '@solana/web3.js'
import { useEffect, useState } from 'react'

interface ShadowDriveUploaderProps {
  imageUrl: string
  fileName: string
  onUploadComplete: (uploadedUrl: string) => void
  onUploadError: (error: string) => void
}

// Your real storage account address
const STORAGE_ACCOUNT_ADDRESS = 'WW5T5VEbE4GSc5Rcimo4nA9voAr7pSwqy4VswEUqWh4'

export default function ShadowDriveUploader({ 
  imageUrl, 
  fileName, 
  onUploadComplete, 
  onUploadError 
}: ShadowDriveUploaderProps) {
  const { publicKey, signTransaction } = useWallet()
  const { connection } = useConnection()
  const [isLoading, setIsLoading] = useState(false)

  const uploadToShadowDrive = async () => {
    try {
      setIsLoading(true)
      console.log('🚀 Starting ShadowDrive upload via API...')
      
      if (!publicKey) {
        throw new Error('Wallet not connected')
      }

      console.log('📤 Calling ShadowDrive upload API...')
      console.log('📁 File name:', fileName)
      console.log('🏦 Storage account:', STORAGE_ACCOUNT_ADDRESS)
      
      // Call our API endpoint for ShadowDrive upload
      const response = await fetch('/api/upload-to-shadow-drive', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl,
          name: fileName.replace('.png', ''), // Remove extension for name
          walletAddress: publicKey.toString(),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Upload failed with status ${response.status}`)
      }

      const result = await response.json()
      
      if (result.success) {
        console.log('✅ ShadowDrive upload successful:', result)
        console.log('📁 File uploaded to:', result.imageUrl)
        onUploadComplete(result.imageUrl)
      } else {
        throw new Error(result.error || 'Upload failed')
      }
      
    } catch (error) {
      console.error('❌ ShadowDrive upload error:', error)
      onUploadError(error instanceof Error ? error.message : 'Upload failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <h4 className="font-semibold text-blue-800 mb-2">🔒 ShadowDrive Upload</h4>
      
      {!publicKey ? (
        <p className="text-blue-700 text-sm mb-3">
          Please connect your wallet to upload to ShadowDrive
        </p>
      ) : (
        <>
          <p className="text-blue-700 text-sm mb-3">
            Ready to upload to ShadowDrive storage
          </p>
          <p className="text-blue-600 text-xs mb-3">
            Storage Account: {STORAGE_ACCOUNT_ADDRESS}
          </p>
          <button
            onClick={uploadToShadowDrive}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Uploading...' : 'Upload to ShadowDrive'}
          </button>
        </>
      )}
    </div>
  )
} 