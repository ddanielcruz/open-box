import { Post } from '@prisma/client'

type PostView = Omit<Post, 'userId' | 'closed'>

export function single(post: Post): PostView {
  return {
    id: post.id,
    key: post.key,
    name: post.name,
    url: post.url,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt
  }
}

export function many(posts: Post[]): PostView[] {
  return posts.map(single)
}
