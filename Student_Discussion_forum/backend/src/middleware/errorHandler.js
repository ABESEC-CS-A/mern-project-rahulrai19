import { StatusCodes, getReasonPhrase } from 'http-status-codes'

export const notFoundHandler = (req, res, next) => {
  res.status(StatusCodes.NOT_FOUND).json({
    message: `Route ${req.originalUrl} not found`
  })
}

export const errorHandler = (err, req, res, next) => {
  const status = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR
  const message = err.message || getReasonPhrase(status)

  console.error('API Error:', err)

  res.status(status).json({
    message,
    details: err.details ?? undefined
  })
}

