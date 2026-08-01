import apiClient from '@/shared/lib/axios'

export const projectsApi = {
  getAll: (params) => apiClient.get('/projects', { params }).then((r) => r.data),
  getMyProjects: (params) => apiClient.get('/projects/my-projects', { params }).then((r) => r.data),
  getBySlug: (slug) => apiClient.get(`/projects/${slug}`).then((r) => r.data),
  create: (data) => apiClient.post('/projects', data).then((r) => r.data),
  update: (id, data) => apiClient.patch(`/projects/${id}`, data).then((r) => r.data),
  delete: (id) => apiClient.delete(`/projects/${id}`).then((r) => r.data),
  addMembers: (id, userIds) => apiClient.post(`/projects/${id}/add-members`, { userIds }).then((r) => r.data),
  removeMembers: (id, userIds) => apiClient.delete(`/projects/${id}/remove-members`, { data: { userIds } }).then((r) => r.data),
}
