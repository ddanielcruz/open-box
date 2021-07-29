import faker from 'faker'

import { Post, User } from '@prisma/client'

interface PostFactory extends Partial<Post> {
  userId: string
}

export const makeUser = (replacement?: Partial<User>): User => ({
  id: faker.datatype.uuid(),
  email: faker.internet.email(),
  password: faker.random.alphaNumeric(),
  createdAt: new Date(),
  updatedAt: new Date(),
  ...replacement
})

export const makePost = (replacement: PostFactory): Post => ({
  id: faker.datatype.uuid(),
  key: faker.lorem.words(),
  name: faker.lorem.words(),
  url: faker.lorem.words(),
  closed: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...replacement
})
