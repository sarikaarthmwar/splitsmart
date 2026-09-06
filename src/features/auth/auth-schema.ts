import { z } from 'zod'

const password = z.string().min(8, 'Password must be at least 8 characters.')
const email = z.string().trim().toLowerCase().email('Enter a valid email address.')

export const loginSchema = z.object({
  email,
  password,
})

export const signupSchema = z
  .object({
    displayName: z.string().trim().min(1, 'Enter your name.').max(100, 'Name is too long.'),
    email,
    password,
    confirmPassword: z.string(),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match.',
  })
  .extend({ password })

export const forgotPasswordSchema = z.object({ email })

export const resetPasswordSchema = z
  .object({
    password,
    confirmPassword: z.string(),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match.',
  })

export const profileSchema = z.object({
  displayName: z.string().trim().min(1, 'Enter your name.').max(100, 'Name is too long.'),
  defaultCurrency: z.string().trim().length(3, 'Use a 3-letter currency code.').toUpperCase(),
  timezone: z.string().trim().min(1, 'Select a timezone.').max(100),
})

export type LoginValues = z.infer<typeof loginSchema>
export type SignupValues = z.infer<typeof signupSchema>
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>
export type ProfileValues = z.infer<typeof profileSchema>
