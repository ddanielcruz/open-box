import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { CreatePost } from '@services/posts/create-post'
import { ListPosts } from '@services/posts/list-posts'
import { UpdatePost } from '@services/posts/update-post'

import * as views from '../views/posts-views'

export async function index(request: Request, response: Response) {
  const service = container.resolve(ListPosts)
  const posts = await service.execute({
    userId: request.query.userId?.toString(),
    authenticatedId: request.session?.id
  })

  return response.json(views.many(posts))
}

export async function create(request: Request, response: Response) {
  const service = container.resolve(CreatePost)
  const post = await service.execute({
    ...request.body,
    userId: request.session?.id,
    name: request.file?.originalname,
    key: request.file?.key,
    url: request.file?.location
  })

  return response.status(201).json(views.single(post))
}

export async function update(request: Request, response: Response) {
  const service = container.resolve(UpdatePost)
  const post = await service.execute({
    ...request.body,
    id: request.params.id,
    userId: request.session?.id
  })

  return response.json(views.single(post))
}
