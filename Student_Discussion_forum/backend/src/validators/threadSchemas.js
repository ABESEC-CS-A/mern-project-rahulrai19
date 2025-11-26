import { z } from 'zod'

export const createThreadSchema = z.object({
  title: z.string().min(6).max(120),
  description: z.string().min(10).max(5000),
  category: z.string().optional(),
  tags: z.array(z.string().min(2).max(20)).max(6).optional()
})

export const messageSchema = z.object({
  body: z.string().min(1).max(2000)
})

