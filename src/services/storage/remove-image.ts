import fs from 'fs'
import Joi from 'joi'
import path from 'path'
import { inject, singleton } from 'tsyringe'
import { promisify } from 'util'

import { FieldError, ValidationError } from '@errors'

export interface RemoveImagePayload {
  key: string
}

const validator = Joi.object<RemoveImagePayload>().keys({
  key: Joi.string().trim().required()
})

const unlinkAsync = promisify(fs.unlink)

@singleton()
export class RemoveImage {
  constructor(
    @inject('STORAGE_TYPE')
    private readonly storageType: string
  ) {}

  async execute(payload: RemoveImagePayload) {
    const sanitizedPayload = this.validate(payload)

    if (this.storageType === 's3') {
      throw new Error('Method not implemented.')
    } else if (this.storageType === 'local') {
      await this.removeLocalImage(sanitizedPayload)
    } else {
      throw new Error('Storage type not found.')
    }
  }

  private validate(payload: RemoveImagePayload) {
    const { error, value } = validator.validate(payload, { abortEarly: false })
    const errors = FieldError.generate(error)

    if (errors.length) {
      throw new ValidationError(errors)
    }

    return value
  }

  private async removeLocalImage({ key }: RemoveImagePayload) {
    const filePath = path.resolve(__dirname, '..', '..', '..', 'tmp', key)
    await unlinkAsync(filePath)
  }
}
