import { memo, useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FolderKanban, Users, CheckSquare, MoreVertical, Edit2, Trash2, Calendar } from 'lucide-react'
import { useAuth } from '@/app/AuthContext'
import { ConfirmDialog } from '@/shared/components/ConfirmDialog'
import { useDeleteProject } from '../hooks/useProjects'
import { formatDate, cn } from '@/shared/lib/utils'

// Wrapped in React.memo because rendered in a list — prevents re-renders when siblings update
export const ProjectCard = memo(function ProjectCard({ project, onEdit }) {
  const navigate = useNavigate()
  const { isAdmin } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const { mutate: deleteProject, isPending: deleting } = useDeleteProject()

  const handleNavigate = useCallback(() => {
    navigate(`/projects/${project.slug}`)
  }, [navigate, project.slug])

  const handleDelete = useCallback(() => {
    deleteProject(project.id, { onSuccess: () => setConfirmDelete(false) })
  }, [deleteProject, project.id])

  const taskCount = project.tasks?.length ?? 0
  const memberCount = project.members?.length ?? 0
  const doneTasks = project.tasks?.filter((t) => t.status === 'DONE').length ?? 0
  const progress = taskCount > 0 ? Math.round((doneTasks / taskCount) * 100) : 0

  return (
    <>
      <div
        className="glass-card p-5 cursor-pointer hover:border-brand-600/40 hover:shadow-lg hover:shadow-brand-900/20 transition-all duration-200 group animate-fade-in"
        onClick={handleNavigate}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-600/30 to-violet-600/30 border border-brand-600/20 flex items-center justify-center flex-shrink-0">
              <FolderKanban className="w-4 h-4 text-brand-400" />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-slate-100 truncate group-hover:text-brand-300 transition-colors">
                {project.name}
              </h3>
              <p className="text-xs text-slate-500">by {project.owner?.name || 'Unknown'}</p>
            </div>
          </div>

          {/* Actions menu — only for admins */}
          {isAdmin && (
            <div className="relative flex-shrink-0" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setMenuOpen((p) => !p)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-surface-700 opacity-0 group-hover:opacity-100 transition-all"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-8 z-20 w-40 bg-surface-800 border border-surface-600 rounded-lg shadow-xl overflow-hidden animate-slide-up">
                  <button
                    onClick={() => { setMenuOpen(false); onEdit(project) }}
                    className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-slate-300 hover:bg-surface-700 hover:text-slate-100 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => { setMenuOpen(false); setConfirmDelete(true) }}
                    className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-rose-400 hover:bg-rose-900/20 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Description */}
        {project.description && (
          <p className="text-sm text-slate-400 mb-4 line-clamp-2">{project.description}</p>
        )}

        {/* Progress bar */}
        {taskCount > 0 && (
          <div className="mb-4">
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="h-1.5 bg-surface-700 rounded-full overflow-hidden">
              <div
                className={cn(
                  'h-full rounded-full transition-all duration-500',
                  progress === 100 ? 'bg-emerald-500' : 'bg-brand-500'
                )}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Stats footer */}
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" />
            {memberCount} member{memberCount !== 1 ? 's' : ''}
          </span>
          <span className="flex items-center gap-1.5">
            <CheckSquare className="w-3.5 h-3.5" />
            {taskCount} task{taskCount !== 1 ? 's' : ''}
          </span>
          <span className="flex items-center gap-1.5 ml-auto">
            <Calendar className="w-3.5 h-3.5" />
            {formatDate(project.createdAt)}
          </span>
        </div>
      </div>

      <ConfirmDialog
        isOpen={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={handleDelete}
        isLoading={deleting}
        title="Delete project?"
        description={`"${project.name}" and all its tasks will be permanently deleted.`}
        confirmLabel="Delete Project"
      />
    </>
  )
})
