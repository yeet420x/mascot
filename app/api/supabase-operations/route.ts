import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { operation, data } = await request.json()
    
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
    
    switch (operation) {
      case 'store-metadata':
        const { metadata, name } = data
        console.log('📝 Storing metadata in Supabase...')
        
        // Create a unique ID for the metadata
        const metadataId = `${name}-${Date.now()}`
        
        // Store the metadata in Supabase
        const { data: insertData, error: insertError } = await supabase
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
        
        if (insertError) {
          console.error('❌ Supabase error:', insertError)
          throw new Error(`Failed to store metadata: ${insertError.message}`)
        }
        
        // Create a URL that points to our metadata endpoint
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
          (process.env.NODE_ENV === 'production' 
            ? 'https://your-domain.com' 
            : 'http://localhost:3000')
        const metadataUrl = `${baseUrl}/api/get-metadata/${metadataId}`
        
        console.log('✅ Metadata stored successfully in Supabase')
        
        return NextResponse.json({
          success: true,
          message: 'Metadata stored successfully in Supabase',
          metadataUrl,
          metadataId
        })
        
      case 'get-metadata':
        const { id } = data
        console.log('📝 Retrieving metadata for ID:', id)
        
        // Retrieve metadata from Supabase
        const { data: retrieveData, error: retrieveError } = await supabase
          .from('nft_metadata')
          .select('metadata')
          .eq('id', id)
          .single()
        
        if (retrieveError || !retrieveData) {
          console.log('❌ Metadata not found for ID:', id)
          return NextResponse.json({ error: 'Metadata not found' }, { status: 404 })
        }
        
        console.log('✅ Metadata retrieved successfully from Supabase')
        
        return NextResponse.json(retrieveData.metadata, {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        })
        
      default:
        return NextResponse.json(
          { error: 'Invalid operation' },
          { status: 400 }
        )
    }
    
  } catch (error) {
    console.error('Error in Supabase operation:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
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
      .eq('id', id)
      .single()
    
    if (error || !data) {
      console.log('❌ Metadata not found for ID:', id)
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