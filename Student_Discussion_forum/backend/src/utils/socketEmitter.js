import { getIO } from '../sockets/socketServer.js'

export const emitThreadCreated = (thread) => {
  const io = getIO()
  io.emit('thread:created', thread)
}

export const emitMessageCreated = (threadId, message) => {
  const io = getIO()
  io.to(`thread:${threadId}`).emit('message:created', { threadId, message })
  io.emit('thread:activity', { threadId, lastActivityAt: new Date().toISOString() })
}

