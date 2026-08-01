import { z } from 'zod'

export const createTaskSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100),
  description: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH'], { required_error: 'Priority is required' }),
  dueDate: z
    .string({ required_error: 'Due date is required' })
    .min(1, 'Due date is required')
    .refine(
      (val) => new Date(val) > new Date(),
      'Due date must be in the future'
    ),
  assigneeId: z.string().uuid('Please select an assignee'),
})

export const updateTaskSchema = z.object({
  title: z.string().min(3).max(100).optional(),
  description: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
  dueDate: z.string().optional(),
})

export const assignTaskSchema = z.object({
  assigneeId: z.string().uuid('Please select a member'),
})
