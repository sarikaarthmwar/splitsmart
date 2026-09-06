# SplitSmart

A mobile-first shared-expense application. This repository currently contains the frontend foundation only; authentication, Supabase integration, and financial workflows are intentionally not implemented yet.

## Stack

- React, TypeScript, and Vite
- Tailwind CSS and shadcn/ui conventions
- React Router and TanStack Query
- Zod for runtime validation
- Vitest and React Testing Library
- ESLint and Prettier

## Getting started

```bash
cp .env.example .env
npm install
npm run dev
```

Only publishable Supabase variables belong in `.env`. Never add service-role keys, OAuth secrets, or other server credentials to client configuration.

## Verification

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

## Structure

- `src/components` — shared UI and layout primitives.
- `src/features` — feature boundaries for future product work.
- `src/lib` — framework-agnostic helpers and client-safe configuration.
- `src/routes` — route definitions and route-level screens.
- `src/services` — external service adapters.
- `src/types` — shared type definitions.

Financial calculations will be introduced in pure TypeScript modules with deterministic tests. Smart-capture suggestions will remain separate from confirmed expenses and require explicit confirmation.
