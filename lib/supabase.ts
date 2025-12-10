import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Log a warning if keys are missing
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "WARNING: Supabase keys are missing in .env.local. The client will not function correctly."
  )
}

// Create the client with a fallback to prevent "Invalid URL" crashes
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
)