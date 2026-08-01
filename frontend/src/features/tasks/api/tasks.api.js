import apiClient from '@/shared/lib/axios'

export const tasksApi = {
  getProjectTasks: (projectId, params) =>
    apiClient.get(`/tasks/projects/${projectId}/tasks`, { params }).then((r) => r.data),
  getById: (id) => apiClient.get(`/tasks/tasks/${id}`).then((r) => r.data),
  create: (projectId, data) =>
    apiClient.post(`/tasks/projects/${projectId}/tasks`, data).then((r) => r.data),
  update: (id, data) => apiClient.patch(`/tasks/tasks/${id}`, data).then((r) => r.data),
  updateStatus: (id, status) =>
    apiClient.patch(`/tasks/tasks/${id}/status`, { status }).then((r) => r.data),
  assign: (id, assigneeId) =>
    apiClient.patch(`/tasks/tasks/${id}/assign`, { assigneeId }).then((r) => r.data),
  delete: (id) => apiClient.delete(`/tasks/tasks/${id}`).then((r) => r.data),
}
