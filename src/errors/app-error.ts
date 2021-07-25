export abstract class AppError extends Error {
  abstract readonly statusCode: number

  constructor(message: string, readonly code: string, readonly data?: any) {
    super(message)
    Object.setPrototypeOf(this, AppError.prototype)
  }

  serialize() {
    return {
      error: this.message,
      code: this.code,
      data: this.data
    }
  }
}
