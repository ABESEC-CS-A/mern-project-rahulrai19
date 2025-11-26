import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { loginRequest, registerRequest } from '../api/auth'

const AuthContext = createContext(null)

const tokenKey = 'forum_token'
const userKey = 'forum_user'

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem(tokenKey))
  const [user, setUser] = useState(() => {
    const cached = localStorage.getItem(userKey)
    return cached ? JSON.parse(cached) : null
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (token) {
      localStorage.setItem(tokenKey, token)
    } else {
      localStorage.removeItem(tokenKey)
    }
  }, [token])

  useEffect(() => {
    if (user) {
      localStorage.setItem(userKey, JSON.stringify(user))
    } else {
      localStorage.removeItem(userKey)
    }
  }, [user])

  const authenticate = async (mode, payload) => {
    setError(null)
    setLoading(true)
    try {
      const handler = mode === 'register' ? registerRequest : loginRequest
      const { data } = await handler(payload)
      setToken(data.token)
      setUser(data.user)
      return data
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setToken(null)
    setUser(null)
  }

  const value = useMemo(() => ({
    token,
    user,
    loading,
    error,
    login: (payload) => authenticate('login', payload),
    register: (payload) => authenticate('register', payload),
    logout
  }), [token, user, loading, error])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

