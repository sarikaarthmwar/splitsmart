import { createClient } from '@supabase/supabase-js'

import { env } from '@/lib/env'

// Supabase publishable configuration is intentionally browser-safe.
// Keep environment variables as the preferred override, but provide the
// project's public configuration so a missing Vercel env does not prevent
// the React application from mounting at all.
const supabaseUrl = env.VITE_SUPABASE_URL ?? 'https://vhzuxuqshgjjjeuxmdty.supabase.co'
const supabasePublishableKey = env.VITE_SUPABASE_PUBLISHABLE_KEY ?? 'sb_publishable_dAMNgXDy9bBLXTroHV6jrw_ZHuYj1Zo'

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})
