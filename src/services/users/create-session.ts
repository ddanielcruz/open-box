import Joi from 'joi'
import { inject, singleton } from 'tsyringe'

import { UsersRepository } from '@database/repositories'
import { UnauthorizedError } from '@errors'
import { Encrypter } from '@services/cryptography/encrypter'
import { Hasher } from '@services/cryptography/hasher'

export interface Credentials {
  email: string
  password: string
}

const validator = Joi.object<Credentials>({
  email: Joi.string().trim().lowercase().email().required(),
  password: Joi.string().trim().required()
})

@singleton()
export class CreateSession {
  constructor(
    @inject('UsersRepository')
    private readonly usersRepository: UsersRepository,
    private readonly encrypter: Encrypter,
    private readonly hasherStub: Hasher
  ) {}

  async execute(credentials: Credentials): Promise<string> {
    const { email, password } = this.validate(credentials)
    const user = await this.usersRepository.findByEmail(email)

    if (!user || !(await this.hasherStub.compare(password, user.password))) {
      throw new UnauthorizedError('Invalid credentials.')
    }

    return await this.encrypter.encrypt({ id: user.id }, '1d')
  }

  private validate(credentials: Credentials): Credentials {
    const { error, value } = validator.validate(credentials, { allowUnknown: true })

    if (error) {
      throw new UnauthorizedError('Invalid credentials.')
    }

    return value
  }
}
