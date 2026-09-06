import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import {
  forgotPasswordSchema,
  loginSchema,
  resetPasswordSchema,
  signupSchema,
  type ForgotPasswordValues,
  type LoginValues,
  type ResetPasswordValues,
  type SignupValues,
} from '@/features/auth/auth-schema'
import { useAuth } from '@/features/auth/auth-context'
import { requestPasswordReset, signInWithEmail, signInWithGoogle, signUpWithEmail, updatePassword } from '@/lib/auth'
import { supabase } from '@/lib/supabase'

function AuthLayout({ children, title, description }: { children: React.ReactNode; title: string; description: string }) {
  return (
    <div className="min-h-screen bg-muted/40 px-4 py-12">
      <div className="mx-auto w-full max-w-md rounded-2xl border bg-background p-6 shadow-sm sm:p-8">
        <div className="mb-8 text-center">
          <Link className="text-lg font-semibold tracking-tight" to="/">SplitSmart</Link>
          <h1 className="mt-6 text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        </div>
        {children}
      </div>
    </div>
  )
}

function FieldError({ message }: { message?: string }) {
  return message ? <p className="mt-1 text-sm text-destructive">{message}</p> : null
}

function GoogleButton() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleGoogle() {
    setLoading(true)
    setError(null)
    const result = await signInWithGoogle()
    if (result.error) {
      setError(result.error.message)
      setLoading(false)
    }
  }

  return (
    <div>
      <Button className="w-full" disabled={loading} onClick={() => void handleGoogle()} type="button" variant="outline">
        {loading ? 'Opening Google…' : 'Continue with Google'}
      </Button>
      {error ? <p className="mt-2 text-sm text-destructive">{error}</p> : null}
    </div>
  )
}

function AuthDivider() {
  return (
    <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
      <div className="h-px flex-1 bg-border" />OR<div className="h-px flex-1 bg-border" />
    </div>
  )
}

export function LoginPage() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const form = useForm<LoginValues>({ resolver: zodResolver(loginSchema), defaultValues: { email: '', password: '' } })

  async function onSubmit(values: LoginValues) {
    setLoading(true)
    setError(null)
    const { error: authError } = await signInWithEmail(values.email, values.password)
    if (authError) setError(authError.message)
    else navigate('/')
    setLoading(false)
  }

  return (
    <AuthLayout title="Welcome back" description="Sign in to continue to SplitSmart.">
      <GoogleButton />
      <AuthDivider />
      <form className="space-y-4" onSubmit={(event) => void form.handleSubmit(onSubmit)(event)}>
        <div>
          <label className="text-sm font-medium" htmlFor="login-email">Email</label>
          <input className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm" id="login-email" type="email" {...form.register('email')} />
          <FieldError message={form.formState.errors.email?.message} />
        </div>
        <div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium" htmlFor="login-password">Password</label>
            <Link className="text-sm text-primary hover:underline" to="/forgot-password">Forgot password?</Link>
          </div>
          <input className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm" id="login-password" type="password" {...form.register('password')} />
          <FieldError message={form.formState.errors.password?.message} />
        </div>
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        <Button className="w-full" disabled={loading} type="submit">{loading ? 'Signing in…' : 'Sign in'}</Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">New to SplitSmart? <Link className="text-primary hover:underline" to="/signup">Create an account</Link></p>
    </AuthLayout>
  )
}

export function SignupPage() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const form = useForm<SignupValues>({ resolver: zodResolver(signupSchema), defaultValues: { displayName: '', email: '', password: '', confirmPassword: '' } })

  async function onSubmit(values: SignupValues) {
    setLoading(true)
    setError(null)
    setMessage(null)
    const { error: authError } = await signUpWithEmail(values.email, values.password, values.displayName)
    if (authError) setError(authError.message)
    else {
      setMessage('Account created. Check your email if confirmation is required, then sign in.')
      navigate('/login')
    }
    setLoading(false)
  }

  return (
    <AuthLayout title="Create your account" description="Start sharing expenses without the spreadsheet chaos.">
      <GoogleButton />
      <AuthDivider />
      <form className="space-y-4" onSubmit={(event) => void form.handleSubmit(onSubmit)(event)}>
        <div><label className="text-sm font-medium" htmlFor="signup-name">Name</label><input className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm" id="signup-name" {...form.register('displayName')} /><FieldError message={form.formState.errors.displayName?.message} /></div>
        <div><label className="text-sm font-medium" htmlFor="signup-email">Email</label><input className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm" id="signup-email" type="email" {...form.register('email')} /><FieldError message={form.formState.errors.email?.message} /></div>
        <div><label className="text-sm font-medium" htmlFor="signup-password">Password</label><input className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm" id="signup-password" type="password" {...form.register('password')} /><FieldError message={form.formState.errors.password?.message} /></div>
        <div><label className="text-sm font-medium" htmlFor="signup-confirm">Confirm password</label><input className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm" id="signup-confirm" type="password" {...form.register('confirmPassword')} /><FieldError message={form.formState.errors.confirmPassword?.message} /></div>
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        {message ? <p className="text-sm text-emerald-600">{message}</p> : null}
        <Button className="w-full" disabled={loading} type="submit">{loading ? 'Creating account…' : 'Create account'}</Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">Already have an account? <Link className="text-primary hover:underline" to="/login">Sign in</Link></p>
    </AuthLayout>
  )
}

export function ForgotPasswordPage() {
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const form = useForm<ForgotPasswordValues>({ resolver: zodResolver(forgotPasswordSchema), defaultValues: { email: '' } })

  async function onSubmit(values: ForgotPasswordValues) {
    setLoading(true)
    setError(null)
    setMessage(null)
    const { error: authError } = await requestPasswordReset(values.email)
    if (authError) setError(authError.message)
    else setMessage('If the account exists, a password reset email has been sent.')
    setLoading(false)
  }

  return (
    <AuthLayout title="Reset your password" description="We will send you a secure password reset link.">
      <form className="space-y-4" onSubmit={(event) => void form.handleSubmit(onSubmit)(event)}>
        <div><label className="text-sm font-medium" htmlFor="forgot-email">Email</label><input className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm" id="forgot-email" type="email" {...form.register('email')} /><FieldError message={form.formState.errors.email?.message} /></div>
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        {message ? <p className="text-sm text-emerald-600">{message}</p> : null}
        <Button className="w-full" disabled={loading} type="submit">{loading ? 'Sending…' : 'Send reset link'}</Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground"><Link className="text-primary hover:underline" to="/login">Back to sign in</Link></p>
    </AuthLayout>
  )
}

export function ResetPasswordPage() {
  const navigate = useNavigate()
  const { loading: authLoading, user } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const form = useForm<ResetPasswordValues>({ resolver: zodResolver(resetPasswordSchema), defaultValues: { password: '', confirmPassword: '' } })

  if (!authLoading && !user) {
    return <AuthLayout title="Reset link required" description="Open the password reset link from your email to continue."><Button asChild className="w-full"><Link to="/forgot-password">Request a new link</Link></Button></AuthLayout>
  }

  async function onSubmit(values: ResetPasswordValues) {
    setLoading(true)
    setError(null)
    setMessage(null)
    const { error: authError } = await updatePassword(values.password)
    if (authError) setError(authError.message)
    else {
      setMessage('Your password has been updated.')
      await supabase.auth.signOut()
      navigate('/login')
    }
    setLoading(false)
  }

  return (
    <AuthLayout title="Choose a new password" description="Use a strong password you do not reuse elsewhere.">
      <form className="space-y-4" onSubmit={(event) => void form.handleSubmit(onSubmit)(event)}>
        <div><label className="text-sm font-medium" htmlFor="reset-password">New password</label><input className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm" id="reset-password" type="password" {...form.register('password')} /><FieldError message={form.formState.errors.password?.message} /></div>
        <div><label className="text-sm font-medium" htmlFor="reset-confirm">Confirm password</label><input className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm" id="reset-confirm" type="password" {...form.register('confirmPassword')} /><FieldError message={form.formState.errors.confirmPassword?.message} /></div>
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        {message ? <p className="text-sm text-emerald-600">{message}</p> : null}
        <Button className="w-full" disabled={loading} type="submit">{loading ? 'Updating…' : 'Update password'}</Button>
      </form>
    </AuthLayout>
  )
}
