import { AppError } from './app-error'

export class InvalidTokenError extends AppError {
  readonly statusCode = 406

  constructor() {
    super('Invalid token.', 'INVALID_TOKEN')
    Object.setPrototypeOf(this, InvalidTokenError.prototype)
  }
}
