import auth from 'basic-auth'
import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { CreateSession } from '@services/users/create-session'

export async function create(request: Request, response: Response): Promise<Response> {
  const service = container.resolve(CreateSession)
  const credentials = auth(request)
  const token = await service.execute(credentials.name, credentials.pass)

  return response.json({ token })
}
