import Joi from 'joi'

import { UserCreate, UsersRepository } from '@database/repositories'
import { FieldError, ValidationError } from '@errors'
import { User } from '@prisma/client'
import { Hasher } from '@services/cryptography/hasher'

const validator = Joi.object<UserCreate>().keys({
  email: Joi.string().trim().lowercase().email().required(),
  password: Joi.string().trim().required()
})

export class CreateUser {
  constructor(private readonly usersRepository: UsersRepository, private readonly hasher: Hasher) {}

  async execute(payload: UserCreate): Promise<User> {
    const sanitizedPayload = await this.validate(payload)
    sanitizedPayload.password = await this.hasher.hash(sanitizedPayload.password)

    return await this.usersRepository.create(sanitizedPayload)
  }

  private async validate(payload: UserCreate): Promise<UserCreate> {
    const { value, error } = validator.validate(payload, { abortEarly: false, stripUnknown: true })
    const errors = FieldError.generate(error)

    if (!FieldError.includes(errors, 'email')) {
      const otherUser = await this.usersRepository.findByEmail(value.email)
      if (otherUser) {
        errors.push(new FieldError('email', 'Email is already used.'))
      }
    }

    if (errors.length) {
      throw new ValidationError(errors)
    }

    return value
  }
}
