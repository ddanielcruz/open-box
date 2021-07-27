import { Router } from 'express'

import * as controller from '../controllers/sessions-controller'

const routes = Router()
routes.post('/', controller.create)

export default routes
