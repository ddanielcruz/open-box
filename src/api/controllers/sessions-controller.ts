import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { CreateSession } from '@services/users/create-session'
import { FindUser } from '@services/users/find-user'

import * as views from '../views/users-views'

export async function create(request: Request, response: Response): Promise<Response> {
  const service = container.resolve(CreateSession)
  const token = await service.execute(request.body)

  return response.json({ token })
}

export async function show(request: Request, response: Response): Promise<Response> {
  const service = container.resolve(FindUser)
  const user = await service.execute(request.session.id)

  return response.json(views.single(user))
}
