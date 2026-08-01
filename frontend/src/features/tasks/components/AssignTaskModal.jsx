import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { assignTaskSchema } from '../schemas/taskSchema'
import { useAssignTask } from '../hooks/useTasks'
import { Modal } from '@/shared/components/Modal'
import { Button } from '@/shared/components/Button'
import { FormField, ErrorMessage } from '@/shared/components/FormField'
import { extractApiError, getInitials } from '@/shared/lib/utils'

export function AssignTaskModal({ isOpen, onClose, task, projectId, members = [] }) {
  const { mutate: assignTask, isPending, error } = useAssignTask(projectId)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(assignTaskSchema),
    defaultValues: { assigneeId: task?.assigneeId || '' },
  })

  const onSubmit = ({ assigneeId }) => {
    assignTask({ id: task.id, assigneeId }, {
      onSuccess: () => {
        reset()
        onClose()
      },
    })
  }

  if (!task) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Reassign Task" size="sm">
      <div className="space-y-4">
        <div className="px-3 py-2.5 rounded-lg bg-surface-700/50 text-sm text-slate-300">
          <span className="text-slate-500 text-xs block mb-0.5">Task</span>
          {task.title}
        </div>

        <ErrorMessage message={error ? extractApiError(error) : null} />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField label="Assign to" error={errors.assigneeId} required>
            <select {...register('assigneeId')} className="input-base" defaultValue={task.assigneeId || ''}>
              <option value="">Select a project member...</option>
              {members.map(({ user }) => (
                <option key={user.id} value={user.id}>
                  {user.name} — {user.email}
                  {user.id === task.assigneeId ? ' (current)' : ''}
                </option>
              ))}
            </select>
          </FormField>

          <div className="flex gap-3">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" isLoading={isPending}>
              Reassign
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  )
}
