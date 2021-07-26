import bcrypt from 'bcrypt'

import { Hasher } from '@services/cryptography/hasher'

jest.mock('bcrypt', () => ({
  hash: async () => 'hashed-value',
  compare: async () => true
}))

const makeSut = () => {
  const salt = 1
  const sut = new Hasher(salt)

  return { sut, salt }
}

describe('Hasher', () => {
  test('should call hash with correct values', async () => {
    const { sut, salt } = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.hash('any-value')
    expect(hashSpy).toHaveBeenCalledWith('any-value', salt)
  })

  test('should return a valid hash on success', async () => {
    const { sut } = makeSut()
    const result = await sut.hash('any-value')
    expect(result).toBe('hashed-value')
  })

  test('call compare with correct values', async () => {
    const { sut } = makeSut()
    const compareSpy = jest.spyOn(bcrypt, 'compare')
    await sut.compare('any-value', 'any_hash')
    expect(compareSpy).toHaveBeenCalledWith('any-value', 'any_hash')
  })

  test('should return true when compare succeds', async () => {
    const { sut } = makeSut()
    const result = await sut.compare('any-value', 'any_hash')
    expect(result).toBe(true)
  })

  test('should return false when compare fails', async () => {
    const { sut } = makeSut()
    jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(false as never)
    const result = await sut.compare('any-value', 'any_hash')
    expect(result).toBe(false)
  })
})
