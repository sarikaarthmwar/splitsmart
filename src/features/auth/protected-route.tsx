import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { useAuth } from '@/features/auth/auth-context'

export function ProtectedRoute() {
  const { loading, user } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-muted/40 px-4">
        <p className="text-sm text-muted-foreground">Checking your session…</p>
      </div>
    )
  }

  if (!user) {
    return <Navigate replace state={{ from: location.pathname }} to="/login" />
  }

  return <Outlet />
}

export function PublicOnlyRoute() {
  const { loading, user } = useAuth()

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-muted/40 px-4">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    )
  }

  if (user) {
    return <Navigate replace to="/" />
  }

  return <Outlet />
}
