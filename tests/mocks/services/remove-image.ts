import { RemoveImage } from '@services/storage/remove-image'

export const makeRemoveImage = (): RemoveImage => {
  class RemoveImageStub implements Partial<RemoveImage> {
    async execute(): Promise<void> {}
  }

  return new RemoveImageStub() as any
}
