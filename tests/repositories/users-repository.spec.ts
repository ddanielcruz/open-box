import { client } from '@database/client'
import { UsersRepositoryImpl } from '@database/repositories'

import { makeUser } from '../mocks/factories'

const makeSut = () => {
  const sut = new UsersRepositoryImpl(client)
  return { sut }
}

describe('UsersRepository', () => {
  afterEach(async () => {
    await client.user.deleteMany()
  })

  afterAll(async () => {
    await client.$disconnect()
  })

  test('should find user by ID', async () => {
    const { sut } = makeSut()
    const user = await client.user.create({ data: makeUser() })
    const foundUser = await sut.findById(user.id)
    expect(foundUser).toEqual(user)
  })

  test('should return null when user is not found by ID', async () => {
    const { sut } = makeSut()
    const foundUser = await sut.findById('any-id')
    expect(foundUser).toBeFalsy()
  })

  test('should find user by email', async () => {
    const { sut } = makeSut()
    const user = await client.user.create({ data: makeUser() })
    const foundUser = await sut.findByEmail(user.email)
    expect(foundUser).toEqual(user)
  })

  test('should return null when user is not found by email', async () => {
    const { sut } = makeSut()
    const foundUser = await sut.findByEmail('any-email')
    expect(foundUser).toBeFalsy()
  })

  test('should store user in the database', async () => {
    const { sut } = makeSut()
    const createdUser = await sut.create(makeUser())
    const usersCount = await client.user.count()
    expect(createdUser).toBeTruthy()
    expect(usersCount).toBe(1)
  })

  test('should update user in the database', async () => {
    const { sut } = makeSut()
    const user = await client.user.create({ data: makeUser() })
    user.email = 'other-email'
    user.password = 'other-password'
    const updatedUser = await sut.update(user)
    expect(updatedUser).toEqual({ ...user, updatedAt: expect.any(Date) })
    expect(updatedUser.updatedAt).not.toEqual(user.updatedAt)
  })
})
