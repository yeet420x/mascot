import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Only return the RPC URL if it's configured
    const rpcUrl = process.env.QUICKNODE_RPC || process.env.NEXT_PUBLIC_QUICKNODE_RPC || 'https://api.mainnet-beta.solana.com'
    
    return NextResponse.json({
      rpcUrl,
      network: rpcUrl.includes('devnet') ? 'devnet' : 'mainnet-beta'
    })
  } catch (error) {
    console.error('Error getting RPC URL:', error)
    return NextResponse.json(
      { error: 'Failed to get RPC URL' },
      { status: 500 }
    )
  }
} 