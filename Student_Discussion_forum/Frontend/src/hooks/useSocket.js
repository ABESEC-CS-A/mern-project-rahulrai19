import { useEffect, useRef } from 'react'
import { io } from 'socket.io-client'
import { useAuth } from '../context/AuthContext'

export const useSocket = () => {
  const { token } = useAuth()
  const socketRef = useRef(null)

  useEffect(() => {
    if (!token) {
      socketRef.current?.disconnect()
      socketRef.current = null
      return
    }

    const url = import.meta.env.VITE_SOCKET_URL || (import.meta.env.VITE_API_URL?.replace('/api', '') ?? 'http://localhost:5000')

    const socket = io(url, {
      auth: { token }
    })

    socketRef.current = socket

    return () => {
      socket.disconnect()
    }
  }, [token])

  return socketRef.current
}

