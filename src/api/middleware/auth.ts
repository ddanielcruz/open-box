import { Request, Response, NextFunction } from 'express'
import { container } from 'tsyringe'

import { UnauthorizedError } from '@errors'
import { Encrypter } from '@services/cryptography/encrypter'

export interface Session {
  id: string
}

export const auth = async (request: Request, _response: Response, next: NextFunction) => {
  const token = request.headers['x-access-token'] as string
  if (!token) {
    throw new UnauthorizedError('Token not found.', 'TOKEN_NOT_FOUND')
  }

  const encrypter = container.resolve(Encrypter)
  const decryptedSession = await encrypter.decrypt<Session>(token)

  if (!decryptedSession) {
    throw new UnauthorizedError('Token expired.', 'TOKEN_EXPIRED')
  }

  request.session = decryptedSession
  next()
}
