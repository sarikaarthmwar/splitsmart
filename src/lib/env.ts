import { z } from 'zod'

const publicEnvironmentSchema = z.object({
  VITE_SUPABASE_URL: z.string().url().optional(),
  VITE_SUPABASE_PUBLISHABLE_KEY: z.string().min(1).optional(),
})

export const env = publicEnvironmentSchema.parse(import.meta.env)
