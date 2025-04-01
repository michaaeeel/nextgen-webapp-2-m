
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_KEY

// Regular client for normal operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Admin client for privileged operations
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})
