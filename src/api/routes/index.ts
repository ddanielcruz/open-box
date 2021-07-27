import { Router } from 'express'

import sessionsRoutes from './sessions-routes'
import usersRoutes from './users-routes'

export const routes = Router()
routes.use('/sessions', sessionsRoutes)
routes.use('/users', usersRoutes)
