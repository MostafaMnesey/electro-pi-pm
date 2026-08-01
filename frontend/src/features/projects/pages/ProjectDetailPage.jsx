import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, FolderKanban, Users, Calendar } from 'lucide-react'
import { useProject } from '../hooks/useProjects'
import { MemberList } from '../components/MemberList'
import { TaskBoard } from '@/features/tasks/components/TaskBoard'
import { Skeleton } from '@/shared/components/Skeleton'
import { ErrorMessage } from '@/shared/components/FormField'
import { Button } from '@/shared/components/Button'
import { formatDate, extractApiError } from '@/shared/lib/utils'

export default function ProjectDetailPage() {
  const { slug } = useParams()
  const navigate = useNavigate()

  const { data, isLoading, isError, error } = useProject(slug)

  const project = data?.data

  if (isLoading) {
    return (
      <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-80" />
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-3">
            <Skeleton className="h-10" />
            <Skeleton className="h-96" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-8 w-24" />
            {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-12" />)}
          </div>
        </div>
      </div>
    )
  }

  if (isError || !project) {
    return (
      <div className="p-4 md:p-6">
        <ErrorMessage message={isError ? extractApiError(error) : 'Project not found'} />
        <Button variant="ghost" className="mt-4" onClick={() => navigate('/projects')}>
          <ArrowLeft className="w-4 h-4" /> Back to Projects
        </Button>
      </div>
    )
  }

  const members = project.members ?? []

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Back nav */}
      <button
        onClick={() => navigate('/projects')}
        className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-100 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        All Projects
      </button>

      {/* Project header */}
      <div className="glass-card p-5 md:p-6">
        <div className="flex flex-wrap items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-600/30 to-violet-600/30 border border-brand-600/20 flex items-center justify-center flex-shrink-0">
            <FolderKanban className="w-6 h-6 text-brand-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl md:text-2xl font-bold text-slate-100">{project.name}</h1>
            {project.description && (
              <p className="text-slate-400 text-sm mt-1">{project.description}</p>
            )}
            <div className="flex flex-wrap gap-4 mt-3 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                {members.length} member{members.length !== 1 ? 's' : ''}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                Created {formatDate(project.createdAt)}
              </span>
              <span>Owner: <span className="text-slate-300">{project.owner?.name}</span></span>
            </div>
          </div>
        </div>
      </div>

      {/* Main grid: task board + sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Task board — takes up 3/4 on desktop */}
        <div className="lg:col-span-3">
          <div className="glass-card p-4 md:p-5">
            <TaskBoard project={project} members={members} />
          </div>
        </div>

        {/* Sidebar: member list */}
        <div className="lg:col-span-1">
          <div className="glass-card p-4 md:p-5">
            <MemberList project={project} />
          </div>
        </div>
      </div>
    </div>
  )
}
