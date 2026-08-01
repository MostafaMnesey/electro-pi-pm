import { useCallback } from 'react'
import { Search, X } from 'lucide-react'

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'TODO', label: 'To Do' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'DONE', label: 'Done' },
]

const PRIORITY_OPTIONS = [
  { value: '', label: 'All Priorities' },
  { value: 'LOW', label: 'Low' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'HIGH', label: 'High' },
]

export function TaskFilters({ filters, onChange, members = [] }) {
  const handleChange = useCallback(
    (key, value) => {
      onChange((prev) => ({
        ...prev,
        [key]: value || undefined, // Remove empty string keys so they aren't sent as query params
      }))
    },
    [onChange]
  )

  const hasFilters = Object.values(filters).some(Boolean)

  const clearFilters = useCallback(() => onChange({}), [onChange])

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {/* Search */}
      <div className="relative flex-1 min-w-[180px] max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
        <input
          value={filters.search || ''}
          onChange={(e) => handleChange('search', e.target.value)}
          placeholder="Search tasks..."
          className="input-base pl-8 py-2 text-xs h-9"
        />
      </div>

      {/* Status */}
      <select
        value={filters.status || ''}
        onChange={(e) => handleChange('status', e.target.value)}
        className="input-base py-2 text-xs h-9 w-auto min-w-[120px]"
      >
        {STATUS_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>

      {/* Priority */}
      <select
        value={filters.priority || ''}
        onChange={(e) => handleChange('priority', e.target.value)}
        className="input-base py-2 text-xs h-9 w-auto min-w-[130px]"
      >
        {PRIORITY_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>

      {/* Assignee */}
      <select
        value={filters.assigneeId || ''}
        onChange={(e) => handleChange('assigneeId', e.target.value)}
        className="input-base py-2 text-xs h-9 w-auto min-w-[130px]"
      >
        <option value="">All Assignees</option>
        {members.map(({ user }) => (
          <option key={user.id} value={user.id}>{user.name}</option>
        ))}
      </select>

      {/* Clear filters */}
      {hasFilters && (
        <button
          onClick={clearFilters}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-100 px-2.5 py-2 rounded-lg hover:bg-surface-700 transition-colors"
        >
          <X className="w-3.5 h-3.5" /> Clear
        </button>
      )}
    </div>
  )
}
