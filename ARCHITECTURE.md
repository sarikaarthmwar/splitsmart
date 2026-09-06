# SplitSmart Technical Architecture

## Stack
- React + TypeScript + Vite
- Tailwind CSS + shadcn/ui
- React Router
- TanStack Query
- Zod
- Supabase Auth
- Supabase PostgreSQL
- Supabase RLS
- Supabase Realtime where useful
- Supabase Edge Functions for secure server-side integrations
- Vitest + React Testing Library
- GitHub + Vercel

## Frontend structure
```text
src/
  components/
    ui/
    layout/
  features/
    auth/
    dashboard/
    groups/
    expenses/
    balances/
    settlements/
    smart-capture/
  hooks/
  lib/
    supabase.ts
    calculations.ts
    validation.ts
  services/
  types/
  routes/
```

## Backend/data structure
```text
auth.users
  |
profiles
  |
group_members ---- groups
  |
expenses
  |
expense_splits
  |
settlements

Future smart-capture path:
connected_sources
  -> detected_transactions
  -> expense_suggestions
  -> confirmed expenses
```

## Core tables

### profiles
- id UUID primary key referencing auth.users
- display_name
- avatar_url
- default_currency
- timezone
- created_at
- updated_at

### groups
- id UUID primary key
- name
- description
- currency
- start_date nullable
- end_date nullable
- smart_capture_enabled
- created_by
- created_at
- updated_at
- archived_at nullable

### group_members
- id UUID primary key
- group_id
- user_id
- role: owner/admin/member
- status
- joined_at
- left_at nullable

### expenses
- id UUID primary key
- group_id
- description
- amount
- currency
- paid_by
- category
- expense_date
- notes
- created_by
- created_at
- updated_at
- deleted_at nullable

### expense_splits
- id UUID primary key
- expense_id
- user_id
- split_type: equal/exact/percentage/shares
- share_value
- amount
- created_at

### settlements
- id UUID primary key
- group_id
- from_user
- to_user
- amount
- currency
- payment_method
- settlement_date
- notes
- created_by
- created_at

## Security
- Enable RLS on all exposed public tables.
- A user may access group data only when they are a member of that group, subject to role rules for writes.
- Profile access is limited to the owning user unless a future product requirement explicitly permits limited member discovery.
- UPDATE policies must include both USING and WITH CHECK authorization.
- Never use editable user metadata as authorization.
- Never expose service-role/secret keys in client code.
- OAuth credentials belong in secure server-side handling.

## Balance engine
The calculation module must be pure TypeScript.

```text
expenses + expense_splits + settlements
              |
       calculateBalances()
              |
       simplifyDebts()
              |
       settlement suggestions
```

No UI component should calculate financial balances directly.

## Smart Trip Mode
The web client only initiates/consumes secure integration flows. Email retrieval and parsing occur server-side.

```text
React
  -> secure Edge Function
  -> OAuth provider
  -> transaction parser
  -> normalized detected transaction
  -> suggestion engine
  -> user confirmation
  -> expenses
```

The system must not automatically convert detected transactions into confirmed expenses.

## Environment variables
Client-safe:
- VITE_SUPABASE_URL
- VITE_SUPABASE_PUBLISHABLE_KEY

Server-side only, where required:
- provider OAuth secrets
- service-role/secret credentials

Never commit `.env` files or secrets.

## Development sequence
1. Repository foundation
2. Supabase/Auth
3. Groups and members
4. Manual expenses
5. Balance engine
6. Settlements
7. Dashboard/polish
8. Smart-capture data model
9. Gmail OAuth/integration
10. Detection and suggestions
11. AI classification and duplicate detection
12. Security/performance/production verification
