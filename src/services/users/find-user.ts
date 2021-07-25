import { UsersRepository } from '@database/repositories'
import { NotFoundError } from '@errors/not-found-error'

export class FindUser {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(id: string) {
    const user = await this.usersRepository.findById(id)
    if (!user) {
      throw new NotFoundError('User not found.')
    }

    return user
  }
}
