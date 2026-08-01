import { z } from 'zod'

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#])[A-Za-z\d@$!%*?&^#]{8,}$/

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const registerSchema = z
  .object({
    name: z.string().min(3, 'Name must be at least 3 characters').max(32),
    email: z.string().email('Please enter a valid email address'),
    phone: z
      .string()
      .regex(/^[0-9]{4,14}$/, 'Phone must be 4–14 digits, no country code or spaces'),
    password: z
      .string()
      .regex(
        passwordRegex,
        'Password must be at least 8 characters with uppercase, lowercase, number and special character (@$!%*?&^#)'
      ),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
