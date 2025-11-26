import { StatusCodes } from 'http-status-codes'
import User from '../models/User.js'
import { generateAccessToken } from '../utils/token.js'
import { loginSchema, registerSchema } from '../validators/authSchemas.js'

export const register = async (req, res, next) => {
  try {
    const payload = registerSchema.parse(req.body)

    const existing = await User.findOne({ email: payload.email })
    if (existing) {
      return res.status(StatusCodes.CONFLICT).json({ message: 'Email already registered' })
    }

    const avatarColor = `#${Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0')}`

    const user = await User.create({ ...payload, avatarColor })
    const token = generateAccessToken(user)

    res.status(StatusCodes.CREATED).json({
      token,
      user: user.toSafeJSON()
    })
  } catch (error) {
    next(error)
  }
}

export const login = async (req, res, next) => {
  try {
    const payload = loginSchema.parse(req.body)

    const user = await User.findOne({ email: payload.email })
    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid credentials' })
    }

    const isValid = await user.comparePassword(payload.password)
    if (!isValid) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid credentials' })
    }

    const token = generateAccessToken(user)

    user.lastSeenAt = new Date()
    await user.save()

    res.json({
      token,
      user: user.toSafeJSON()
    })
  } catch (error) {
    next(error)
  }
}

