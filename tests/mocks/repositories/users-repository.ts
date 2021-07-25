import { UsersRepository } from '@database/repositories'
import { User } from '@prisma/client'

import { makeUser } from '../factories'

export const makeUsersRepository = (): UsersRepository => {
  class UsersRepositoryStub implements UsersRepository {
    async findById(id: string): Promise<User> {
      return makeUser({ id })
    }
  }

  return new UsersRepositoryStub()
}
