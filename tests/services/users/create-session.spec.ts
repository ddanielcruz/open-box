import { User } from '@prisma/client'
import { CreateSession } from '@services/users/create-session'

import { makeUsersRepository } from '../../mocks/repositories'
import { makeEncrypter, makeHasher } from '../../mocks/services'

const FAKE_CREDENTIALS = { email: 'any@email.com', password: 'any-password' }
const FAKE_USER: User = {
  id: 'any-id',
  email: FAKE_CREDENTIALS.email,
  password: 'hashed-password'
} as any

const makeSut = () => {
  const encrypterStub = makeEncrypter()
  const hasherStub = makeHasher()
  const usersRepositoryStub = makeUsersRepository()
  const sut = new CreateSession(usersRepositoryStub, encrypterStub, hasherStub)
  jest.spyOn(usersRepositoryStub, 'findByEmail').mockResolvedValue(FAKE_USER)

  return { sut, encrypterStub, hasherStub, usersRepositoryStub }
}

describe('CreateSession', () => {
  test('should find user by email using UsersRepository.findByEmail', async () => {
    const { sut, usersRepositoryStub } = makeSut()
    const findByEmailSpy = jest.spyOn(usersRepositoryStub, 'findByEmail')
    await sut.execute(FAKE_CREDENTIALS)
    expect(findByEmailSpy).toHaveBeenCalledWith(FAKE_CREDENTIALS.email)
  })

  test('should throw when user is not found by email', async () => {
    const { sut, usersRepositoryStub } = makeSut()
    jest.spyOn(usersRepositoryStub, 'findByEmail').mockResolvedValueOnce(null)
    const promise = sut.execute(FAKE_CREDENTIALS)
    await expect(promise).rejects.toThrow()
  })

  test('should compare passwords using Hasher.compare', async () => {
    const { sut, hasherStub } = makeSut()
    const compareSpy = jest.spyOn(hasherStub, 'compare')
    await sut.execute(FAKE_CREDENTIALS)
    expect(compareSpy).toHaveBeenCalledWith(FAKE_CREDENTIALS.password, FAKE_USER.password)
  })

  test('should sanitize received password', async () => {
    const { sut, hasherStub } = makeSut()
    const compareSpy = jest.spyOn(hasherStub, 'compare')
    await sut.execute({ ...FAKE_CREDENTIALS, password: ` ${FAKE_CREDENTIALS.password} ` })
    expect(compareSpy).toHaveBeenCalledWith(FAKE_CREDENTIALS.password, FAKE_USER.password)
  })

  test("should throw when passwords don't match", async () => {
    const { sut, hasherStub } = makeSut()
    jest.spyOn(hasherStub, 'compare').mockResolvedValueOnce(false)
    const promise = sut.execute(FAKE_CREDENTIALS)
    await expect(promise).rejects.toThrow()
  })

  test.each([
    [{ email: '' }],
    [{ email: ' ' }],
    [{ email: undefined }],
    [{ email: 'invalid-email' }],
    [{ password: '' }],
    [{ password: ' ' }],
    [{ password: undefined }]
  ])('should throw when fails validation: %s', async properties => {
    const { sut } = makeSut()
    const promise = sut.execute({ ...FAKE_CREDENTIALS, ...properties })
    await expect(promise).rejects.toThrow()
  })

  test('should not find user by email when fails validation', async () => {
    const { sut, usersRepositoryStub } = makeSut()
    const findByEmailSpy = jest.spyOn(usersRepositoryStub, 'findByEmail')
    const promise = sut.execute({} as any)
    await expect(promise).rejects.toThrow()
    expect(findByEmailSpy).not.toHaveBeenCalled()
  })

  test('should sanitize received email', async () => {
    const { sut, usersRepositoryStub } = makeSut()
    const findByEmailSpy = jest.spyOn(usersRepositoryStub, 'findByEmail')
    await sut.execute({ ...FAKE_CREDENTIALS, email: FAKE_CREDENTIALS.email.toUpperCase() })
    expect(findByEmailSpy).toHaveBeenCalledWith(FAKE_CREDENTIALS.email)
  })

  test('should generate token using Encrypter.encrypt', async () => {
    const { sut, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    await sut.execute(FAKE_CREDENTIALS)
    expect(encryptSpy).toHaveBeenCalledWith({ id: 'any-id' }, '1d')
  })

  test('should return generated token on success', async () => {
    const { sut } = makeSut()
    const token = await sut.execute(FAKE_CREDENTIALS)
    expect(token).toEqual('any-token')
  })
})
