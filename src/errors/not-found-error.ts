import { AppError } from './app-error'

export class NotFoundError extends AppError {
  readonly statusCode = 404

  constructor(message: string) {
    super(message, 'NOT_FOUND')
    Object.setPrototypeOf(this, NotFoundError.prototype)
  }
}
