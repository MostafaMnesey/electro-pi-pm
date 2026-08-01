import { useState, useCallback } from 'react'
import { Plus, FolderKanban, Search } from 'lucide-react'
import { useAuth } from '@/app/AuthContext'
import { useMyProjects, useAllProjects } from '../hooks/useProjects'
import { ProjectCard } from '../components/ProjectCard'
import { ProjectForm } from '../components/ProjectForm'
import { Button } from '@/shared/components/Button'
import { CardSkeleton } from '@/shared/components/Skeleton'
import { ErrorMessage } from '@/shared/components/FormField'
import { extractApiError } from '@/shared/lib/utils'

export default function ProjectListPage() {
  const { isAdmin } = useAuth()
  const [search, setSearch] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editProject, setEditProject] = useState(null)

  // ADMINs see all projects; MEMBERs see only their joined projects
  const query = isAdmin
    ? useAllProjects({ search: search || undefined })
    : useMyProjects({ search: search || undefined })

  const { data, isLoading, error, isError } = query

  const rawItems = data?.data?.data ?? []
  // getMyProjects returns ProjectMember[], not Project[] — unwrap if needed
  const projects = rawItems.map((item) => item.project ?? item)

  const handleEdit = useCallback((project) => setEditProject(project), [])

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Page header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-100 flex items-center gap-2">
            <FolderKanban className="w-6 h-6 text-brand-400" />
            {isAdmin ? 'All Projects' : 'My Projects'}
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            {isAdmin ? 'Manage all team projects' : 'Projects you are a member of'}
          </p>
        </div>
        {isAdmin && (
          <Button onClick={() => setFormOpen(true)}>
            <Plus className="w-4 h-4" /> New Project
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search projects..."
          className="input-base pl-9"
        />
      </div>

      {/* Error state */}
      {isError && <ErrorMessage message={extractApiError(error)} />}

      {/* Loading state */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !isError && projects.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-surface-800 border border-surface-700 flex items-center justify-center">
            <FolderKanban className="w-8 h-8 text-slate-600" />
          </div>
          <div>
            <p className="text-slate-300 font-medium">No projects yet</p>
            <p className="text-slate-500 text-sm mt-1">
              {isAdmin ? 'Create your first project to get started.' : 'Ask an admin to add you to a project.'}
            </p>
          </div>
          {isAdmin && (
            <Button onClick={() => setFormOpen(true)}>
              <Plus className="w-4 h-4" /> Create Project
            </Button>
          )}
        </div>
      )}

      {/* Project grid */}
      {!isLoading && projects.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} onEdit={handleEdit} />
          ))}
        </div>
      )}

      {/* Create/edit form modal */}
      <ProjectForm
        isOpen={formOpen || !!editProject}
        onClose={() => { setFormOpen(false); setEditProject(null) }}
        project={editProject}
      />
    </div>
  )
}
