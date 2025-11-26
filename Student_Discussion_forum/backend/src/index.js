import http from 'http'
import dotenv from 'dotenv'

import app from './app.js'
import connectDB from './config/db.js'
import { initSocket } from './sockets/socketServer.js'

dotenv.config()

const port = process.env.PORT || 5000

const server = http.createServer(app)

const startServer = async () => {
  try {
    await connectDB()
    initSocket(server)

    server.listen(port, () => {
      console.log(`🚀 Server listening on port ${port}`)
    })
  } catch (error) {
    console.error('Server failed to start', error)
    process.exit(1)
  }
}

startServer()

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason)
})

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error)
})

