import { User } from '@prisma/client'

export const makeUser = (replacement?: Partial<User>): User => ({
  id: 'any-id',
  email: 'any-email',
  password: 'any-password',
  created_at: new Date(),
  updated_at: new Date(),
  ...replacement
})
