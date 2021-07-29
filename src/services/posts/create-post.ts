import Joi from 'joi'
import { inject, singleton } from 'tsyringe'

import { PostCreate, PostsRepository, UsersRepository } from '@database/repositories'
import { FieldError, NotFoundError, ValidationError } from '@errors'
import { Post } from '@prisma/client'

const validator = Joi.object<PostCreate>().keys({
  userId: Joi.string().trim().uuid().required(),
  name: Joi.string().trim().required(),
  key: Joi.string().trim().required(),
  url: Joi.string().trim().required(),
  closed: Joi.boolean().required().default(true)
})

@singleton()
export class CreatePost {
  constructor(
    @inject('UsersRepository')
    private readonly usersRepository: UsersRepository,

    @inject('PostsRepository')
    private readonly postsRepository: PostsRepository
  ) {}

  async execute(payload: PostCreate): Promise<Post> {
    const sanitizedPayload = await this.validate(payload)
    return await this.postsRepository.create(sanitizedPayload)
  }

  private async validate(payload: PostCreate): Promise<PostCreate> {
    const { value, error } = validator.validate(payload, { abortEarly: false, stripUnknown: true })
    const errors = FieldError.generate(error)

    if (!FieldError.includes(errors, 'userId')) {
      const user = await this.usersRepository.findById(value.userId)
      if (!user) {
        throw new NotFoundError('User not found.')
      }
    }

    if (errors.length) {
      throw new ValidationError(errors)
    }

    return value
  }
}
