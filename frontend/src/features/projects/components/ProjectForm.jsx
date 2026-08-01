import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createProjectSchema } from '../schemas/projectSchema'
import { useCreateProject, useUpdateProject } from '../hooks/useProjects'
import { Button } from '@/shared/components/Button'
import { FormField, ErrorMessage } from '@/shared/components/FormField'
import { Modal } from '@/shared/components/Modal'
import { extractApiError } from '@/shared/lib/utils'

export function ProjectForm({ isOpen, onClose, project }) {
  const isEditing = !!project
  const { mutate: create, isPending: creating, error: createError } = useCreateProject()
  const { mutate: update, isPending: updating, error: updateError } = useUpdateProject()

  const isPending = creating || updating
  const error = createError || updateError

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createProjectSchema),
    defaultValues: { name: '', description: '' },
  })

  // Populate form when editing
  useEffect(() => {
    if (project) reset({ name: project.name, description: project.description || '' })
    else reset({ name: '', description: '' })
  }, [project, reset])

  const onSubmit = (data) => {
    if (isEditing) {
      update({ id: project.id, slug: project.slug, ...data }, { onSuccess: onClose })
    } else {
      create(data, { onSuccess: onClose })
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Edit Project' : 'Create Project'}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <ErrorMessage message={error ? extractApiError(error) : null} />

        <FormField label="Project Name" error={errors.name} required>
          <input
            {...register('name')}
            type="text"
            placeholder="e.g. E-Commerce Redesign"
            className="input-base"
          />
        </FormField>

        <FormField label="Description" error={errors.description}>
          <textarea
            {...register('description')}
            rows={3}
            placeholder="What is this project about? (optional)"
            className="input-base resize-none"
          />
        </FormField>

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" className="flex-1" isLoading={isPending}>
            {isEditing ? 'Save Changes' : 'Create Project'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
