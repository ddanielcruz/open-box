import 'reflect-metadata'
import 'dotenv/config'

import express from 'express'
import helmet from 'helmet'
import path from 'path'
import 'express-async-errors'

import '@config/container'
import { errorHandler, logger } from './middleware'
import { routes } from './routes'

export const api = express()
api.use(helmet())
api.use(logger())
api.use(express.json())
api.use('/', routes)
api.use('/files', express.static(path.resolve(__dirname, '..', '..', 'tmp')))
api.use(errorHandler)
