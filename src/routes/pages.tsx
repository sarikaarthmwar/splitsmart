import { ArrowRight, CircleAlert, FolderPlus, ReceiptText } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'

export function DashboardPage() {
  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">Your shared expenses</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">Keep every split simple.</h1>
          <p className="mt-2 max-w-xl text-muted-foreground">
            Create a group to begin tracking shared expenses. Balances and settlements will always remain separate.
          </p>
        </div>
        <Button asChild>
          <Link to="/groups/new">
            <FolderPlus className="size-4" aria-hidden="true" />
            Create a group
          </Link>
        </Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {['You owe', 'You are owed', 'Net balance'].map((label) => (
          <article className="rounded-xl border bg-card p-5 shadow-sm" key={label}>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="mt-3 text-2xl font-semibold">—</p>
            <p className="mt-1 text-sm text-muted-foreground">No group activity yet</p>
          </article>
        ))}
      </div>
      <EmptyState />
    </section>
  )
}

function EmptyState() {
  return (
    <section className="rounded-xl border border-dashed bg-card px-6 py-14 text-center shadow-sm">
      <div className="mx-auto grid size-12 place-items-center rounded-full bg-accent text-accent-foreground">
        <ReceiptText className="size-6" aria-hidden="true" />
      </div>
      <h2 className="mt-4 text-lg font-semibold">No expenses to show</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        Expenses will appear here after you create a group and add one. Financial changes will always require confirmation.
      </p>
    </section>
  )
}

export function PlaceholderPage({ title, description }: { title: string; description: string }) {
  return (
    <section className="rounded-xl border bg-card p-8 shadow-sm">
      <p className="text-sm font-medium text-primary">Coming next</p>
      <h1 className="mt-1 text-3xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">{description}</p>
    </section>
  )
}

export function NotFoundPage() {
  return (
    <section className="mx-auto max-w-lg py-20 text-center">
      <CircleAlert className="mx-auto size-10 text-primary" aria-hidden="true" />
      <h1 className="mt-4 text-2xl font-semibold">Page not found</h1>
      <p className="mt-2 text-muted-foreground">The page you requested does not exist or has moved.</p>
      <Button asChild className="mt-6">
        <Link to="/">
          Return home <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </Button>
    </section>
  )
}
