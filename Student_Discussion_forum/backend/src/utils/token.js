import jwt from 'jsonwebtoken'

export const generateAccessToken = (user) => {
  const payload = {
    sub: user._id.toString(),
    email: user.email,
    role: user.role
  }

  const expiresIn = process.env.JWT_EXPIRES_IN || '7d'

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn })
}

