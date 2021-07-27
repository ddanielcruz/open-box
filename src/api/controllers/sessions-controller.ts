import { Request, Response } from 'express'
import { container } from 'tsyringe'

import { CreateSession } from '@services/users/create-session'

export async function create(request: Request, response: Response): Promise<Response> {
  const service = container.resolve(CreateSession)
  const token = await service.execute(request.body)

  return response.json({ token })
}
