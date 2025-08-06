import { createClient } from '@supabase/supabase-js'

// Create a function to get the Supabase client dynamically (server-side only)
export const getSupabaseClient = () => {
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase environment variables are not configured')
  }

  return createClient(supabaseUrl, supabaseAnonKey)
}

// Export a function to check if Supabase is configured
export const isSupabaseConfigured = () => {
  return !!(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY)
} 