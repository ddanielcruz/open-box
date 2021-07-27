import { AppError } from './app-error'

export class UnauthorizedError extends AppError {
  readonly statusCode = 401

  constructor(message: string, code = 'UNAUTHORIZED') {
    super(message, code)
    Object.setPrototypeOf(this, UnauthorizedError.prototype)
  }
}
