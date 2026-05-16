import type { NextFunction, Request, Response } from 'express'
import { ZodError } from 'zod'
import { HttpError } from '../utils/httpError.js'

export function errorHandler(
  error: unknown,
  _request: Request,
  response: Response,
  _next: NextFunction,
) {
  if (error instanceof ZodError) {
    response.status(400).json({
      error: 'ValidationError',
      message: 'Request validation failed.',
      details: error.flatten(),
    })
    return
  }

  if (error instanceof HttpError) {
    response.status(error.statusCode).json({
      error: error.code,
      message: error.message,
      details: error.details,
    })
    return
  }

  console.error(error)

  response.status(500).json({
    error: 'InternalServerError',
    message: 'An unexpected error occurred.',
  })
}
