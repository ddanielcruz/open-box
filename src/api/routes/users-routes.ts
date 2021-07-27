import { Router } from 'express'

import * as controller from '../controllers/users-controller'

const routes = Router()
routes.post('/', controller.create)

export default routes
