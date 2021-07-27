import { User } from '@prisma/client'

type UserView = Omit<User, 'password'>

export function single(user: User): UserView {
  return {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  }
}

export function many(users: User[]) {
  return users.map(single)
}
