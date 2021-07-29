import { client } from '@database/client'
import { PostsRepositoryImpl } from '@database/repositories'

import { makeUser, makePost } from '../mocks/factories'

const makeSut = () => {
  const sut = new PostsRepositoryImpl(client)
  return { sut }
}

const makeResources = async () => {
  const user = await client.user.create({ data: makeUser() })
  const post = await client.post.create({ data: makePost({ userId: user.id }) })

  return { user, post }
}

describe('PostsRepository', () => {
  afterEach(async () => {
    await client.post.deleteMany()
    await client.user.deleteMany()
  })

  afterAll(async () => {
    await client.$disconnect()
  })

  test('should find post by id', async () => {
    const { sut } = makeSut()
    const { post } = await makeResources()
    const foundPost = await sut.findById(post.id)
    expect(foundPost).toEqual(post)
  })

  test('should return null when post is not found', async () => {
    const { sut } = makeSut()
    const foundPost = await sut.findById('any-id')
    expect(foundPost).toBeFalsy()
  })

  test('should create post', async () => {
    const { sut } = makeSut()
    const { user } = await makeResources()
    const createdPost = await sut.create({ ...makePost({ userId: user.id }), isPublic: true })
    const postsCount = await client.post.count()
    expect(createdPost).toBeTruthy()
    expect(postsCount).toBe(2)
  })

  test('should update public flag', async () => {
    const { sut } = makeSut()
    const { post } = await makeResources()
    post.public = !post.public
    const updatedPost = await sut.update({ ...post, isPublic: post.public })
    expect(updatedPost).toEqual({ ...post, updatedAt: expect.any(Date) })
  })

  test('should find all posts of the user', async () => {
    const { sut } = makeSut()
    const { user } = await makeResources()
    await client.post.create({ data: makePost({ userId: user.id, public: false }) })
    const posts = await sut.findManyFromUser(user.id, false)
    expect(posts.length).toBe(2)
  })

  test('should find only public posts of the user', async () => {
    const { sut } = makeSut()
    const { user } = await makeResources()
    await client.post.create({ data: makePost({ userId: user.id, public: false }) })
    const posts = await sut.findManyFromUser(user.id, true)
    expect(posts.length).toBe(1)
  })
})
