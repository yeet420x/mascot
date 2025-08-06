import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { metadata, name } = await request.json()
    
    console.log('📝 Storing metadata in Supabase...')
    console.log('Name:', name)
    console.log('Metadata:', metadata)
    
    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      console.log('❌ Supabase not configured')
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      )
    }
    
    // Get Supabase client dynamically
    const supabase = getSupabaseClient()
    
    // Create a unique ID for the metadata
    const metadataId = `${name}-${Date.now()}`
    
    // Store the metadata in Supabase
    const { data, error } = await supabase
      .from('nft_metadata')
      .insert([
        {
          id: metadataId,
          name: name,
          metadata: metadata,
          created_at: new Date().toISOString()
        }
      ])
      .select()
    
    if (error) {
      console.error('❌ Supabase error:', error)
      throw new Error(`Failed to store metadata: ${error.message}`)
    }
    
    // Create a URL that points to our metadata endpoint
    // Use a public domain for production, fallback to localhost for development
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
      (process.env.NODE_ENV === 'production' 
        ? 'https://your-domain.com' 
        : 'http://localhost:3000')
    const metadataUrl = `${baseUrl}/api/get-metadata/${metadataId}`
    
    console.log('✅ Metadata stored successfully in Supabase')
    console.log('📁 Metadata URL:', metadataUrl)
    console.log('📁 Metadata URL length:', metadataUrl.length)
    
    return NextResponse.json({
      success: true,
      message: 'Metadata stored successfully in Supabase',
      metadataUrl,
      metadataId
    })
    
  } catch (error) {
    console.error('Error storing metadata:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const metadataId = searchParams.get('id')
    
    if (!metadataId) {
      return NextResponse.json({ error: 'Metadata ID required' }, { status: 400 })
    }
    
    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      console.log('❌ Supabase not configured')
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      )
    }
    
    // Get Supabase client dynamically
    const supabase = getSupabaseClient()
    
    // Retrieve metadata from Supabase
    const { data, error } = await supabase
      .from('nft_metadata')
      .select('metadata')
      .eq('id', metadataId)
      .single()
    
    if (error || !data) {
      console.log('❌ Metadata not found for ID:', metadataId)
      return NextResponse.json({ error: 'Metadata not found' }, { status: 404 })
    }
    
    console.log('✅ Metadata retrieved successfully from Supabase')
    
    return NextResponse.json(data.metadata, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
    
  } catch (error) {
    console.error('Error retrieving metadata:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 