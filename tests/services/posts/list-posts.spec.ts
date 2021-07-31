import faker from 'faker'

import { ListPosts, ListPostsPayload } from '@services/posts/list-posts'

import { makePostsRepository } from '../../mocks/repositories'

const FAKE_ID = faker.datatype.uuid()

const makeSut = () => {
  const postsRepositoryStub = makePostsRepository()
  const sut = new ListPosts(postsRepositoryStub)

  return { sut, postsRepositoryStub }
}

const makePayload = (replacement?: Partial<ListPostsPayload>): ListPostsPayload => ({
  ownerId: faker.datatype.uuid(),
  authenticatedId: faker.datatype.uuid(),
  ...replacement
})

describe('ListPosts', () => {
  test.each([
    [{ ownerId: null }],
    [{ ownerId: '' }],
    [{ ownerId: 'invalid-id' }],
    [{ authenticatedId: 'invalid-id' }]
  ])('should throw when validation fails: %s', async properties => {
    const { sut } = makeSut()
    const promise = sut.execute({ ...makePayload(), ...properties })
    await expect(promise).rejects.toThrow()
  })

  test('should find posts using PostsRepository.findManyFromUser', async () => {
    const { sut, postsRepositoryStub } = makeSut()
    const findManyFromUserSpy = jest.spyOn(postsRepositoryStub, 'findManyFromUser')
    const payload = makePayload()
    await sut.execute(payload)
    expect(findManyFromUserSpy).toHaveBeenCalledWith(payload.ownerId, {
      publicOnly: payload.ownerId !== payload.authenticatedId
    })
  })

  test('should find all posts when owner ID is the same as the authenticated', async () => {
    const { sut, postsRepositoryStub } = makeSut()
    const findManyFromUserSpy = jest.spyOn(postsRepositoryStub, 'findManyFromUser')
    const posts = await sut.execute(makePayload({ ownerId: FAKE_ID, authenticatedId: FAKE_ID }))
    expect(findManyFromUserSpy).toHaveBeenCalledWith(FAKE_ID, { publicOnly: false })
    expect(posts.length).toBe(2)
  })

  test.each([[FAKE_ID], [null]])(
    'should find public posts only when owner ID is not the same as the authenticated: %s',
    async authenticatedId => {
      const { sut, postsRepositoryStub } = makeSut()
      const findManyFromUserSpy = jest.spyOn(postsRepositoryStub, 'findManyFromUser')
      const payload = makePayload({ authenticatedId })
      const posts = await sut.execute(payload)
      expect(findManyFromUserSpy).toHaveBeenCalledWith(payload.ownerId, { publicOnly: true })
      expect(posts.length).toBe(1)
      expect(posts[0].closed).toBe(false)
    }
  )
})
