import bcrypt from 'bcrypt'
import { inject, singleton } from 'tsyringe'

@singleton()
export class Hasher {
  constructor(
    @inject('HASHER_SALT')
    private readonly salt: number
  ) {}

  async hash(value: string): Promise<string> {
    return await bcrypt.hash(value, this.salt)
  }

  async compare(value: string, hashed: string): Promise<boolean> {
    return await bcrypt.compare(value, hashed)
  }
}
