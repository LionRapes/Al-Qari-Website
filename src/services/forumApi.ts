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
  ApiTopic,
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

  async getCategory(categoryId: string): Promise<ApiCategoryResponse> {
    const res = await fetch(`${API_BASE}/forum/categories/${categoryId}`, {
      headers: getAuthHeaders(),
    })
    if (!res.ok) throw new Error('Failed to fetch category details')
    return res.json()
  },

  async getTopics(
    categoryId: string,
    cursor?: number,
    limit: number = 20,
  ): Promise<ApiPaginatedTopics> {
    const url = new URL(`${API_BASE}/forum/categories/${categoryId}/topics?limit=${limit}`)
    if (cursor) url.searchParams.append('cursor', cursor.toString())

    const res = await fetch(url.toString(), {
      headers: getAuthHeaders(),
    })
    if (!res.ok) throw new Error('Failed to fetch topics')
    return res.json()
  },

  async getTopic(topicId: string): Promise<ApiTopic> {
    const res = await fetch(`${API_BASE}/forum/topics/${topicId}`, {
      headers: getAuthHeaders(),
    })
    if (!res.ok) throw new Error('Failed to fetch topic details')
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

  async getPosts(topicId: string, cursor?: number, limit: number = 50): Promise<ApiPaginatedPosts> {
    const url = new URL(`${API_BASE}/forum/topics/${topicId}/posts?limit=${limit}`)
    if (cursor) url.searchParams.append('cursor', cursor.toString())

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

  async deletePost(postId: string, reason?: string): Promise<void> {
    const url = new URL(`${API_BASE}/forum/posts/${postId}`)
    if (reason) url.searchParams.append('reason', reason)

    const res = await fetch(url.toString(), {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })

    if (!res.ok) throw new Error('Failed to delete post')
  },

  async deleteTopic(topicId: string, reason: string): Promise<void> {
    const url = new URL(`${API_BASE}/forum/topics/${topicId}`)
    if (reason) url.searchParams.append('reason', reason)

    const res = await fetch(url.toString(), {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })

    if (!res.ok) throw new Error('Failed to delete topic')
  },
}

export default forumApi
