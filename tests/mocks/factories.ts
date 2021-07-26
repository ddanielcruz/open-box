import { User } from '@prisma/client'

export const makeUser = (replacement?: Partial<User>): User => ({
  id: 'any-id',
  email: 'any-email',
  password: 'any-password',
  createdAt: new Date(),
  updatedAt: new Date(),
  ...replacement
})
