import apiClient from '@/shared/lib/axios'

export const authApi = {
  signup: (data) => apiClient.post('/authentication/signup', data).then((r) => r.data),
  signin: (data) => apiClient.post('/authentication/signin', data).then((r) => r.data),
  refreshToken: (refreshToken) =>
    apiClient.post('/authentication/refresh-token', { refreshToken }).then((r) => r.data),
  getProfile: () => apiClient.get('/user/profile').then((r) => r.data),
}
