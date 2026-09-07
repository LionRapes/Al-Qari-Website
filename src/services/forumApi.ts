import { getAuthHeaders } from '@/utils/authUtils'
import type {
  ApiCategoryResponse,
  ApiPaginatedTopics,
  ApiTopicCreateRequest,
  ApiTopicModerateRequest,
  ApiPaginatedPosts,
  ApiPostCreateRequest,
  ApiPostUpdateRequest,
  IForumApi,
} from '@/types/forum.types'

const API_BASE = import.meta.env.VITE_BACKEND_URL

export const forumApi: IForumApi = {
  async getCategories(): Promise<ApiCategoryResponse[]> {
    const res = await fetch(`${API_BASE}/forum/categories`, {
      headers: getAuthHeaders(),
    })
    if (!res.ok) throw new Error('Failed to fetch categories')
    return res.json()
  },

  async getTopics(
    categoryId: string,
    cursor?: string,
    limit: number = 20,
  ): Promise<ApiPaginatedTopics> {
    const url = new URL(`${API_BASE}/forum/categories/${categoryId}/topics`)
    url.searchParams.append('limit', limit.toString())
    if (cursor) url.searchParams.append('cursor', cursor)

    const res = await fetch(url.toString(), {
      headers: getAuthHeaders(),
    })
    if (!res.ok) throw new Error('Failed to fetch topics')
    return res.json()
  },

  async createTopic(categoryId: string, payload: ApiTopicCreateRequest): Promise<void> {
    const res = await fetch(`${API_BASE}/forum/categories/${categoryId}/topics`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error('Failed to create topic')
  },

  async moderateTopic(topicId: string, payload: ApiTopicModerateRequest): Promise<void> {
    const res = await fetch(`${API_BASE}/forum/topics/${topicId}/moderate`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error('Failed to moderate topic')
  },

  async getPosts(topicId: string, cursor?: string, limit: number = 50): Promise<ApiPaginatedPosts> {
    const url = new URL(`${API_BASE}/forum/topics/${topicId}/posts`)
    url.searchParams.append('limit', limit.toString())
    if (cursor) url.searchParams.append('cursor', cursor)

    const res = await fetch(url.toString(), {
      headers: getAuthHeaders(),
    })
    if (!res.ok) throw new Error('Failed to fetch posts')
    return res.json()
  },

  async createPost(topicId: string, payload: ApiPostCreateRequest): Promise<void> {
    const res = await fetch(`${API_BASE}/forum/topics/${topicId}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error('Failed to create post')
  },

  async editPost(postId: string, payload: ApiPostUpdateRequest): Promise<void> {
    const res = await fetch(`${API_BASE}/forum/posts/${postId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error('Failed to edit post')
  },
}

export default forumApi
