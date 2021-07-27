import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { CreateUser } from '@services/users/create-user'

import * as views from '../views/users-views'

export async function create(request: Request, response: Response) {
  const service = container.resolve(CreateUser)
  const user = await service.execute(request.body)

  return response.status(201).json(views.single(user))
}
