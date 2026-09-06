# SplitSmart

A mobile-first shared-expense application with optional trip dates and a future Smart Trip Mode.

## Stack

- React, TypeScript, and Vite
- Tailwind CSS and shadcn/ui conventions
- React Router and TanStack Query
- Supabase Auth and Postgres
- Zod for runtime validation
- Vitest and React Testing Library
- ESLint and Prettier

## Getting started

```bash
cp .env.example .env
npm install
npm run dev
```

Client environment variables:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

Only publishable Supabase configuration belongs in the browser. Never add service-role keys, secret keys, database passwords, or OAuth client secrets to client environment files.

## Authentication

SplitSmart supports:

- Email/password sign up and sign in
- Google Sign-In through Supabase Auth
- Password reset
- Persistent browser sessions
- Protected application routes
- Profile settings for display name, currency, and timezone

Google Sign-In is authentication only. It does **not** grant SplitSmart access to Gmail messages. Gmail transaction capture will be implemented later as a separate, explicit connection flow for Smart Trip Mode.

### Supabase configuration

1. Create or use a Supabase project.
2. Run the migration in `supabase/migrations/20260906110000_create_profiles_and_rls.sql` (or use the equivalent migration generated for your local Supabase workflow).
3. Ensure Email provider is enabled under Authentication.
4. Add the application's local and production URLs to the Supabase Auth URL configuration.

The `profiles` table has RLS enabled and users can only read or update their own profile.

### Google Sign-In configuration

Supabase's Google provider requires a Google Cloud OAuth client and provider configuration.

In Google Cloud:

1. Create or select a project.
2. Configure the Google Auth Platform branding/audience.
3. Create a Web OAuth client.
4. Add your application origin(s) as authorized JavaScript origins.
5. Add the Supabase Auth callback URL as an authorized redirect URI. For the hosted project this is the callback URL shown in the Supabase Google provider configuration, typically `https://<project-ref>.supabase.co/auth/v1/callback`.
6. Copy the Google client ID and client secret into the Supabase Authentication > Providers > Google configuration.

The application calls Supabase `signInWithOAuth({ provider: 'google' })` and redirects back to `/auth/callback` for the SplitSmart application flow.

Do not request Gmail API scopes as part of sign-in. Google authentication only requires identity scopes such as `openid`, email, and profile.

## Verification

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

## Structure

- `src/components` — shared UI and layout primitives.
- `src/features/auth` — authentication state, pages, validation, and profile settings.
- `src/features` — feature boundaries for future product work.
- `src/lib` — framework-agnostic helpers and client-safe configuration.
- `src/routes` — route definitions and route-level screens.
- `supabase/migrations` — database schema changes.

Financial calculations will be introduced in pure TypeScript modules with deterministic tests. Smart-capture suggestions will remain separate from confirmed expenses and require explicit confirmation.
