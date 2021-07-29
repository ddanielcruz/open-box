import { inject, injectable } from 'tsyringe'

import { Post, PrismaClient } from '@prisma/client'

export interface PostCreate {
  userId: string
  name: string
  key: string
  url: string
  isPublic: boolean
}

export interface PostUpdate {
  id: string
  isPublic: boolean
}

export interface PostsRepository {
  create(post: PostCreate): Promise<Post>
  findById(id: string): Promise<Post>
  findManyFromUser(userId: string, publicOnly: boolean): Promise<Post[]>
  update(post: PostUpdate): Promise<Post>
}

@injectable()
export class PostsRepositoryImpl implements PostsRepository {
  constructor(
    @inject('PrismaClient')
    private readonly client: PrismaClient
  ) {}

  async create({ userId, key, name, url, isPublic }: PostCreate): Promise<Post> {
    return await this.client.post.create({ data: { userId, key, name, url, public: isPublic } })
  }

  async findById(id: string): Promise<Post> {
    return await this.client.post.findUnique({ where: { id } })
  }

  async findManyFromUser(userId: string, publicOnly: boolean): Promise<Post[]> {
    return await this.client.post.findMany({
      where: { userId, public: publicOnly ? true : undefined }
    })
  }

  async update({ id, isPublic }: PostUpdate): Promise<Post> {
    return await this.client.post.update({
      data: { public: isPublic },
      where: { id }
    })
  }
}
