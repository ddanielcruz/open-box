import { Router } from 'express'

import postsRoutes from './posts-routes'
import sessionsRoutes from './sessions-routes'
import usersRoutes from './users-routes'

export const routes = Router()
routes.use('/posts', postsRoutes)
routes.use('/sessions', sessionsRoutes)
routes.use('/users', usersRoutes)
