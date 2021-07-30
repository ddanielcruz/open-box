import crypto from 'crypto'
import multer from 'multer'
import path from 'path'

const storageTypes = {
  local: {
    storage: multer.diskStorage({
      destination: (_request, _file, callback) => {
        callback(null, path.resolve(__dirname, '..', '..', 'tmp'))
      },
      filename: (_request, file, callback) => {
        crypto.randomBytes(8, (error, hash) => {
          if (error) {
            return callback(error, '')
          }

          file.key = `${hash.toString('hex')}-${file.originalname.replace(' ', '_')}`
          file.location = `${process.env.APP_URL}/files/${file.key}`
          callback(null, file.key)
        })
      }
    })
  }
}

if (!Object.keys(storageTypes).includes(process.env.STORAGE_TYPE)) {
  throw new Error('Storage type not found.')
}

export const config: multer.Options = {
  ...storageTypes[process.env.STORAGE_TYPE],
  limits: {
    fileSize: 2 * 1024 * 1024
  },
  fileFilter: (_request, file, callback) => {
    const allowedMimes = ['image/jpeg', 'image/pjpeg', 'image/png', 'image/gif']
    if (allowedMimes.includes(file.mimetype)) {
      callback(null, true)
    } else {
      callback(new Error('Invalid media type.'))
    }
  }
}
