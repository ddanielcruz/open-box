import { FindUser } from '@services/users/find-user'

import { makeUsersRepository } from '../../mocks/repositories'

const makeSut = () => {
  const usersRepositoryStub = makeUsersRepository()
  const sut = new FindUser(usersRepositoryStub)

  return { sut, usersRepositoryStub }
}

describe('FindUser', () => {
  test('should find user using UsersRepository', async () => {
    const { sut, usersRepositoryStub } = makeSut()
    const findByIdSpy = jest.spyOn(usersRepositoryStub, 'findById')
    await sut.execute('any-id')
    expect(findByIdSpy).toHaveBeenCalledWith('any-id')
  })

  test('should throw when user is not found', async () => {
    const { sut, usersRepositoryStub } = makeSut()
    jest.spyOn(usersRepositoryStub, 'findById').mockResolvedValueOnce(null)
    const promise = sut.execute('any-id')
    await expect(promise).rejects.toThrow()
  })

  test('should return user on success', async () => {
    const { sut } = makeSut()
    const user = await sut.execute('any-id')
    expect(user).toBeTruthy()
  })
})
