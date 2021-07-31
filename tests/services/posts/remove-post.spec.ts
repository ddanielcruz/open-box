import faker from 'faker'

import { RemovePost, RemovePostPayload } from '@services/posts/remove-post'

import { makePost } from '../../mocks/factories'
import { makePostsRepository } from '../../mocks/repositories'
import { makeRemoveImage } from '../../mocks/services'

const USER_ID = faker.datatype.uuid()
const POST_ID = faker.datatype.uuid()

const makeSut = () => {
  const postsRepositoryStub = makePostsRepository()
  const removeImageStub = makeRemoveImage()
  const sut = new RemovePost(postsRepositoryStub, removeImageStub)
  jest
    .spyOn(postsRepositoryStub, 'findById')
    .mockResolvedValue(makePost({ id: POST_ID, userId: USER_ID, key: 'any-key' }))

  return { sut, postsRepositoryStub, removeImageStub }
}

const makePayload = (): RemovePostPayload => ({
  userId: USER_ID,
  postId: POST_ID
})

describe('RemovePost', () => {
  test.each([
    [{ userId: '' }],
    [{ userId: 'invalid-id' }],
    [{ userId: null }],
    [{ postId: '' }],
    [{ postId: 'invalid-id' }],
    [{ postId: null }]
  ])('should throw when validation fails: %s', async properties => {
    const { sut } = makeSut()
    const promise = sut.execute({ ...makePayload(), ...properties })
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

  test('should throw when user it not the owner of the post', async () => {
    const { sut, postsRepositoryStub } = makeSut()
    jest
      .spyOn(postsRepositoryStub, 'findById')
      .mockResolvedValueOnce(makePost({ userId: 'other-id' }))
    const promise = sut.execute(makePayload())
    await expect(promise).rejects.toThrow()
  })

  test('should remove image using RemoveImage service', async () => {
    const { sut, removeImageStub } = makeSut()
    const executeSpy = jest.spyOn(removeImageStub, 'execute')
    await sut.execute(makePayload())
    expect(executeSpy).toHaveBeenCalledWith({ key: 'any-key' })
  })

  test('should remove post using PostsRepository.delete', async () => {
    const { sut, postsRepositoryStub } = makeSut()
    const deleteSpy = jest.spyOn(postsRepositoryStub, 'delete')
    await sut.execute(makePayload())
    expect(deleteSpy).toHaveBeenCalledWith(POST_ID)
  })

  test("shouldn't request post deletion when failed to remove image", async () => {
    const { sut, postsRepositoryStub, removeImageStub } = makeSut()
    jest.spyOn(removeImageStub, 'execute').mockRejectedValueOnce(new Error())
    const deleteSpy = jest.spyOn(postsRepositoryStub, 'delete')
    const promise = sut.execute(makePayload())
    await expect(promise).rejects.toThrow()
    expect(deleteSpy).not.toHaveBeenCalled()
  })
})
