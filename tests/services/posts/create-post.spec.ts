import faker from 'faker'

import { PostCreate } from '@database/repositories'
import { CreatePost } from '@services/posts/create-post'

import { makePostsRepository, makeUsersRepository } from '../../mocks/repositories'

const FAKE_ID = faker.datatype.uuid()

const makeSut = () => {
  const usersRepositoryStub = makeUsersRepository()
  const postsRepositoryStub = makePostsRepository()
  const sut = new CreatePost(usersRepositoryStub, postsRepositoryStub)

  return { sut, usersRepositoryStub, postsRepositoryStub }
}

const makePayload = (): PostCreate => ({
  userId: FAKE_ID,
  closed: faker.datatype.boolean(),
  key: faker.lorem.words(),
  name: faker.lorem.words(),
  url: faker.lorem.words()
})

describe('CreatePost', () => {
  test.each([
    [{ userId: null }],
    [{ userId: '' }],
    [{ userId: 'invalid-id' }],
    [{ name: null }],
    [{ name: '' }],
    [{ key: null }],
    [{ key: '' }],
    [{ url: null }],
    [{ url: '' }],
    [{ closed: null }],
    [{ closed: '' }]
  ])('should throw when fails validations: %s', async properties => {
    const { sut } = makeSut()
    const promise = sut.execute({ ...makePayload(), ...properties } as any)
    await expect(promise).rejects.toThrow()
  })

  test('should find user using UsersRepository.findById', async () => {
    const { sut, usersRepositoryStub } = makeSut()
    const findByIdSpy = jest.spyOn(usersRepositoryStub, 'findById')
    await sut.execute(makePayload())
    expect(findByIdSpy).toHaveBeenCalledWith(FAKE_ID)
  })

  test('should throw when user is not found', async () => {
    const { sut, usersRepositoryStub } = makeSut()
    jest.spyOn(usersRepositoryStub, 'findById').mockResolvedValueOnce(null)
    const promise = sut.execute(makePayload())
    await expect(promise).rejects.toThrow()
  })

  test('should create post using PostsRepository.create', async () => {
    const { sut, postsRepositoryStub } = makeSut()
    const createSpy = jest.spyOn(postsRepositoryStub, 'create')
    const payload = makePayload()
    await sut.execute(payload)
    expect(createSpy).toHaveBeenCalledWith(payload)
  })

  test('should return created post on success', async () => {
    const { sut } = makeSut()
    const post = await sut.execute(makePayload())
    expect(post).toBeTruthy()
  })
})
