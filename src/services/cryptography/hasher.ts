import bcrypt from 'bcrypt'

export class Hasher {
  constructor(private readonly salt: number) {}

  async hash(value: string): Promise<string> {
    return await bcrypt.hash(value, this.salt)
  }

  async compare(value: string, hashed: string): Promise<boolean> {
    return await bcrypt.compare(value, hashed)
  }
}
