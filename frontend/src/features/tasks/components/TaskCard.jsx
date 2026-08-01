import { memo, useCallback, useState } from 'react'
import { Calendar, User, Trash2, Edit2, UserCheck } from 'lucide-react'
import { useAuth } from '@/app/AuthContext'
import { StatusBadge, PriorityBadge } from './StatusBadge'
import { ConfirmDialog } from '@/shared/components/ConfirmDialog'
import { useDeleteTask, useUpdateTaskStatus } from '../hooks/useTasks'
import { formatDate, isOverdue, getInitials, cn } from '@/shared/lib/utils'

// Memoized: rendered inside lists per Kanban column — prevents re-renders from sibling updates
export const TaskCard = memo(function TaskCard({ task, projectId, onEdit, onAssign, members }) {
  const { user, isAdmin } = useAuth()
  const [confirmDelete, setConfirmDelete] = useState(false)

  const { mutate: deleteTask, isPending: deleting } = useDeleteTask(projectId)
  const { mutate: updateStatus, isPending: updatingStatus } = useUpdateTaskStatus(projectId)

  const isAssignee = task.assigneeId === user?.id
  const canChangeStatus = isAdmin || isAssignee
  const overdue = isOverdue(task.dueDate) && task.status !== 'DONE'

  // useCallback: passed as prop to child buttons — avoids recreating on every render
  const handleDelete = useCallback(() => {
    deleteTask(task.id, { onSuccess: () => setConfirmDelete(false) })
  }, [deleteTask, task.id])

  const handleStatusChange = useCallback(
    (e) => {
      if (canChangeStatus) updateStatus({ id: task.id, status: e.target.value })
    },
    [canChangeStatus, updateStatus, task.id]
  )

  return (
    <>
      <div className={cn(
        'glass-card p-4 space-y-3 hover:border-surface-500/70 transition-all duration-200 animate-fade-in',
        overdue && 'border-rose-700/30'
      )}>
        {/* Header */}
        <div className="flex items-start gap-2">
          <p className="flex-1 text-sm font-medium text-slate-200 leading-snug">{task.title}</p>
          {/* Admin actions */}
          {isAdmin && (
            <div className="flex gap-1 flex-shrink-0">
              <button
                onClick={() => onEdit(task)}
                title="Edit task"
                className="p-1 rounded text-slate-500 hover:text-brand-400 hover:bg-surface-700 transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onAssign(task)}
                title="Reassign task"
                className="p-1 rounded text-slate-500 hover:text-violet-400 hover:bg-surface-700 transition-colors"
              >
                <UserCheck className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setConfirmDelete(true)}
                title="Delete task"
                className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-900/20 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {task.description && (
          <p className="text-xs text-slate-500 line-clamp-2">{task.description}</p>
        )}

        {/* Badges */}
        <div className="flex flex-wrap gap-1.5">
          <PriorityBadge priority={task.priority} />
          {overdue && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border bg-rose-900/40 text-rose-300 border-rose-700/50">
              Overdue
            </span>
          )}
        </div>

        {/* Status select — disabled if not assignee and not admin */}
        <div>
          <select
            value={task.status}
            onChange={handleStatusChange}
            disabled={!canChangeStatus || updatingStatus}
            title={!canChangeStatus ? 'Only the assignee or admin can change status' : 'Change status'}
            className={cn(
              'w-full text-xs rounded-lg border px-2.5 py-1.5 bg-surface-700 transition-colors cursor-pointer',
              'focus:outline-none focus:ring-1 focus:ring-brand-500',
              task.status === 'TODO' && 'text-slate-300 border-slate-600/50',
              task.status === 'IN_PROGRESS' && 'text-amber-300 border-amber-700/50',
              task.status === 'DONE' && 'text-emerald-300 border-emerald-700/50',
              !canChangeStatus && 'opacity-50 cursor-not-allowed'
            )}
          >
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 text-xs text-slate-500 pt-1 border-t border-surface-700">
          <span className={cn('flex items-center gap-1', overdue && 'text-rose-400')}>
            <Calendar className="w-3 h-3" />
            {formatDate(task.dueDate)}
          </span>
          {task.assignee && (
            <span className="flex items-center gap-1.5 ml-auto">
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-brand-500/40 to-violet-600/40 flex items-center justify-center text-[9px] font-bold text-brand-300">
                {getInitials(task.assignee.name)}
              </div>
              <span className="truncate max-w-[80px]">{task.assignee.name}</span>
            </span>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={handleDelete}
        isLoading={deleting}
        title="Delete task?"
        description={`"${task.title}" will be permanently deleted.`}
        confirmLabel="Delete Task"
      />
    </>
  )
})
