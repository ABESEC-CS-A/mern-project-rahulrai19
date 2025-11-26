import { z } from 'zod'

export const registerSchema = z.object({
  fullName: z.string().min(3).max(60),
  email: z.string().email().toLowerCase(),
  password: z.string().min(8).max(64)
})

export const loginSchema = z.object({
  email: z.string().email().toLowerCase(),
  password: z.string().min(8).max(64)
})

