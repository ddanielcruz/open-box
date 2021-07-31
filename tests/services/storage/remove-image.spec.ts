import fs from 'fs'

import { RemoveImagePayload } from '@services/storage/remove-image'

const makeSut = async (storageType?: string) => {
  const { RemoveImage } = await import('@services/storage/remove-image')
  const sut = new RemoveImage(storageType ?? 'local')

  return { sut }
}

const makePayload = (): RemoveImagePayload => ({ key: 'any-key' })

describe('RemoveImage', () => {
  const deleteObjectMock = jest.fn(() => ({ promise: jest.fn() }))
  const unlinkMock = jest.fn()

  beforeAll(() => {
    process.env.AWS_BUCKET_NAME = 'any-bucket'
    jest.mock('util', () => ({
      promisify: (func: any) => {
        expect(func).toEqual(fs.unlink)
        return unlinkMock
      }
    }))

    jest.mock('aws-sdk', () => ({ S3: jest.fn(() => ({ deleteObject: deleteObjectMock })) }))
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

  test('should remove local image using unlink', async () => {
    const { sut } = await makeSut('local')
    await sut.execute(makePayload())
    expect(unlinkMock).toHaveBeenCalledWith(expect.any(String))
  })

  test('should remove S3 image using aws-sdk', async () => {
    const { sut } = await makeSut('s3')
    await sut.execute(makePayload())
    expect(deleteObjectMock).toHaveBeenCalledWith({
      Bucket: 'any-bucket',
      Key: 'any-key'
    })
  })
})
