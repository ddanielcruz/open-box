/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from 'express'
import { container } from 'tsyringe'

import { AppError } from '@errors'
import { RemoveImage } from '@services/storage/remove-image'

const removeImage = container.resolve(RemoveImage)

export const errorHandler = async (
  error: Error,
  request: Request,
  response: Response,
  _next: NextFunction
) => {
  if (request.file || request.files) {
    const files = request.file ? [request.file] : Object.values(request.files)
    for (const file of files) {
      try {
        await removeImage.execute(file)
      } catch (error) {
        console.error(`Failed to remove image "${file?.key}".`, error)
      }
    }
  }

  if (error instanceof AppError) {
    return response.status(error.statusCode).send(error.serialize())
  }

  return response.status(500).json({
    error: error.message,
    code: 'UNKNOWN_ERROR',
    data: error.stack
  })
}
