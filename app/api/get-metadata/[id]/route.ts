import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    console.log('📝 Retrieving metadata for ID:', id)
    
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