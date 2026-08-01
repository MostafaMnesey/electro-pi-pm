import { useMemo, useState, useCallback } from 'react'
import { Plus, LayoutGrid } from 'lucide-react'
import { useAuth } from '@/app/AuthContext'
import { useTasks } from '../hooks/useTasks'
import { TaskCard } from './TaskCard'
import { TaskFilters } from './TaskFilters'
import { TaskForm } from './TaskForm'
import { AssignTaskModal } from './AssignTaskModal'
import { Skeleton } from '@/shared/components/Skeleton'
import { ErrorMessage } from '@/shared/components/FormField'
import { Button } from '@/shared/components/Button'
import { extractApiError } from '@/shared/lib/utils'
import { statusConfig } from './StatusBadge'

const COLUMNS = ['TODO', 'IN_PROGRESS', 'DONE']

const COLUMN_STYLES = {
  TODO: 'border-t-slate-500',
  IN_PROGRESS: 'border-t-amber-500',
  DONE: 'border-t-emerald-500',
}

export function TaskBoard({ project, members }) {
  const { isAdmin } = useAuth()
  const [filters, setFilters] = useState({})
  const [createOpen, setCreateOpen] = useState(false)
  const [editTask, setEditTask] = useState(null)
  const [assignTask, setAssignTask] = useState(null)

  const { data, isLoading, error } = useTasks(project.id, filters)

  const tasks = data?.data?.data ?? []

  // useMemo: grouping is derived computation — memoize to avoid re-running on every render
  const grouped = useMemo(() => {
    const groups = { TODO: [], IN_PROGRESS: [], DONE: [] }
    tasks.forEach((t) => {
      if (groups[t.status]) groups[t.status].push(t)
    })
    return groups
  }, [tasks])

  // useCallback: passed as prop to memoized TaskCard children
  const handleEdit = useCallback((task) => setEditTask(task), [])
  const handleAssign = useCallback((task) => setAssignTask(task), [])

  if (error) {
    return <ErrorMessage message={extractApiError(error)} />
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-3 justify-between">
        <div className="flex items-center gap-2 text-slate-300">
          <LayoutGrid className="w-4 h-4" />
          <h2 className="font-semibold">Task Board</h2>
          <span className="text-xs text-slate-500 bg-surface-700 px-2 py-0.5 rounded-full">
            {tasks.length} tasks
          </span>
        </div>
        {isAdmin && (
          <Button size="sm" onClick={() => setCreateOpen(true)}>
            <Plus className="w-3.5 h-3.5" /> New Task
          </Button>
        )}
      </div>

      {/* Filters */}
      <TaskFilters filters={filters} onChange={setFilters} members={members} />

      {/* Kanban columns — side-by-side on desktop, stacked (overflow-x scrollable) on mobile */}
      <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-3">
        {COLUMNS.map((status) => {
          const colTasks = grouped[status]
          const config = statusConfig[status]

          return (
            <div
              key={status}
              className={`flex-shrink-0 w-72 md:w-auto bg-surface-900/50 rounded-xl border border-surface-700 border-t-2 ${COLUMN_STYLES[status]} flex flex-col`}
            >
              {/* Column header */}
              <div className="px-4 py-3 border-b border-surface-700 flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-300">{config.label}</span>
                <span className="text-xs text-slate-500 bg-surface-700 px-2 py-0.5 rounded-full">
                  {colTasks.length}
                </span>
              </div>

              {/* Cards */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3 max-h-[60vh] md:max-h-[calc(100vh-320px)]">
                {isLoading && (
                  <>
                    <Skeleton className="h-28" />
                    <Skeleton className="h-24" />
                  </>
                )}
                {!isLoading && colTasks.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <div className="text-slate-600 text-3xl mb-2">◈</div>
                    <p className="text-xs text-slate-600">No {config.label.toLowerCase()} tasks</p>
                  </div>
                )}
                {colTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    projectId={project.id}
                    onEdit={handleEdit}
                    onAssign={handleAssign}
                    members={members}
                  />
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Modals */}
      <TaskForm
        isOpen={createOpen || !!editTask}
        onClose={() => { setCreateOpen(false); setEditTask(null) }}
        task={editTask}
        projectId={project.id}
        members={members}
      />

      <AssignTaskModal
        isOpen={!!assignTask}
        onClose={() => setAssignTask(null)}
        task={assignTask}
        projectId={project.id}
        members={members}
      />
    </div>
  )
}
