import { UserCreate } from '@database/repositories'
import { CreateUser } from '@services/users/create-user'

import { makeUsersRepository } from '../../mocks/repositories'
import { makeHasher } from '../../mocks/services'

const makeSut = () => {
  const usersRepositoryStub = makeUsersRepository()
  const hasherStub = makeHasher()
  const sut = new CreateUser(usersRepositoryStub, hasherStub)

  return { sut, usersRepositoryStub, hasherStub }
}

const makePayload = (): UserCreate => ({
  email: 'any@email.com',
  password: 'any-password'
})

describe('CreateUser', () => {
  test.each([
    [{ email: null }],
    [{ email: '' }],
    [{ email: 'invalid-email' }],
    [{ password: null }],
    [{ password: '' }]
  ])('should throw when fails validation: %s', async properties => {
    const { sut } = makeSut()
    const payload: any = { ...makePayload(), ...properties }
    const promise = sut.execute(payload)
    await expect(promise).rejects.toThrow()
  })

  test('should sanitized received email', async () => {
    const { sut, usersRepositoryStub } = makeSut()
    const createSpy = jest.spyOn(usersRepositoryStub, 'create')
    await sut.execute({ ...makePayload(), email: ' ANY@EMAIL.COM ' })
    expect(createSpy).toHaveBeenCalledWith({ email: 'any@email.com', password: expect.any(String) })
  })

  test('should sanitized received password', async () => {
    const { sut, hasherStub } = makeSut()
    const hashSpy = jest.spyOn(hasherStub, 'hash')
    await sut.execute({ ...makePayload(), password: ' ANY-PASSWORD ' })
    expect(hashSpy).toHaveBeenCalledWith('ANY-PASSWORD')
  })

  test('should verify if email is already used using UsersRepository.findByEmail', async () => {
    const { sut, usersRepositoryStub } = makeSut()
    const findByEmailSpy = jest.spyOn(usersRepositoryStub, 'findByEmail')
    await sut.execute(makePayload())
    expect(findByEmailSpy).toHaveBeenCalledWith('any@email.com')
  })

  test('should throw when email is already used', async () => {
    const { sut, usersRepositoryStub } = makeSut()
    jest.spyOn(usersRepositoryStub, 'findByEmail').mockResolvedValueOnce({} as any)
    const promise = sut.execute(makePayload())
    await expect(promise).rejects.toThrow()
  })

  test('should hash password using Hasher.hash', async () => {
    const { sut, hasherStub } = makeSut()
    const hashSpy = jest.spyOn(hasherStub, 'hash')
    await sut.execute(makePayload())
    expect(hashSpy).toHaveBeenCalledWith('any-password')
  })

  test('should create user using UsersRepository.create with hashed password', async () => {
    const { sut, usersRepositoryStub } = makeSut()
    const createSpy = jest.spyOn(usersRepositoryStub, 'create')
    await sut.execute(makePayload())
    expect(createSpy).toHaveBeenCalledWith({ email: 'any@email.com', password: 'hashed-value' })
  })

  test('should return created user on success', async () => {
    const { sut } = makeSut()
    const user = await sut.execute(makePayload())
    expect(user).toBeTruthy()
  })
})
