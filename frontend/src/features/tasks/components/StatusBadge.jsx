import { cn } from '@/shared/lib/utils'

const statusConfig = {
  TODO: { label: 'To Do', className: 'bg-slate-700/60 text-slate-300 border-slate-600/50' },
  IN_PROGRESS: { label: 'In Progress', className: 'bg-amber-900/40 text-amber-300 border-amber-700/50' },
  DONE: { label: 'Done', className: 'bg-emerald-900/40 text-emerald-300 border-emerald-700/50' },
}

const priorityConfig = {
  LOW: { label: 'Low', className: 'bg-sky-900/40 text-sky-300 border-sky-700/50' },
  MEDIUM: { label: 'Medium', className: 'bg-orange-900/40 text-orange-300 border-orange-700/50' },
  HIGH: { label: 'High', className: 'bg-rose-900/40 text-rose-300 border-rose-700/50' },
}

export function StatusBadge({ status, className }) {
  const config = statusConfig[status] || statusConfig.TODO
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border', config.className, className)}>
      {config.label}
    </span>
  )
}

export function PriorityBadge({ priority, className }) {
  const config = priorityConfig[priority] || priorityConfig.LOW
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border', config.className, className)}>
      {config.label}
    </span>
  )
}

export { statusConfig, priorityConfig }
