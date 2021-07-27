/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from 'express'

import { AppError } from '@errors'

export const errorHandler = (
  error: Error,
  _request: Request,
  response: Response,
  _next: NextFunction
) => {
  if (error instanceof AppError) {
    return response.status(error.statusCode).send(error.serialize())
  }

  return response.status(500).json({
    error: error.message,
    code: 'UNKNOWN_ERROR',
    data: error.stack
  })
}
