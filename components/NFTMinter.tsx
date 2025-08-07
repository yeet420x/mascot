import { useWallet } from '@solana/wallet-adapter-react'
import { useConnection } from '@solana/wallet-adapter-react'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters'
import { createSignerFromKeypair } from '@metaplex-foundation/umi'
import { generateSigner } from '@metaplex-foundation/umi'
import { createNft } from '@metaplex-foundation/mpl-token-metadata'
import { publicKey, percentAmount } from '@metaplex-foundation/umi'
import { base58 } from '@metaplex-foundation/umi/serializers'
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata'
import { useState } from 'react'

interface NFTMinterProps {
  imageUrl: string
  description?: string
}

export default function NFTMinter({ imageUrl, description = 'AI-Generated Candle TV Mascot' }: NFTMinterProps) {
  const { publicKey: walletPubkey, signTransaction } = useWallet()
  const { connection } = useConnection()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null)
  const [uploadedMetadataUrl, setUploadedMetadataUrl] = useState<string | null>(null)
  const [mintAddress, setMintAddress] = useState<string | null>(null)
  const [txSignature, setTxSignature] = useState<string | null>(null)
  const [status, setStatus] = useState<string>('')

  // Handle Shadow Drive upload with retries
  const uploadToShadowDrive = async () => {
    const maxRetries = 3
    let attempt = 0

    while (attempt < maxRetries) {
      try {
        setStatus(`Uploading to Shadow Drive${attempt > 0 ? ` (Attempt ${attempt + 1}/${maxRetries})` : ''}...`)
        
        const response = await fetch('/api/upload-to-shadow-drive', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            imageUrl,
            description,
            name: `mascot-${Date.now()}`,
            walletAddress: walletPubkey?.toString(),
          }),
        })

        const result = await response.json()

        if (!response.ok) {
          // Handle specific error cases
          const errorMessage = result.details || result.error || `Upload failed with status ${response.status}`
          
          if (response.status === 400) {
            throw new Error(`Storage validation failed: ${errorMessage}`)
          } else if (response.status === 401) {
            throw new Error('Unauthorized: Please check your wallet connection')
          } else if (response.status === 500) {
            // Retry on server errors
            throw new Error(`Server error: ${errorMessage}`)
          }
          
          throw new Error(errorMessage)
        }

        if (result.success) {
          console.log('✅ Shadow Drive upload successful:', result)
          setUploadedImageUrl(result.imageUri)
          setUploadedMetadataUrl(result.metadataUri)
          return result.metadataUri
        } else {
          throw new Error(result.error || 'Upload failed')
        }
        
      } catch (error) {
        console.error(`❌ Shadow Drive upload error (Attempt ${attempt + 1}/${maxRetries}):`, error)
        
        // Check if we should retry
        if (attempt < maxRetries - 1 && (
          error instanceof Error && (
            error.message.includes('Server error') ||
            error.message.includes('network') ||
            error.message.includes('timeout')
          )
        )) {
          attempt++
          // Exponential backoff
          await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt)))
          continue
        }
        
        // If we're out of retries or it's not a retryable error, throw
        throw new Error(
          error instanceof Error 
            ? `Upload failed: ${error.message}`
            : 'Upload failed: Unknown error'
        )
      }
    }
  }

  const mintNFT = async () => {
    if (!walletPubkey || !signTransaction) {
      setError('Wallet not connected')
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      // Step 1: Upload to Shadow Drive
      setStatus('Uploading to Shadow Drive...')
      const metadataUri = await uploadToShadowDrive()

      // Step 2: Create NFT
      setStatus('Creating NFT...')
      
      // Get QuickNode RPC URL
      const rpcResponse = await fetch('/api/get-rpc-url', {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (!rpcResponse.ok) {
        throw new Error('Failed to get RPC URL')
      }
      const { rpcUrl } = await rpcResponse.json()
      console.log('🔗 Using RPC URL:', rpcUrl)

      // Create UMI instance with QuickNode RPC
      const umi = createUmi(rpcUrl)
        .use(mplTokenMetadata()) // Register token metadata program
        .use(walletAdapterIdentity({
          publicKey: walletPubkey,
          signTransaction,
          signMessage: async (message) => {
            throw new Error('Message signing not supported')
          }
        }))

      // Generate a new mint
      const mint = generateSigner(umi)
      
      // Create the NFT
      const tx = createNft(umi, {
        mint,
        name: 'Candle TV Mascot',
        uri: metadataUri,
        sellerFeeBasisPoints: percentAmount(5, 2), // 5%
      })

      // Sign and send the transaction
      setStatus('Confirming transaction...')
      const result = await tx.sendAndConfirm(umi)
      
      // Store mint address and transaction signature
      const mintAddressStr = mint.publicKey.toString()
      const txSignatureStr = result.signature.toString()
      
      setMintAddress(mintAddressStr)
      setTxSignature(txSignatureStr)
      
      console.log('✅ NFT minted successfully!')
      console.log('🔍 Transaction:', txSignatureStr)
      console.log('🎯 Mint Address:', mintAddressStr)
      setStatus('NFT minted successfully!')

    } catch (error) {
      console.error('❌ Error in NFT creation process:', error)
      setError(error instanceof Error ? error.message : 'Failed to create NFT')
      setStatus('')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="p-4 bg-white rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">🎨 NFT Minter</h3>

        {/* Main Action Button */}
        <button
          onClick={mintNFT}
          disabled={isLoading || !walletPubkey}
          className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
        >
          {isLoading ? status || 'Processing...' : 'Create NFT'}
        </button>

        {/* Status Messages */}
        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        
        {mintAddress && txSignature && (
          <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg">
            <div className="flex items-center">
              <span className="text-lg mr-2">✨</span>
              <span className="font-semibold">NFT Minted Successfully!</span>
            </div>
            
            <div className="mt-3 space-y-2">
              <div className="text-sm">
                <span className="font-medium">NFT: </span>
                <a 
                  href={`https://solscan.io/token/${mintAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline break-all"
                >
                  View on Solscan
                </a>
              </div>

              <div className="text-sm">
                <span className="font-medium">Transaction: </span>
                <a 
                  href={`https://solscan.io/tx/${txSignature}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline break-all"
                >
                  View on Solscan
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}