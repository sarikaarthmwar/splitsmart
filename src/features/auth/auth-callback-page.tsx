import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { supabase } from '@/lib/supabase'

export function AuthCallbackPage() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    async function finishOAuth() {
      const params = new URLSearchParams(window.location.search)
      const code = params.get('code')
      const authError = params.get('error_description') ?? params.get('error')

      if (authError) {
        if (active) setError(authError)
        return
      }

      if (code) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
        if (exchangeError) {
          if (active) setError(exchangeError.message)
          return
        }
      }

      const { data } = await supabase.auth.getSession()
      if (!active) return

      if (data.session) {
        navigate('/', { replace: true })
      } else {
        setError('We could not establish your session. Please try signing in again.')
      }
    }

    void finishOAuth()

    return () => {
      active = false
    }
  }, [navigate])

  if (error) {
    return (
      <div className="grid min-h-screen place-items-center bg-muted/40 px-4">
        <div className="w-full max-w-md rounded-2xl border bg-background p-6 text-center shadow-sm">
          <h1 className="text-xl font-semibold">Sign-in could not be completed</h1>
          <p className="mt-2 text-sm text-muted-foreground">{error}</p>
          <a className="mt-5 inline-block text-sm text-primary hover:underline" href="/login">
            Return to sign in
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="grid min-h-screen place-items-center bg-muted/40 px-4">
      <div className="text-center">
        <p className="text-sm text-muted-foreground">Completing sign-in…</p>
      </div>
    </div>
  )
}
