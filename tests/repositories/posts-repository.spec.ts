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
    const createdPost = await sut.create({ ...makePost({ userId: user.id }), closed: false })
    const postsCount = await client.post.count()
    expect(createdPost).toBeTruthy()
    expect(postsCount).toBe(2)
  })

  test('should update public flag', async () => {
    const { sut } = makeSut()
    const { post } = await makeResources()
    post.closed = !post.closed
    const updatedPost = await sut.update(post)
    expect(updatedPost).toEqual({ ...post, updatedAt: expect.any(Date) })
  })

  test('should find all posts of the user when option is populated with FALSE', async () => {
    const { sut } = makeSut()
    const { user, post: publicPost } = await makeResources()
    const closedPost = await client.post.create({
      data: makePost({ userId: user.id, closed: true })
    })
    const posts = await sut.findManyFromUser(user.id, { publicOnly: false })
    expect(posts.length).toBe(2)

    for (const post of posts) {
      expect(post).toEqual(post.closed ? closedPost : publicPost)
    }
  })

  test('should find only public posts of the user when option is populated with TRUE', async () => {
    const { sut } = makeSut()
    const { user, post: publicPost } = await makeResources()
    await client.post.create({ data: makePost({ userId: user.id, closed: true }) })
    const posts = await sut.findManyFromUser(user.id, { publicOnly: true })
    expect(posts.length).toBe(1)
    expect(posts[0]).toEqual(publicPost)
  })

  test('should find only public posts of the user when option is not populated', async () => {
    const { sut } = makeSut()
    const { user, post: publicPost } = await makeResources()
    await client.post.create({ data: makePost({ userId: user.id, closed: true }) })
    const posts = await sut.findManyFromUser(user.id)
    expect(posts.length).toBe(1)
    expect(posts[0]).toEqual(publicPost)
  })
})
