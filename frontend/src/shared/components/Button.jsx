import { cn } from '@/shared/lib/utils'
import { cva } from 'class-variance-authority'
import { Spinner } from './Spinner'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface-900 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 select-none',
  {
    variants: {
      variant: {
        primary: 'bg-brand-600 hover:bg-brand-500 text-white focus:ring-brand-500 shadow-lg shadow-brand-900/30',
        ghost: 'text-slate-400 hover:text-slate-100 hover:bg-surface-700 focus:ring-surface-500',
        danger: 'bg-rose-600 hover:bg-rose-500 text-white focus:ring-rose-500 shadow-lg shadow-rose-900/30',
        outline: 'border border-surface-600 text-slate-300 hover:bg-surface-700 hover:text-slate-100 focus:ring-surface-500',
        success: 'bg-emerald-600 hover:bg-emerald-500 text-white focus:ring-emerald-500',
      },
      size: {
        sm: 'px-3 py-1.5 text-xs',
        md: 'px-4 py-2.5',
        lg: 'px-6 py-3 text-base',
        icon: 'p-2',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export function Button({ className, variant, size, isLoading, children, ...props }) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && <Spinner size="sm" className="text-current" />}
      {children}
    </button>
  )
}
