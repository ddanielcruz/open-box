import faker from 'faker'

import { UpdatePost, UpdatePostPayload } from '@services/posts/update-post'

import { makePost } from '../../mocks/factories'
import { makePostsRepository } from '../../mocks/repositories'

const POST_ID = faker.datatype.uuid()
const USER_ID = faker.datatype.uuid()

const makeSut = () => {
  const postsRepositoryStub = makePostsRepository()
  const sut = new UpdatePost(postsRepositoryStub)
  jest
    .spyOn(postsRepositoryStub, 'findById')
    .mockResolvedValue(makePost({ id: POST_ID, userId: USER_ID }))

  return { sut, postsRepositoryStub }
}

const makePayload = (replacement?: Partial<UpdatePostPayload>): UpdatePostPayload => ({
  id: POST_ID,
  userId: USER_ID,
  closed: true,
  ...replacement
})

describe('UpdatePost', () => {
  test.each([
    [{ id: null }],
    [{ id: '' }],
    [{ id: 'invalid-id' }],
    [{ userId: null }],
    [{ userId: '' }],
    [{ userId: 'invalid-id' }],
    [{ closed: null }],
    [{ closed: '' }]
  ])('should throw when fails validation: %s', async properties => {
    const { sut } = makeSut()
    const promise = sut.execute({ ...makePayload(), ...properties } as any)
    await expect(promise).rejects.toThrow()
  })

  test('should find post using PostsRepository.findById', async () => {
    const { sut, postsRepositoryStub } = makeSut()
    const findByIdSpy = jest.spyOn(postsRepositoryStub, 'findById')
    await sut.execute(makePayload())
    expect(findByIdSpy).toHaveBeenCalledWith(POST_ID)
  })

  test('should throw when post is not found', async () => {
    const { sut, postsRepositoryStub } = makeSut()
    jest.spyOn(postsRepositoryStub, 'findById').mockResolvedValueOnce(null)
    const promise = sut.execute(makePayload())
    await expect(promise).rejects.toThrow()
  })

  test('should throw when user is not the owner of the post', async () => {
    const { sut, postsRepositoryStub } = makeSut()
    jest
      .spyOn(postsRepositoryStub, 'findById')
      .mockResolvedValueOnce(makePost({ userId: 'other-id' }))
    const promise = sut.execute(makePayload())
    await expect(promise).rejects.toThrow()
  })

  test('should update post using PostsRepository.update', async () => {
    const { sut, postsRepositoryStub } = makeSut()
    const updateSpy = jest.spyOn(postsRepositoryStub, 'update')
    const payload = makePayload()
    await sut.execute(payload)
    expect(updateSpy).toHaveBeenCalledWith(payload)
  })

  test('should return updated post on success', async () => {
    const { sut } = makeSut()
    const post = await sut.execute(makePayload())
    expect(post).toBeTruthy()
  })
})
