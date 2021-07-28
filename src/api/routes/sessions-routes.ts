import { Router } from 'express'

import { auth } from '@api/middleware'

import * as controller from '../controllers/sessions-controller'

const routes = Router()
routes.post('/', controller.create)
routes.get('/me', auth, controller.show)

export default routes
