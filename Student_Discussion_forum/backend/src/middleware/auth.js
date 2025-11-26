import jwt from 'jsonwebtoken'
import { StatusCodes } from 'http-status-codes'
import User from '../models/User.js'

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || ''
    const token = authHeader.startsWith('Bearer ')
      ? authHeader.substring(7)
      : null

    if (!token) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Authentication token missing' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const user = await User.findById(decoded.sub)
    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'User not found' })
    }

    req.user = user
    next()
  } catch (error) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid or expired token' })
  }
}

