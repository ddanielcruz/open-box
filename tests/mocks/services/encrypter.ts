import { Encrypter } from '@services/cryptography/encrypter'

export const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Partial<Encrypter> {
    async decrypt(): Promise<any> {
      return 'any-value'
    }

    async encrypt(): Promise<string> {
      return 'any-token'
    }
  }

  return new EncrypterStub() as any
}
