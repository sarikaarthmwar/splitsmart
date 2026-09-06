import { BarChart3, Home, Menu, Plus, ReceiptText, Settings2, UsersRound } from 'lucide-react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { useAuth } from '@/features/auth/auth-context'
import { signOut } from '@/lib/auth'
import { cn } from '@/lib/utils'

const navigation = [
  { label: 'Overview', to: '/', icon: Home },
  { label: 'Groups', to: '/groups', icon: UsersRound },
  { label: 'Activity', to: '/activity', icon: BarChart3 },
]

export function AppShell() {
  const { user } = useAuth()
  const navigate = useNavigate()

  async function handleSignOut() {
    const { error } = await signOut()
    if (!error) navigate('/login')
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-20 border-b bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <NavLink className="flex items-center gap-2.5 font-semibold tracking-tight" to="/">
            <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm"><ReceiptText className="size-5" /></span>
            <span>SplitSmart</span>
          </NavLink>
          <div className="flex items-center gap-1.5">
            <span className="hidden max-w-48 truncate px-2 text-sm text-muted-foreground lg:inline">{user?.email}</span>
            <Button asChild size="sm" variant="ghost"><NavLink to="/profile"><Settings2 className="mr-1.5 size-4" />Profile</NavLink></Button>
            <Button asChild size="sm" className="hidden sm:inline-flex"><NavLink to="/groups/new"><Plus className="size-4" />New group</NavLink></Button>
            <Button aria-label="Menu" size="icon" variant="ghost"><Menu className="size-5" /></Button>
            <Button onClick={() => void handleSignOut()} size="sm" variant="outline" className="hidden sm:inline-flex">Sign out</Button>
          </div>
        </div>
      </header>
      <div className="mx-auto flex max-w-7xl px-4 sm:px-6 lg:px-8">
        <aside className="hidden w-52 shrink-0 border-r pr-5 pt-7 md:block"><nav aria-label="Primary navigation" className="sticky top-24 space-y-1">{navigation.map((item) => { const Icon = item.icon; return <NavLink key={item.to} to={item.to} end={item.to === '/'} className={({ isActive }) => cn('flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition hover:bg-accent hover:text-accent-foreground', isActive && 'bg-accent text-accent-foreground') }><Icon className="size-4" />{item.label}</NavLink> })}</nav></aside>
        <main className="min-w-0 flex-1 py-7 md:pl-7"><nav aria-label="Mobile navigation" className="mb-6 flex gap-1 overflow-x-auto md:hidden">{navigation.map((item) => <NavLink key={item.to} to={item.to} end={item.to === '/'} className={({ isActive }) => cn('rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground', isActive && 'bg-accent text-accent-foreground')}>{item.label}</NavLink>)}</nav><Outlet /></main>
      </div>
    </div>
  )
}
