import multer from 'multer'

import { config } from '@config/multer'

export const singleImage = (field = 'image') => multer(config).single(field)
