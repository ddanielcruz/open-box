import { Hasher } from '@services/cryptography/hasher'

export const makeHasher = (): Hasher => {
  class HasherStub implements Partial<Hasher> {
    async hash(): Promise<string> {
      return 'hashed-value'
    }

    async compare(): Promise<boolean> {
      return true
    }
  }

  return new HasherStub() as any as Hasher
}
