import { inject, singleton } from 'tsyringe'

import { UsersRepository } from '@database/repositories'
import { UnauthorizedError } from '@errors'
import { Encrypter } from '@services/cryptography/encrypter'
import { Hasher } from '@services/cryptography/hasher'

@singleton()
export class CreateSession {
  constructor(
    @inject('UsersRepository')
    private readonly usersRepository: UsersRepository,
    private readonly encrypter: Encrypter,
    private readonly hasherStub: Hasher
  ) {}

  async execute(email: string, password: string): Promise<string> {
    const user = await this.usersRepository.findByEmail(email)
    if (!user || !(await this.hasherStub.compare(password, user.password))) {
      throw new UnauthorizedError('Invalid credentials.')
    }

    return await this.encrypter.encrypt({ id: user.id }, '1d')
  }
}
