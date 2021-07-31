import { Router } from 'express'

import { auth, singleImage } from '@api/middleware'

import * as controller from '../controllers/posts-controller'

const routes = Router()

routes.get('/', auth({ required: false }), controller.index)
routes.post('/', auth(), singleImage(), controller.create)
routes.put('/:id', auth(), controller.update)
routes.delete('/:id', auth(), controller.remove)

export default routes
