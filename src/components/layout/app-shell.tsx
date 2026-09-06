import { Menu, Plus, ReceiptText } from 'lucide-react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { useAuth } from '@/features/auth/auth-context'
import { signOut } from '@/lib/auth'
import { cn } from '@/lib/utils'

const navigation = [
  { label: 'Overview', to: '/' },
  { label: 'Groups', to: '/groups' },
  { label: 'Activity', to: '/activity' },
]

export function AppShell() {
  const { user } = useAuth()
  const navigate = useNavigate()

  async function handleSignOut() {
    const { error } = await signOut()
    if (!error) navigate('/login')
  }

  return (
    <div className="min-h-screen bg-muted/40">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <NavLink className="flex items-center gap-2 font-semibold tracking-tight" to="/">
            <span className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground">
              <ReceiptText className="size-5" aria-hidden="true" />
            </span>
            SplitSmart
          </NavLink>
          <div className="flex items-center gap-2">
            <span className="hidden max-w-48 truncate text-sm text-muted-foreground sm:inline">{user?.email}</span>
            <Button asChild size="sm" variant="ghost"><NavLink to="/profile">Profile</NavLink></Button>
            <Button className="hidden sm:inline-flex" size="sm">
              <Plus className="size-4" aria-hidden="true" />
              Add expense
            </Button>
            <Button aria-label="Open navigation" size="icon" variant="ghost">
              <Menu className="size-5" aria-hidden="true" />
            </Button>
            <Button onClick={() => void handleSignOut()} size="sm" variant="outline">Sign out</Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <nav aria-label="Primary navigation" className="mb-8 flex gap-1 overflow-x-auto">
          {navigation.map((item) => (
            <NavLink
              className={({ isActive }) =>
                cn(
                  'rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                  isActive && 'bg-accent text-accent-foreground',
                )
              }
              end={item.to === '/'}
              key={item.to}
              to={item.to}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <Outlet />
      </main>
    </div>
  )
}
