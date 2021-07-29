import { PostCreate, PostsRepository, PostUpdate } from '@database/repositories'
import { Post } from '@prisma/client'

import { makePost } from '../factories'

export const makePostsRepository = (): PostsRepository => {
  class PostsRepositoryStub implements PostsRepository {
    async create(post: PostCreate): Promise<Post> {
      return makePost({ ...post, public: post.isPublic })
    }

    async findById(id: string): Promise<Post> {
      return makePost({ id, userId: 'any-id' })
    }

    async findManyFromUser(userId: string, publicOnly: boolean): Promise<Post[]> {
      const publicPost = makePost({ userId })
      const closedPost = makePost({ userId })

      return publicOnly ? [publicPost] : [publicPost, closedPost]
    }

    async update(post: PostUpdate): Promise<Post> {
      return makePost({ ...post, userId: 'any-id', public: post.isPublic })
    }
  }

  return new PostsRepositoryStub()
}
