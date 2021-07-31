import Joi from 'joi'
import { inject, singleton } from 'tsyringe'

import { PostsRepository } from '@database/repositories'
import { FieldError, ValidationError } from '@errors'

export interface ListPostsPayload {
  ownerId: string
  authenticatedId?: string
}

const validator = Joi.object<ListPostsPayload>().keys({
  ownerId: Joi.string().trim().uuid().required(),
  authenticatedId: Joi.string().trim().uuid().allow('', null)
})

@singleton()
export class ListPosts {
  constructor(
    @inject('PostsRepository')
    private readonly postsRepository: PostsRepository
  ) {}

  async execute(payload: ListPostsPayload) {
    const { ownerId, authenticatedId } = await this.validate(payload)
    return await this.postsRepository.findManyFromUser(ownerId, {
      publicOnly: ownerId !== authenticatedId
    })
  }

  private async validate(payload: ListPostsPayload): Promise<ListPostsPayload> {
    const { value, error } = validator.validate(payload, { abortEarly: false, stripUnknown: true })
    const errors = FieldError.generate(error)

    if (errors.length) {
      throw new ValidationError(errors)
    }

    return value
  }
}
