import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { projectsApi } from '../api/projects.api'

export const projectKeys = {
  all: ['projects'],
  mine: () => ['projects', 'mine'],
  detail: (slug) => ['projects', slug],
}

export function useMyProjects(params) {
  return useQuery({
    queryKey: [...projectKeys.mine(), params],
    queryFn: () => projectsApi.getMyProjects(params),
  })
}

export function useAllProjects(params) {
  return useQuery({
    queryKey: [...projectKeys.all, params],
    queryFn: () => projectsApi.getAll(params),
  })
}

export function useProject(slug) {
  return useQuery({
    queryKey: projectKeys.detail(slug),
    queryFn: () => projectsApi.getBySlug(slug),
    enabled: !!slug,
  })
}

export function useCreateProject() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: projectsApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: projectKeys.all })
      qc.invalidateQueries({ queryKey: projectKeys.mine() })
    },
  })
}

export function useUpdateProject() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }) => projectsApi.update(id, data),
    onSuccess: (_, { slug }) => {
      qc.invalidateQueries({ queryKey: projectKeys.all })
      qc.invalidateQueries({ queryKey: projectKeys.mine() })
      if (slug) qc.invalidateQueries({ queryKey: projectKeys.detail(slug) })
    },
  })
}

export function useDeleteProject() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id) => projectsApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: projectKeys.all })
      qc.invalidateQueries({ queryKey: projectKeys.mine() })
    },
  })
}

export function useAddMembers(projectId, slug) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (userIds) => projectsApi.addMembers(projectId, userIds),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: projectKeys.detail(slug) })
    },
  })
}

export function useRemoveMembers(projectId, slug) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (userIds) => projectsApi.removeMembers(projectId, userIds),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: projectKeys.detail(slug) })
    },
  })
}
