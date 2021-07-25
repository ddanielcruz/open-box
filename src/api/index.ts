import 'dotenv/config'
import express from 'express'
import helmet from 'helmet'
import 'express-async-errors'

import { logger } from './middleware'
import { routes } from './routes'

export const api = express()
api.use(helmet())
api.use(logger())
api.use(express.json())
api.use('/', routes)
