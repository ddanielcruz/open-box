import { container } from 'tsyringe'

import { client } from '@database/client'
import { PostsRepository, PostsRepositoryImpl } from '@database/repositories/posts-repository'
import { UsersRepository, UsersRepositoryImpl } from '@database/repositories/users-repository'
import { PrismaClient } from '@prisma/client'

// Parameters
container.registerInstance('HASHER_SALT', parseInt(process.env.HASHER_SALT))
container.registerInstance('ENCRYPTER_SECRET', process.env.ENCRYPTER_SECRET)
container.registerInstance('STORAGE_TYPE', process.env.STORAGE_TYPE)

// Database
container.registerInstance<PrismaClient>('PrismaClient', client)

// Repositories
container.registerSingleton<PostsRepository>('PostsRepository', PostsRepositoryImpl)
container.registerSingleton<UsersRepository>('UsersRepository', UsersRepositoryImpl)
