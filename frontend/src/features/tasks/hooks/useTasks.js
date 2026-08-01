import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { tasksApi } from '../api/tasks.api'

export const taskKeys = {
  all: (projectId) => ['tasks', projectId],
  filtered: (projectId, filters) => ['tasks', projectId, filters],
  detail: (id) => ['task', id],
}

export function useTasks(projectId, filters = {}) {
  return useQuery({
    queryKey: taskKeys.filtered(projectId, filters),
    queryFn: () => tasksApi.getProjectTasks(projectId, filters),
    enabled: !!projectId,
  })
}

export function useTask(id) {
  return useQuery({
    queryKey: taskKeys.detail(id),
    queryFn: () => tasksApi.getById(id),
    enabled: !!id,
  })
}

export function useCreateTask(projectId) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data) => tasksApi.create(projectId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: taskKeys.all(projectId) }),
  })
}

export function useUpdateTask(projectId) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }) => tasksApi.update(id, data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: taskKeys.all(projectId) })
      qc.invalidateQueries({ queryKey: taskKeys.detail(id) })
    },
  })
}

export function useUpdateTaskStatus(projectId) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }) => tasksApi.updateStatus(id, status),
    // Optimistic update for instant board feedback
    onMutate: async ({ id, status }) => {
      await qc.cancelQueries({ queryKey: taskKeys.all(projectId) })
      const prev = qc.getQueriesData({ queryKey: taskKeys.all(projectId) })
      qc.setQueriesData({ queryKey: taskKeys.all(projectId) }, (old) => {
        if (!old?.data?.data) return old
        return {
          ...old,
          data: {
            ...old.data,
            data: old.data.data.map((t) => (t.id === id ? { ...t, status } : t)),
          },
        }
      })
      return { prev }
    },
    onError: (_, __, ctx) => {
      // Roll back on error
      if (ctx?.prev) {
        ctx.prev.forEach(([key, data]) => qc.setQueryData(key, data))
      }
    },
    onSettled: () => qc.invalidateQueries({ queryKey: taskKeys.all(projectId) }),
  })
}

export function useAssignTask(projectId) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, assigneeId }) => tasksApi.assign(id, assigneeId),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: taskKeys.all(projectId) })
      qc.invalidateQueries({ queryKey: taskKeys.detail(id) })
    },
  })
}

export function useDeleteTask(projectId) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id) => tasksApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: taskKeys.all(projectId) }),
  })
}
