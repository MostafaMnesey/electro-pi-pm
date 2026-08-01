import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApi } from '../api/admin.api'

export const userKeys = {
  all: (params) => ['users', params],
  pending: (params) => ['users', 'pending', params],
}

export function useAllUsers(params) {
  return useQuery({
    queryKey: userKeys.all(params),
    queryFn: () => adminApi.getAllUsers(params),
  })
}

export function usePendingUsers(params) {
  return useQuery({
    queryKey: userKeys.pending(params),
    queryFn: () => adminApi.getPendingUsers(params),
  })
}

export function useApproveUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id) => adminApi.approveUser(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

export function useToggleActive() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id) => adminApi.toggleActive(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] })
    },
  })
}
