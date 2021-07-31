import { inject, injectable } from 'tsyringe'

import { Post, PrismaClient } from '@prisma/client'

export interface PostCreate {
  userId: string
  name: string
  key: string
  url: string
  closed: boolean
}

export interface PostUpdate {
  id: string
  closed: boolean
}

export interface PostFindManyOptions {
  publicOnly?: boolean
}

export interface PostsRepository {
  create(post: PostCreate): Promise<Post>
  delete(id: string): Promise<Post>
  findById(id: string): Promise<Post>
  findManyFromUser(userId: string, options?: PostFindManyOptions): Promise<Post[]>
  update(post: PostUpdate): Promise<Post>
}

@injectable()
export class PostsRepositoryImpl implements PostsRepository {
  constructor(
    @inject('PrismaClient')
    private readonly client: PrismaClient
  ) {}

  async create({ userId, key, name, url, closed }: PostCreate): Promise<Post> {
    return await this.client.post.create({ data: { userId, key, name, url, closed } })
  }

  async delete(id: string): Promise<Post> {
    return await this.client.post.delete({ where: { id } })
  }

  async findById(id: string): Promise<Post> {
    return await this.client.post.findUnique({ where: { id } })
  }

  async findManyFromUser(userId: string, options?: PostFindManyOptions): Promise<Post[]> {
    const { publicOnly = true } = options || {}
    return await this.client.post.findMany({
      where: { userId, closed: publicOnly ? false : undefined },
      orderBy: { createdAt: 'desc' }
    })
  }

  async update({ id, closed }: PostUpdate): Promise<Post> {
    return await this.client.post.update({
      data: { closed },
      where: { id }
    })
  }
}
