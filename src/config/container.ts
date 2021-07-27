import { container } from 'tsyringe'

import { client } from '@database/client'
import { UsersRepository, UsersRepositoryImpl } from '@database/repositories/users-repository'
import { PrismaClient } from '@prisma/client'

// Parameters
container.registerInstance('HASHER_SALT', parseInt(process.env.HASHER_SALT))
container.registerInstance('ENCRYPTER_SECRET', process.env.ENCRYPTER_SECRET)

// Database
container.registerInstance<PrismaClient>('PrismaClient', client)

// Repositories
container.registerSingleton<UsersRepository>('UsersRepository', UsersRepositoryImpl)
