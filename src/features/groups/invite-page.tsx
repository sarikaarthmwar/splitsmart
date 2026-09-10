import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { supabase } from '@/lib/supabase'

export function InvitePage() {
  const { token } = useParams<{ token: string }>()
  const navigate = useNavigate()
  const [invite, setInvite] = useState<{ group_id: string; group_name: string; invited_email: string; inviter_name: string; status: string; expires_at: string | null } | null>(null)
  const [loading, setLoading] = useState(true)
  const [joining, setJoining] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      if (!token) { setMessage('Invalid invitation link.'); setLoading(false); return }
      const { data, error } = await supabase.rpc('get_group_invitation', { p_token: token })
      if (error || !data?.[0]) setMessage(error?.message || 'This invitation is invalid or has expired.')
      else setInvite(data[0])
      setLoading(false)
    }
    void load()
  }, [token])

  async function joinGroup() {
    if (!token) return
    setJoining(true)
    setMessage(null)
    const { data: sessionData } = await supabase.auth.getSession()
    if (!sessionData.session) {
      const next = `/invite/${encodeURIComponent(token)}`
      const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`
      const { error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo } })
      if (error) { setMessage(error.message); setJoining(false) }
      return
    }
    const { data, error } = await supabase.rpc('accept_group_invitation', { p_token: token })
    if (error) setMessage(error.message)
    else navigate(`/groups/${data}`, { replace: true })
    setJoining(false)
  }

  if (loading) return <div className="grid min-h-screen place-items-center bg-muted/40"><p className="text-sm text-muted-foreground">Loading invitation…</p></div>

  return (
    <div className="grid min-h-screen place-items-center bg-muted/40 px-4">
      <div className="w-full max-w-md rounded-2xl border bg-background p-7 text-center shadow-sm">
        <div className="mx-auto grid size-12 place-items-center rounded-full bg-primary/10 text-xl">👥</div>
        {invite ? (
          <>
            <h1 className="mt-4 text-2xl font-semibold">You're invited!</h1>
            <p className="mt-2 text-muted-foreground"><strong>{invite.inviter_name}</strong> invited you to join <strong>{invite.group_name}</strong> on SplitSmart.</p>
            <p className="mt-3 text-xs text-muted-foreground">Invitation sent to {invite.invited_email}</p>
            {invite.status !== 'pending' ? <p className="mt-5 text-sm">This invitation is already {invite.status}.</p> : (
              <button disabled={joining} onClick={joinGroup} className="mt-6 w-full rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground disabled:opacity-50">
                {joining ? 'Joining…' : 'Join group'}
              </button>
            )}
          </>
        ) : <><h1 className="text-xl font-semibold">Invitation unavailable</h1><p className="mt-2 text-sm text-destructive">{message}</p></>}
        {message && invite && <p className="mt-4 text-sm text-destructive">{message}</p>}
        <button onClick={() => navigate('/')} className="mt-5 text-sm text-muted-foreground hover:underline">Go to SplitSmart</button>
      </div>
    </div>
  )
}
