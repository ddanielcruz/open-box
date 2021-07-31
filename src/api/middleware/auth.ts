import { Request, Response, NextFunction } from 'express'
import { container } from 'tsyringe'

import { UnauthorizedError } from '@errors'
import { Encrypter } from '@services/cryptography/encrypter'

export interface AuthParams {
  required?: boolean
}

export interface Session {
  id: string
}

export const auth =
  (params?: AuthParams) => async (request: Request, _response: Response, next: NextFunction) => {
    const { required = true } = params || {}
    const token = request.headers['x-access-token']?.toString()

    if (!token) {
      if (required) {
        throw new UnauthorizedError('Token not found.', 'TOKEN_NOT_FOUND')
      }

      return next()
    }

    const encrypter = container.resolve(Encrypter)
    const decryptedSession = await encrypter.decrypt<Session>(token)

    if (!decryptedSession) {
      throw new UnauthorizedError('Token expired.', 'TOKEN_EXPIRED')
    }

    request.session = decryptedSession
    next()
  }
