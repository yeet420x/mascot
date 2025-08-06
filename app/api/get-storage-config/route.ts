import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Return storage configuration without exposing sensitive keys
    const storageConfig = {
      nftStorageKey: process.env.NFT_STORAGE_KEY ? 'configured' : 'not-configured',
      shadowDriveAccount: process.env.SHDW_STORAGE_ACCOUNT || process.env.NEXT_PUBLIC_SHDW_STORAGE_ACCOUNT || null,
      hasStorage: !!(process.env.NFT_STORAGE_KEY || process.env.SHDW_STORAGE_ACCOUNT || process.env.NEXT_PUBLIC_SHDW_STORAGE_ACCOUNT)
    }
    
    return NextResponse.json(storageConfig)
  } catch (error) {
    console.error('Error getting storage config:', error)
    return NextResponse.json(
      { error: 'Failed to get storage configuration' },
      { status: 500 }
    )
  }
} 