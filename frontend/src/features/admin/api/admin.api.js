import apiClient from '@/shared/lib/axios'

export const adminApi = {
  getAllUsers: (params) => apiClient.get('/user', { params }).then((r) => r.data),
  getPendingUsers: (params) => apiClient.get('/user/pending-approval', { params }).then((r) => r.data),
  approveUser: (id) => apiClient.patch(`/user/${id}/approve`, {}).then((r) => r.data),
  toggleActive: (id) => apiClient.patch(`/user/${id}/active`, {}).then((r) => r.data),
  getProfile: () => apiClient.get('/user/profile').then((r) => r.data),
}
