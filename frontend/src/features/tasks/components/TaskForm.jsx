import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createTaskSchema, updateTaskSchema } from '../schemas/taskSchema'
import { useCreateTask, useUpdateTask } from '../hooks/useTasks'
import { Modal } from '@/shared/components/Modal'
import { Button } from '@/shared/components/Button'
import { FormField, ErrorMessage } from '@/shared/components/FormField'
import { extractApiError } from '@/shared/lib/utils'
import { getInitials } from '@/shared/lib/utils'

const PRIORITY_OPTIONS = ['LOW', 'MEDIUM', 'HIGH']

export function TaskForm({ isOpen, onClose, task, projectId, members = [] }) {
  const isEditing = !!task

  const { mutate: create, isPending: creating, error: createError } = useCreateTask(projectId)
  const { mutate: update, isPending: updating, error: updateError } = useUpdateTask(projectId)

  const isPending = creating || updating
  const error = createError || updateError

  const schema = isEditing ? updateTaskSchema : createTaskSchema

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      priority: 'MEDIUM',
      dueDate: '',
      assigneeId: '',
    },
  })

  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description || '',
        priority: task.priority,
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
      })
    } else {
      reset({ title: '', description: '', priority: 'MEDIUM', dueDate: '', assigneeId: '' })
    }
  }, [task, reset])

  const onSubmit = (data) => {
    if (isEditing) {
      update({ id: task.id, ...data }, { onSuccess: onClose })
    } else {
      create(data, { onSuccess: onClose })
    }
  }

  // Today's date string for min date on dueDate input
  const today = new Date().toISOString().split('T')[0]

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Task' : 'Create Task'}
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <ErrorMessage message={error ? extractApiError(error) : null} />

        <FormField label="Title" error={errors.title} required>
          <input
            {...register('title')}
            type="text"
            placeholder="e.g. Implement login page"
            className="input-base"
          />
        </FormField>

        <FormField label="Description" error={errors.description}>
          <textarea
            {...register('description')}
            rows={3}
            placeholder="Optional details..."
            className="input-base resize-none"
          />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Priority" error={errors.priority} required>
            <select {...register('priority')} className="input-base">
              {PRIORITY_OPTIONS.map((p) => (
                <option key={p} value={p}>{p.charAt(0) + p.slice(1).toLowerCase()}</option>
              ))}
            </select>
          </FormField>

          <FormField label="Due Date" error={errors.dueDate} required={!isEditing}>
            <input
              {...register('dueDate')}
              type="date"
              min={!isEditing ? today : undefined}
              className="input-base"
            />
          </FormField>
        </div>

        {/* Assignee — only shown on create */}
        {!isEditing && (
          <FormField label="Assignee" error={errors.assigneeId} required>
            <select {...register('assigneeId')} className="input-base">
              <option value="">Select a team member...</option>
              {members.map(({ user }) => (
                <option key={user.id} value={user.id}>
                  {user.name} — {user.email}
                </option>
              ))}
            </select>
          </FormField>
        )}

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" className="flex-1" isLoading={isPending}>
            {isEditing ? 'Save Changes' : 'Create Task'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
