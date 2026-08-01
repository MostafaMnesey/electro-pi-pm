import { AlertCircle } from 'lucide-react'

export function ErrorMessage({ message }) {
  if (!message) return null
  return (
    <div className="flex items-start gap-3 px-4 py-3 rounded-lg bg-rose-900/20 border border-rose-700/40 text-sm text-rose-300">
      <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
      <span>{message}</span>
    </div>
  )
}

export function FieldError({ error }) {
  if (!error) return null
  return <p className="text-xs text-rose-400 mt-1">{error.message || error}</p>
}

export function FormField({ label, error, children, required }) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-slate-300">
          {label}
          {required && <span className="text-rose-400 ml-1">*</span>}
        </label>
      )}
      {children}
      <FieldError error={error} />
    </div>
  )
}
