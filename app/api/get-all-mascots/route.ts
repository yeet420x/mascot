import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
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
    
    // Fetch all mascots from the database
    const { data: mascots, error } = await supabase
      .from('nft_metadata')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('❌ Supabase error:', error)
      throw new Error(`Failed to fetch mascots: ${error.message}`)
    }
    
    console.log(`✅ Successfully fetched ${mascots?.length || 0} mascots from Supabase`)
    
    // Transform the data to match the expected MascotData format
    const transformedMascots = mascots?.map(mascot => ({
      id: mascot.id,
      name: mascot.name,
      traits: mascot.metadata?.traits || {},
      imageUrl: mascot.metadata?.image || null,
      description: mascot.metadata?.description || '',
      createdAt: mascot.created_at,
      metadata: mascot.metadata
    })) || []
    
    return NextResponse.json({
      success: true,
      mascots: transformedMascots,
      count: transformedMascots.length
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })
    
  } catch (error) {
    console.error('Error fetching mascots:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
