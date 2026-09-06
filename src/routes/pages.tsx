import { ArrowRight, ArrowUpRight, CircleAlert, Plane, Plus, ReceiptText, Users } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'

const recent = [
  { title: 'Hotel booking', group: 'Goa Getaway', by: 'You', amount: '₹18,500' },
  { title: 'Dinner at Fisherman’s Wharf', group: 'Goa Getaway', by: 'Amit', amount: '₹4,260' },
  { title: 'Airport cab', group: 'Goa Getaway', by: 'Rishi', amount: '₹1,240' },
]

export function DashboardPage() {
  return (
    <section className="space-y-7">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="text-sm font-semibold text-primary">Sunday, September 6</p><h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">Good morning, Sarika.</h1><p className="mt-2 text-muted-foreground">Here’s your shared-money snapshot.</p></div>
        <Button asChild><Link to="/groups/new"><Plus className="size-4" />Create group</Link></Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <BalanceCard label="You owe" value="₹780" hint="Across 1 group" />
        <BalanceCard label="You are owed" value="₹2,350" hint="Across 1 group" />
        <BalanceCard label="Net balance" value="+₹1,570" hint="You’re ahead overall" positive />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.35fr_.65fr]">
        <section className="rounded-2xl border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between"><div><h2 className="font-semibold">Your groups</h2><p className="mt-1 text-sm text-muted-foreground">Jump back into a shared expense space.</p></div><Button asChild size="sm" variant="ghost"><Link to="/groups">View all<ArrowRight className="size-4" /></Link></Button></div>
          <Link to="/groups/goa-getaway" className="mt-5 flex items-center gap-4 rounded-xl border p-4 transition hover:bg-muted/50">
            <span className="grid size-11 place-items-center rounded-xl bg-sky-100 text-sky-700"><Plane className="size-5" /></span><span className="min-w-0 flex-1"><span className="block font-medium">Goa Getaway</span><span className="mt-0.5 block text-sm text-muted-foreground">Sep 12 – Sep 16 · 5 members</span></span><span className="text-right"><span className="block font-semibold">₹32,450</span><span className="block text-xs text-muted-foreground">spent</span></span>
          </Link>
          <Link to="/groups" className="mt-3 flex items-center gap-4 rounded-xl border p-4 transition hover:bg-muted/50"><span className="grid size-11 place-items-center rounded-xl bg-emerald-100 text-emerald-700"><Users className="size-5" /></span><span className="min-w-0 flex-1"><span className="block font-medium">Apartment</span><span className="mt-0.5 block text-sm text-muted-foreground">4 members · Smart Trip off</span></span><span className="text-right"><span className="block font-semibold">₹8,720</span><span className="block text-xs text-muted-foreground">spent</span></span></Link>
        </section>

        <section className="rounded-2xl border bg-primary p-6 text-primary-foreground shadow-sm"><span className="grid size-10 place-items-center rounded-xl bg-primary-foreground/10"><ReceiptText className="size-5" /></span><h2 className="mt-5 text-xl font-semibold">Smart Trip Mode</h2><p className="mt-2 text-sm leading-6 text-primary-foreground/75">Connect a transaction source later and SplitSmart can suggest expenses during your trip. You always approve before anything is added.</p><div className="mt-6 flex items-center gap-2 text-xs font-medium text-primary-foreground/80"><span className="size-2 rounded-full bg-primary-foreground/70" />Coming soon</div></section>
      </div>

      <section className="rounded-2xl border bg-card p-6 shadow-sm"><div className="flex items-center justify-between"><div><h2 className="font-semibold">Recent activity</h2><p className="mt-1 text-sm text-muted-foreground">Your latest shared spending.</p></div><Button asChild size="sm" variant="ghost"><Link to="/activity">See activity<ArrowUpRight className="size-4" /></Link></Button></div><div className="mt-4 divide-y">{recent.map((item) => <div className="flex items-center gap-4 py-4" key={item.title}><span className="grid size-10 place-items-center rounded-full bg-muted"><ReceiptText className="size-4" /></span><span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium">{item.title}</span><span className="block text-xs text-muted-foreground">{item.group} · paid by {item.by}</span></span><span className="text-sm font-semibold">{item.amount}</span></div>)}</div></section>
    </section>
  )
}

function BalanceCard({ label, value, hint, positive = false }: { label: string; value: string; hint: string; positive?: boolean }) {
  return <article className="rounded-2xl border bg-card p-5 shadow-sm"><p className="text-sm text-muted-foreground">{label}</p><p className={`mt-3 text-2xl font-semibold tracking-tight ${positive ? 'text-emerald-600' : ''}`}>{value}</p><p className="mt-1 text-xs text-muted-foreground">{hint}</p></article>
}

export function PlaceholderPage({ title, description }: { title: string; description: string }) { return <section className="rounded-xl border bg-card p-8 shadow-sm"><p className="text-sm font-medium text-primary">Coming next</p><h1 className="mt-1 text-3xl font-semibold tracking-tight">{title}</h1><p className="mt-3 max-w-2xl text-muted-foreground">{description}</p></section> }
export function NotFoundPage() { return <section className="mx-auto max-w-lg py-20 text-center"><CircleAlert className="mx-auto size-10 text-primary" aria-hidden="true" /><h1 className="mt-4 text-2xl font-semibold">Page not found</h1><p className="mt-2 text-muted-foreground">The page you requested does not exist or has moved.</p><Button asChild className="mt-6"><Link to="/">Return home <ArrowRight className="size-4" /></Link></Button></section> }
