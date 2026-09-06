import { ArrowLeft, CalendarDays, ChevronRight, Plane, Plus, Users } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'

const demoGroups = [
  { name: 'Goa Getaway', meta: 'Sep 12 – Sep 16 · 5 members', spent: '₹32,450', tone: 'bg-sky-100 text-sky-700', icon: Plane },
  { name: 'Apartment', meta: '4 members · Smart Trip off', spent: '₹8,720', tone: 'bg-emerald-100 text-emerald-700', icon: Users },
  { name: 'Dinner Squad', meta: '6 members · 3 recent expenses', spent: '₹4,280', tone: 'bg-violet-100 text-violet-700', icon: Users },
]

export function GroupsPage() {
  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">Your groups</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">Where shared spending happens.</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">Trips, homes, dinners or anything you split together.</p>
        </div>
        <Button asChild><Link to="/groups/new"><Plus className="size-4" />Create group</Link></Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {demoGroups.map((group) => {
          const Icon = group.icon
          return (
            <Link key={group.name} to="/groups/goa-getaway" className="group rounded-2xl border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-start justify-between"><span className={`grid size-11 place-items-center rounded-xl ${group.tone}`}><Icon className="size-5" /></span><ChevronRight className="size-5 text-muted-foreground transition group-hover:translate-x-0.5" /></div>
              <h2 className="mt-5 text-lg font-semibold">{group.name}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{group.meta}</p>
              <div className="mt-6 border-t pt-4"><p className="text-xs uppercase tracking-wide text-muted-foreground">Total spent</p><p className="mt-1 text-2xl font-semibold">{group.spent}</p></div>
            </Link>
          )
        })}
      </div>
      <div className="rounded-2xl border border-dashed bg-card p-6 text-center"><p className="font-medium">New here?</p><p className="mt-1 text-sm text-muted-foreground">Create a group and invite people before adding your first expense.</p></div>
    </section>
  )
}

export function CreateGroupPage() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [currency, setCurrency] = useState('INR')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [smartCapture, setSmartCapture] = useState(true)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!name.trim()) return
    navigate('/groups')
  }

  return (
    <section className="mx-auto max-w-2xl space-y-6">
      <Button asChild variant="ghost" className="-ml-3"><Link to="/groups"><ArrowLeft className="size-4" />Back to groups</Link></Button>
      <div><p className="text-sm font-semibold text-primary">New group</p><h1 className="mt-1 text-3xl font-semibold tracking-tight">Set up your shared space.</h1><p className="mt-2 text-muted-foreground">Trip dates are optional. Add them when this group is tied to a journey.</p></div>
      <form onSubmit={handleSubmit} className="rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
        <div className="space-y-6">
          <label className="block"><span className="text-sm font-medium">Group name</span><input autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Goa Getaway" className="mt-2 h-11 w-full rounded-lg border bg-background px-3 outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring" /></label>
          <label className="block"><span className="text-sm font-medium">Currency</span><select value={currency} onChange={(e) => setCurrency(e.target.value)} className="mt-2 h-11 w-full rounded-lg border bg-background px-3 outline-none focus:ring-2 focus:ring-ring"><option>INR</option><option>USD</option><option>EUR</option><option>GBP</option></select></label>
          <div><div className="flex items-center gap-2"><CalendarDays className="size-4 text-primary" /><span className="text-sm font-medium">Trip dates <span className="font-normal text-muted-foreground">(optional)</span></span></div><div className="mt-2 grid gap-3 sm:grid-cols-2"><input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="h-11 rounded-lg border bg-background px-3 outline-none focus:ring-2 focus:ring-ring" /><input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="h-11 rounded-lg border bg-background px-3 outline-none focus:ring-2 focus:ring-ring" /></div><p className="mt-2 text-xs text-muted-foreground">These dates can later power Smart Trip Mode.</p></div>
          <label className="flex cursor-pointer items-start gap-3 rounded-xl border bg-muted/30 p-4"><input type="checkbox" checked={smartCapture} onChange={(e) => setSmartCapture(e.target.checked)} className="mt-1 size-4 accent-primary" /><span><span className="block text-sm font-medium">Enable Smart Trip Mode</span><span className="mt-1 block text-sm text-muted-foreground">When available, SplitSmart can suggest expenses from connected transaction sources. Nothing is added without your confirmation.</span></span></label>
        </div>
        <div className="mt-8 flex justify-end gap-3 border-t pt-6"><Button asChild type="button" variant="outline"><Link to="/groups">Cancel</Link></Button><Button type="submit" disabled={!name.trim()}>Create group</Button></div>
      </form>
    </section>
  )
}

export function GroupDetailPage() {
  return (
    <section className="space-y-6">
      <Button asChild variant="ghost" className="-ml-3"><Link to="/groups"><ArrowLeft className="size-4" />All groups</Link></Button>
      <div className="rounded-2xl border bg-card p-6 shadow-sm sm:p-8"><div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between"><div><p className="text-sm font-semibold text-primary">Trip group</p><h1 className="mt-1 text-3xl font-semibold">Goa Getaway</h1><p className="mt-2 text-muted-foreground">Sep 12 – Sep 16 · 5 members</p></div><Button><Plus className="size-4" />Add expense</Button></div><div className="mt-8 grid gap-3 sm:grid-cols-3"><Metric label="Total spent" value="₹32,450" /><Metric label="You owe" value="₹780" /><Metric label="You are owed" value="₹2,350" /></div></div>
      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]"><section className="rounded-2xl border bg-card p-6 shadow-sm"><h2 className="font-semibold">Recent expenses</h2><div className="mt-4 space-y-1"><Expense title="Hotel booking" by="Sarika · yesterday" amount="₹18,500" /><Expense title="Dinner at Fisherman's Wharf" by="Amit · Sep 13" amount="₹4,260" /><Expense title="Airport cab" by="Rishi · Sep 12" amount="₹1,240" /></div></section><section className="rounded-2xl border bg-card p-6 shadow-sm"><h2 className="font-semibold">Members</h2><div className="mt-4 space-y-3">{['Sarika', 'Amit', 'Rishi', 'Neha', 'Priya'].map((member, index) => <div className="flex items-center justify-between" key={member}><div className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-full bg-muted text-sm font-semibold">{member[0]}</span><span className="text-sm font-medium">{member}</span></div>{index === 0 && <span className="text-xs text-muted-foreground">You</span>}</div>)}</div></section></div>
    </section>
  )
}

function Metric({ label, value }: { label: string; value: string }) { return <div className="rounded-xl bg-muted/50 p-4"><p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p><p className="mt-1 text-xl font-semibold">{value}</p></div> }
function Expense({ title, by, amount }: { title: string; by: string; amount: string }) { return <div className="flex items-center justify-between rounded-xl px-2 py-3 hover:bg-muted/50"><div><p className="text-sm font-medium">{title}</p><p className="mt-0.5 text-xs text-muted-foreground">{by}</p></div><p className="text-sm font-semibold">{amount}</p></div> }
