import { mapPostToPublicDetailDTO, mapPostToPublicListItemDTO } from '../mappers/post.mapper.js'
import { postRepository } from '../repositories/post.repository.js'
import { HttpError } from '../utils/httpError.js'

class BlogService {
  async listPublishedPosts(username: string) {
    const posts = await postRepository.findPublishedByUsername(username)
    return posts.map(mapPostToPublicListItemDTO)
  }

  async getPublishedPost(username: string, postId: string) {
    const post = await postRepository.findPublishedDetail(username, postId)

    if (!post) {
      throw new HttpError(404, 'NotFound', 'Published post not found.')
    }

    return mapPostToPublicDetailDTO(post)
  }
}

export const blogService = new BlogService()
