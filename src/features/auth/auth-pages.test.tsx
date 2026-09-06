import { describe, expect, it } from 'vitest'

import { forgotPasswordSchema, loginSchema, profileSchema, resetPasswordSchema, signupSchema } from '@/features/auth/auth-schema'

describe('authentication schemas', () => {
  it('accepts a valid login', () => {
    expect(loginSchema.safeParse({ email: 'person@example.com', password: 'password123' }).success).toBe(true)
  })

  it('rejects a weak login password', () => {
    expect(loginSchema.safeParse({ email: 'person@example.com', password: 'short' }).success).toBe(false)
  })

  it('rejects mismatched signup passwords', () => {
    const result = signupSchema.safeParse({
      displayName: 'Sarika',
      email: 'person@example.com',
      password: 'password123',
      confirmPassword: 'password456',
    })
    expect(result.success).toBe(false)
  })

  it('normalizes and accepts a profile currency', () => {
    const result = profileSchema.parse({ displayName: 'Sarika', defaultCurrency: 'inr', timezone: 'Asia/Kolkata' })
    expect(result.defaultCurrency).toBe('INR')
  })

  it('validates password recovery email', () => {
    expect(forgotPasswordSchema.safeParse({ email: 'person@example.com' }).success).toBe(true)
    expect(forgotPasswordSchema.safeParse({ email: 'not-an-email' }).success).toBe(false)
  })

  it('requires matching reset passwords', () => {
    expect(resetPasswordSchema.safeParse({ password: 'password123', confirmPassword: 'password456' }).success).toBe(false)
  })
})
