import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { useAuth } from '@/features/auth/auth-context'
import { profileSchema, type ProfileValues } from '@/features/auth/auth-schema'
import { supabase } from '@/lib/supabase'

export function ProfilePage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { displayName: '', defaultCurrency: 'INR', timezone: 'Asia/Kolkata' },
  })

  useEffect(() => {
    if (!user) return
    let active = true

    void supabase
      .from('profiles')
      .select('display_name, default_currency, timezone')
      .eq('id', user.id)
      .single()
      .then(({ data, error: profileError }) => {
        if (!active) return
        if (profileError) {
          setError(profileError.message)
        }
        if (data) {
          form.reset({
            displayName: data.display_name ?? user.user_metadata?.name ?? user.user_metadata?.full_name ?? '',
            defaultCurrency: data.default_currency,
            timezone: data.timezone,
          })
        }
        setLoading(false)
      })

    return () => {
      active = false
    }
  }, [form, user])

  async function onSubmit(values: ProfileValues) {
    if (!user) return
    setSaving(true)
    setError(null)
    setMessage(null)

    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        display_name: values.displayName,
        default_currency: values.defaultCurrency,
        timezone: values.timezone,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)

    if (profileError) setError(profileError.message)
    else setMessage('Profile updated.')
    setSaving(false)
  }

  if (loading) {
    return <section className="mx-auto max-w-2xl"><p className="text-sm text-muted-foreground">Loading profile…</p></section>
  }

  return (
    <section className="mx-auto max-w-2xl space-y-6">
      <div>
        <p className="text-sm font-medium text-primary">Profile</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Your account</h1>
        <p className="mt-2 text-muted-foreground">Personalize SplitSmart. Your login email remains managed by authentication.</p>
      </div>
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <form className="space-y-5" onSubmit={(event) => void form.handleSubmit(onSubmit)(event)}>
          <div>
            <label className="text-sm font-medium" htmlFor="profile-email">Email</label>
            <input className="mt-1 w-full rounded-md border bg-muted px-3 py-2 text-sm" id="profile-email" value={user?.email ?? ''} disabled />
          </div>
          <div>
            <label className="text-sm font-medium" htmlFor="profile-name">Display name</label>
            <input className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm" id="profile-name" {...form.register('displayName')} />
            {form.formState.errors.displayName?.message ? <p className="mt-1 text-sm text-destructive">{form.formState.errors.displayName.message}</p> : null}
          </div>
          <div>
            <label className="text-sm font-medium" htmlFor="profile-currency">Default currency</label>
            <input className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm uppercase" id="profile-currency" maxLength={3} {...form.register('defaultCurrency')} />
            {form.formState.errors.defaultCurrency?.message ? <p className="mt-1 text-sm text-destructive">{form.formState.errors.defaultCurrency.message}</p> : null}
          </div>
          <div>
            <label className="text-sm font-medium" htmlFor="profile-timezone">Timezone</label>
            <input className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm" id="profile-timezone" {...form.register('timezone')} />
            {form.formState.errors.timezone?.message ? <p className="mt-1 text-sm text-destructive">{form.formState.errors.timezone.message}</p> : null}
          </div>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          {message ? <p className="text-sm text-emerald-600">{message}</p> : null}
          <Button disabled={saving} type="submit">{saving ? 'Saving…' : 'Save profile'}</Button>
        </form>
      </div>
    </section>
  )
}
