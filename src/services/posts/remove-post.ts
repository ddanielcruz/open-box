import Joi from 'joi'
import { inject, singleton } from 'tsyringe'

import { PostsRepository } from '@database/repositories'
import { FieldError, ForbiddenError, NotFoundError, ValidationError } from '@errors'
import { Post } from '@prisma/client'
import { RemoveImage } from '@services/storage/remove-image'

export interface RemovePostPayload {
  userId: string
  postId: string
}

const validator = Joi.object<RemovePostPayload>().keys({
  userId: Joi.string().trim().uuid().required(),
  postId: Joi.string().trim().uuid().required()
})

@singleton()
export class RemovePost {
  constructor(
    @inject('PostsRepository')
    private readonly postsRepository: PostsRepository,
    private readonly removeImage: RemoveImage
  ) {}

  async execute(payload: RemovePostPayload) {
    const post = await this.validate(payload)
    await this.removeImage.execute({ key: post.key })
    await this.postsRepository.delete(post.id)
  }

  private async validate(payload: RemovePostPayload): Promise<Post> {
    const { error, value } = validator.validate(payload, { abortEarly: false, stripUnknown: true })
    const errors = FieldError.generate(error)
    let post: Post

    if (!FieldError.includes(errors, 'userId', 'postId')) {
      post = await this.postsRepository.findById(value.postId)
      if (!post) {
        throw new NotFoundError('Post not found.')
      } else if (post.userId !== value.userId) {
        throw new ForbiddenError()
      }
    }

    if (errors.length) {
      throw new ValidationError(errors)
    }

    return post
  }
}
