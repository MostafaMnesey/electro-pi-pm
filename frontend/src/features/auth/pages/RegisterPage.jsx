import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router-dom'
import { Eye, EyeOff, UserPlus, LayoutDashboard } from 'lucide-react'
import { useState } from 'react'
import { registerSchema } from '../schemas/authSchemas'
import { useRegister } from '../hooks/useAuth'
import { Button } from '@/shared/components/Button'
import { ErrorMessage, FormField } from '@/shared/components/FormField'
import { extractApiError } from '@/shared/lib/utils'

export default function RegisterPage() {
  const [showPw, setShowPw] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const { mutate: register_, isPending, error } = useRegister()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(registerSchema) })

  const onSubmit = (data) => {
    const { confirmPassword, ...rest } = data
    register_(rest)
  }

  return (
    <div className="min-h-screen bg-surface-950 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-violet-600/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-brand-600/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-violet-600 shadow-2xl shadow-brand-900/50 mb-4">
            <LayoutDashboard className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-100">Create an account</h1>
          <p className="text-slate-400 text-sm mt-1">Join your team on ProjectFlow</p>
        </div>

        <div className="glass-card p-6 md:p-8 space-y-5">
          <ErrorMessage message={error ? extractApiError(error) : null} />

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField label="Full Name" error={errors.name} required>
              <input
                {...register('name')}
                type="text"
                placeholder="Jane Smith"
                autoComplete="name"
                className="input-base"
              />
            </FormField>

            <FormField label="Email" error={errors.email} required>
              <input
                {...register('email')}
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                className="input-base"
              />
            </FormField>

            <FormField label="Phone" error={errors.phone} required>
              <input
                {...register('phone')}
                type="tel"
                placeholder="01234567890"
                autoComplete="tel"
                className="input-base"
              />
              <p className="text-xs text-slate-500 mt-1">Digits only, no country code (4–14 digits)</p>
            </FormField>

            <FormField label="Password" error={errors.password} required>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPw ? 'text' : 'password'}
                  placeholder="Min 8 chars, upper, lower, number, special"
                  autoComplete="new-password"
                  className="input-base pr-10"
                />
                <button type="button" onClick={() => setShowPw((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </FormField>

            <FormField label="Confirm Password" error={errors.confirmPassword} required>
              <div className="relative">
                <input
                  {...register('confirmPassword')}
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Repeat your password"
                  autoComplete="new-password"
                  className="input-base pr-10"
                />
                <button type="button" onClick={() => setShowConfirm((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </FormField>

            <Button type="submit" className="w-full" isLoading={isPending} size="lg">
              <UserPlus className="w-4 h-4" />
              Create Account
            </Button>
          </form>

          <div className="px-4 py-3 rounded-lg bg-amber-900/20 border border-amber-700/40 text-xs text-amber-300">
            ℹ️ After registration, an admin must approve your account before you can log in.
          </div>

          <p className="text-center text-sm text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
