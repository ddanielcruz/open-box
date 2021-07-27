import { inject, injectable } from 'tsyringe'

import { PrismaClient, User } from '@prisma/client'

export interface UserCreate {
  email: string
  password: string
}

export interface UserUpdate extends UserCreate {
  id: string
}

export interface UsersRepository {
  create(user: UserCreate): Promise<User>
  findById(id: string): Promise<User>
  findByEmail(email: string): Promise<User>
  update(user: UserUpdate): Promise<User>
}

@injectable()
export class UsersRepositoryImpl implements UsersRepository {
  constructor(
    @inject('PrismaClient')
    private readonly client: PrismaClient
  ) {}

  async create({ email, password }: UserCreate): Promise<User> {
    return await this.client.user.create({ data: { email, password } })
  }

  async findByEmail(email: string): Promise<User> {
    return await this.client.user.findUnique({ where: { email } })
  }

  async findById(id: string): Promise<User> {
    return await this.client.user.findUnique({ where: { id } })
  }

  async update({ id, email, password }: UserUpdate): Promise<User> {
    return await this.client.user.update({
      data: { email, password },
      where: { id }
    })
  }
}
