import {
  PostCreate,
  PostFindManyOptions,
  PostsRepository,
  PostUpdate
} from '@database/repositories'
import { Post } from '@prisma/client'

import { makePost } from '../factories'

export const makePostsRepository = (): PostsRepository => {
  class PostsRepositoryStub implements PostsRepository {
    async create(post: PostCreate): Promise<Post> {
      return makePost(post)
    }

    async delete(id: string): Promise<Post> {
      return makePost({ id, userId: 'any-id' })
    }

    async findById(id: string): Promise<Post> {
      return makePost({ id, userId: 'any-id' })
    }

    async findManyFromUser(userId: string, options?: PostFindManyOptions): Promise<Post[]> {
      const publicPost = makePost({ userId })
      const closedPost = makePost({ userId, closed: true })

      return options?.publicOnly ? [publicPost] : [publicPost, closedPost]
    }

    async update(post: PostUpdate): Promise<Post> {
      return makePost({ ...post, userId: 'any-id' })
    }
  }

  return new PostsRepositoryStub()
}
