import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/app/AuthContext'
import { authApi } from '../api/auth.api'

export function useLogin() {
  const { login } = useAuth()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: authApi.signin,
    onSuccess: (data) => {
      // data.data contains { accessToken, refreshToken, role, permissions }
      login(data.data)
      navigate('/projects')
    },
  })
}

export function useRegister() {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: authApi.signup,
    onSuccess: () => {
      navigate('/login', { state: { registered: true } })
    },
  })
}
