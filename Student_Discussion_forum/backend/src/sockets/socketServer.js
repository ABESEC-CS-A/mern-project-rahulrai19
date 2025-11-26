import { Server } from 'socket.io'
import jwt from 'jsonwebtoken'
import Thread from '../models/Thread.js'

let io

export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL?.split(',') ?? ['http://localhost:5173'],
      credentials: true
    }
  })

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token
    if (!token) {
      socket.userId = null
      return next()
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      socket.userId = decoded.sub
      next()
    } catch (error) {
      next(new Error('Invalid token'))
    }
  })

  io.on('connection', (socket) => {
    socket.on('thread:join', (threadId) => {
      socket.join(`thread:${threadId}`)
    })

    socket.on('thread:leave', (threadId) => {
      socket.leave(`thread:${threadId}`)
    })

    socket.on('thread:message', async ({ threadId, body }) => {
      if (!socket.userId) return
      if (!body?.trim()) return

      const thread = await Thread.findById(threadId)
      if (!thread || thread.isClosed) return

      const message = {
        author: socket.userId,
        body
      }

      thread.messages.push(message)
      thread.participants.addToSet(socket.userId)
      await thread.save()
      await thread.populate('messages.author', 'fullName avatarColor')

      const latestMessage = thread.messages[thread.messages.length - 1]
      io.to(`thread:${threadId}`).emit('message:created', { threadId, message: latestMessage })
      io.emit('thread:activity', { threadId, lastActivityAt: thread.lastActivityAt })
    })
  })

  console.log('✅ WebSocket server ready')
}

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io instance not initialized')
  }
  return io
}

