import type { AuthError, Session, User } from '@supabase/supabase-js'

import { supabase } from '@/lib/supabase'

export type AuthResult<T = undefined> = {
  data: T
  error: AuthError | null
}

export async function signUpWithEmail(email: string, password: string, displayName: string): Promise<AuthResult> {
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: displayName,
      },
    },
  })

  return { data: undefined, error }
}

export async function signInWithEmail(email: string, password: string): Promise<AuthResult<Session | null>> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  return { data: data.session, error }
}

export async function signInWithGoogle(): Promise<AuthResult> {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  })

  return { data: undefined, error }
}

export async function requestPasswordReset(email: string): Promise<AuthResult> {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  })

  return { data: undefined, error }
}

export async function updatePassword(password: string): Promise<AuthResult> {
  const { error } = await supabase.auth.updateUser({ password })

  return { data: undefined, error }
}

export async function signOut(): Promise<AuthResult> {
  const { error } = await supabase.auth.signOut()
  return { data: undefined, error }
}

export async function getCurrentUser(): Promise<{ user: User | null; error: AuthError | null }> {
  const { data, error } = await supabase.auth.getUser()
  return { user: data.user, error }
}
