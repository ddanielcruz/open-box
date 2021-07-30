import Joi from 'joi'
import { inject, singleton } from 'tsyringe'

import { PostsRepository, PostUpdate } from '@database/repositories'
import { FieldError, ForbiddenError, NotFoundError, ValidationError } from '@errors'

export interface UpdatePostPayload extends PostUpdate {
  userId: string
}

const validator = Joi.object<UpdatePostPayload>().keys({
  id: Joi.string().trim().uuid().required(),
  userId: Joi.string().trim().uuid().required(),
  closed: Joi.boolean().required()
})

@singleton()
export class UpdatePost {
  constructor(
    @inject('PostsRepository')
    private readonly postsRepository: PostsRepository
  ) {}

  async execute(payload: UpdatePostPayload) {
    const sanitizedPayload = await this.validate(payload)
    return await this.postsRepository.update(sanitizedPayload)
  }

  private async validate(payload: UpdatePostPayload): Promise<UpdatePostPayload> {
    const { error, value } = validator.validate(payload, { abortEarly: false, stripUnknown: true })
    const errors = FieldError.generate(error)

    if (!FieldError.includes(errors, 'id', 'userId')) {
      const post = await this.postsRepository.findById(value.id)
      if (!post) {
        throw new NotFoundError('Post not found.')
      } else if (post.userId !== value.userId) {
        throw new ForbiddenError()
      }
    }

    if (errors.length) {
      throw new ValidationError(errors)
    }

    return value
  }
}
