import fs from 'fs'

import { RemoveImagePayload } from '@services/storage/remove-image'

const makeSut = async (storageType?: string) => {
  const { RemoveImage } = await import('@services/storage/remove-image')
  const sut = new RemoveImage(storageType ?? 'local')

  return { sut }
}

const makePayload = (): RemoveImagePayload => ({ key: 'any-key' })

describe('RemoveImage', () => {
  const unlinkMock = jest.fn()

  beforeAll(() => {
    jest.mock('util', () => ({
      promisify: (func: any) => {
        expect(func).toEqual(fs.unlink)
        return unlinkMock
      }
    }))
  })

  test.each([[null], ['']])('show throw when fails validation: %s', async key => {
    const { sut } = await makeSut()
    const promise = sut.execute({ key })
    await expect(promise).rejects.toThrow()
  })

  test('should throw when storage type is not found', async () => {
    const { sut } = await makeSut('any-storage')
    const promise = sut.execute(makePayload())
    await expect(promise).rejects.toThrow()
  })

  test('should throw when storage type is not implemented', async () => {
    const { sut } = await makeSut('s3')
    const promise = sut.execute(makePayload())
    await expect(promise).rejects.toThrow()
  })

  test('should remove image using unlink', async () => {
    const { sut } = await makeSut('local')
    await sut.execute(makePayload())
    expect(unlinkMock).toHaveBeenCalledWith(expect.any(String))
  })
})
