import { inject, singleton } from 'tsyringe'

import { UsersRepository } from '@database/repositories'
import { NotFoundError } from '@errors'
import { User } from '@prisma/client'

@singleton()
export class FindUser {
  constructor(
    @inject('UsersRepository')
    private readonly usersRepository: UsersRepository
  ) {}

  async execute(id: string): Promise<User> {
    const user = await this.usersRepository.findById(id)
    if (!user) {
      throw new NotFoundError('User not found.')
    }

    return user
  }
}
