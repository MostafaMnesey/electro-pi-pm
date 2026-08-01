import { createContext, useContext, useState, useCallback } from 'react'

const AuthContext = createContext(null)

function loadAuth() {
  try {
    const user = JSON.parse(localStorage.getItem('user') || 'null')
    const accessToken = localStorage.getItem('accessToken')
    return { user, accessToken }
  } catch {
    return { user: null, accessToken: null }
  }
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(loadAuth)

  const login = useCallback(({ accessToken, refreshToken, role, permissions, ...rest }) => {
    const user = { role, permissions, ...rest }
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
    localStorage.setItem('user', JSON.stringify(user))
    setAuth({ user, accessToken })
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    setAuth({ user: null, accessToken: null })
  }, [])

  const isAdmin = auth.user?.role === 'admin' || auth.user?.role === 'super_admin'

  const hasPermission = useCallback(
    (code) => auth.user?.permissions?.some((p) => p.code === code) ?? false,
    [auth.user]
  )

  return (
    <AuthContext.Provider value={{ ...auth, login, logout, isAdmin, hasPermission }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
