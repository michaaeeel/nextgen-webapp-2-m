
import { supabase, supabaseAdmin } from './client'

// Auth helper functions
export const signUp = async ({ email, password, ...metadata }) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
    },
  })
  if (error) throw error
  return data
}

export const signIn = async ({ email, password }) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  if (error) throw error
  return data
}

export const signOut = async () => {
  console.log("Signing out...")
  const { error } = await supabase.auth.signOut()
  if (error) {
    console.error("Sign out error:", error)
    throw error
  }
  return true
}

export const resetPassword = async (email) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  })
  if (error) throw error
}
