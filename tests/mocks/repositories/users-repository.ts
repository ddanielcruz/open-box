import { UsersRepository } from '@database/repositories'
import { User } from '@prisma/client'

import { makeUser } from '../factories'

export const makeUsersRepository = (): UsersRepository => {
  class UsersRepositoryStub implements UsersRepository {
    async create(user: User): Promise<User> {
      return user
    }

    async findByEmail(): Promise<User> {
      return null
    }

    async findById(id: string): Promise<User> {
      return makeUser({ id })
    }

    async update(user: User): Promise<User> {
      return user
    }
  }

  return new UsersRepositoryStub()
}
