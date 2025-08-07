import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Use a more reliable fallback RPC URL
    const rpcUrl = process.env.QUICKNODE_RPC || 
                   process.env.NEXT_PUBLIC_QUICKNODE_RPC || 
                   'https://ssc-dao.genesysgo.net' // GenesysGo is recommended for Shadow Drive
    
    return NextResponse.json({
      rpcUrl,
      network: rpcUrl.includes('devnet') ? 'devnet' : 'mainnet-beta',
      source: process.env.QUICKNODE_RPC ? 'quicknode' : 
              process.env.NEXT_PUBLIC_QUICKNODE_RPC ? 'quicknode-public' : 'fallback'
    })
  } catch (error) {
    console.error('Error getting RPC URL:', error)
    return NextResponse.json(
      { error: 'Failed to get RPC URL' },
      { status: 500 }
    )
  }
} 