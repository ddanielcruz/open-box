import aws from 'aws-sdk'
import crypto from 'crypto'
import multer from 'multer'
import multerS3 from 'multer-s3'
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
  },
  s3: {
    storage: multerS3({
      s3: new aws.S3(),
      bucket: process.env.AWS_BUCKET_NAME,
      contentType: multerS3.AUTO_CONTENT_TYPE,
      acl: 'public-read',
      key: (_request, file, callback) => {
        crypto.randomBytes(8, (error, hash) => {
          if (error) {
            return callback(error, '')
          }

          const filename = `${hash.toString('hex')}-${file.originalname.replace(' ', '_')}`
          callback(null, filename)
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
