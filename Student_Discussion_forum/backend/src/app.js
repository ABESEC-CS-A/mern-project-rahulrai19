import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'

import authRoutes from './routes/authRoutes.js'
import threadRoutes from './routes/threadRoutes.js'
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js'

const app = express()

const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map(origin => origin.trim())
  : ['http://localhost:5173']

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}))

app.use(helmet())
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'))
}

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.use('/api/auth', authRoutes)
app.use('/api/threads', threadRoutes)

app.use(notFoundHandler)
app.use(errorHandler)

export default app

