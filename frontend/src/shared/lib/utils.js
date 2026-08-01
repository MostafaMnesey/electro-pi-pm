import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatDate(date) {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function isOverdue(dueDate) {
  if (!dueDate) return false
  return new Date(dueDate) < new Date()
}

/**
 * Extract first-field backend validation errors and apply them via RHF setError.
 * Falls back to returning the general message string.
 */
export function extractApiError(err) {
  const data = err?.response?.data
  if (!data) return 'Something went wrong. Please try again.'
  if (typeof data.message === 'string') return data.message
  if (Array.isArray(data.errors)) {
    return data.errors.map((e) => e.message || e).join(', ')
  }
  return 'An error occurred.'
}

export function getInitials(name = '') {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}
