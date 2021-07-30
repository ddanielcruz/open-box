import { AppError } from './app-error'

export class ForbiddenError extends AppError {
  statusCode = 403

  constructor(message?: string, errorCode?: string) {
    super(message ?? "You don't have permission to perform this action.", errorCode ?? 'FORBIDDEN')
    Object.setPrototypeOf(this, ForbiddenError.prototype)
  }
}
