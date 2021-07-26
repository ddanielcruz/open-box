import jwt, { TokenExpiredError } from 'jsonwebtoken'

import { Encrypter } from '@services/cryptography/encrypter'

jest.mock('jsonwebtoken', function () {
  return Object.assign(
    { ...jest.requireActual('jsonwebtoken') },
    {
      sign: () => 'any-token',
      verify: () => 'any-value'
    }
  )
})

const makeSut = () => {
  const secret = 'any-secret'
  const sut = new Encrypter(secret)
  return { sut, secret }
}

const EXPIRES_IN = '1d'

describe('Encrypter', () => {
  test('should call sign with correct values', async () => {
    const { sut, secret } = makeSut()
    const signSpy = jest.spyOn(jwt, 'sign')
    await sut.encrypt('any-value', EXPIRES_IN)
    expect(signSpy).toHaveBeenCalledWith('any-value', secret, { expiresIn: EXPIRES_IN })
  })

  test('should return a token on sign success', async () => {
    const { sut } = makeSut()
    const token = await sut.encrypt('any-value', EXPIRES_IN)
    expect(token).toBe('any-token')
  })

  test('should call verify with correct values', async () => {
    const { sut, secret } = makeSut()
    const verifySpy = jest.spyOn(jwt, 'verify')
    await sut.decrypt('any-token')
    expect(verifySpy).toHaveBeenCalledWith('any-token', secret)
  })

  test('should return a value on decrypt success', async () => {
    const { sut } = makeSut()
    const value = await sut.decrypt('any-token')
    expect(value).toBe('any-value')
  })

  test('should return null when encrypted value is expired', async () => {
    const { sut } = makeSut()
    jest.spyOn(jwt, 'verify').mockImplementationOnce(() => {
      throw new TokenExpiredError('', new Date())
    })
    const value = await sut.decrypt('any-token')
    expect(value).toBeFalsy()
  })

  test('should throw if error is not expected', async () => {
    const { sut } = makeSut()
    jest.spyOn(jwt, 'verify').mockImplementationOnce(() => {
      throw new Error('')
    })
    const promise = sut.decrypt('any-token')
    await expect(promise).rejects.toThrow()
  })
})
