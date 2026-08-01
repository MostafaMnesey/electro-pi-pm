import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useLocation } from 'react-router-dom'
import { Eye, EyeOff, LogIn, LayoutDashboard } from 'lucide-react'
import { useState } from 'react'
import { loginSchema } from '../schemas/authSchemas'
import { useLogin } from '../hooks/useAuth'
import { Button } from '@/shared/components/Button'
import { ErrorMessage, FormField } from '@/shared/components/FormField'
import { extractApiError } from '@/shared/lib/utils'

export default function LoginPage() {
  const location = useLocation()
  const registered = location.state?.registered
  const [showPw, setShowPw] = useState(false)

  const { mutate: login, isPending, error } = useLogin()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) })

  const onSubmit = (data) => login(data)

  return (
    <div className="min-h-screen bg-surface-950 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-brand-600/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-violet-600/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-violet-600 shadow-2xl shadow-brand-900/50 mb-4">
            <LayoutDashboard className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-100">Welcome back</h1>
          <p className="text-slate-400 text-sm mt-1">Sign in to your ProjectFlow account</p>
        </div>

        <div className="glass-card p-6 md:p-8 space-y-5">
          {/* Registered success message */}
          {registered && (
            <div className="px-4 py-3 rounded-lg bg-emerald-900/20 border border-emerald-700/40 text-sm text-emerald-300">
              Account created! Please wait for admin approval before logging in.
            </div>
          )}

          <ErrorMessage message={error ? extractApiError(error) : null} />

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField label="Email" error={errors.email} required>
              <input
                {...register('email')}
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                className="input-base"
              />
            </FormField>

            <FormField label="Password" error={errors.password} required>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPw ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="input-base pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </FormField>

            <Button type="submit" className="w-full" isLoading={isPending} size="lg">
              <LogIn className="w-4 h-4" />
              Sign In
            </Button>
          </form>

          <p className="text-center text-sm text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
