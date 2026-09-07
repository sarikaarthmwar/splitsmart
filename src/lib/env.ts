import { z } from 'zod'

const optionalNonEmpty = z.preprocess(
  (value) => (typeof value === 'string' && value.trim() === '' ? undefined : value),
  z.string().min(1).optional(),
)

const publicEnvironmentSchema = z.object({
  VITE_SUPABASE_URL: z.preprocess(
    (value) => (typeof value === 'string' && value.trim() === '' ? undefined : value),
    z.string().url().optional(),
  ),
  VITE_SUPABASE_PUBLISHABLE_KEY: optionalNonEmpty,
})

export const env = publicEnvironmentSchema.parse(import.meta.env)
