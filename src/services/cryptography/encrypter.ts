import jwt, { TokenExpiredError } from 'jsonwebtoken'

import { InvalidTokenError } from '@errors'

export class Encrypter {
  constructor(private readonly secret: string) {}

  decrypt<T = any>(value: string): Promise<T> {
    return new Promise((resolve, reject) => {
      try {
        const decryptedValue: any = jwt.verify(value, this.secret)
        resolve(decryptedValue as T)
      } catch (error) {
        if (error instanceof TokenExpiredError) {
          return resolve(null)
        }

        reject(new InvalidTokenError())
      }
    })
  }

  encrypt(value: any, expiresIn: number | string): Promise<string> {
    return new Promise(resolve => {
      const accessToken = jwt.sign(value, this.secret, { expiresIn })
      resolve(accessToken)
    })
  }
}
