export interface ApiCategory {
  id: string
  title: string
  slug: string
  description: string
  created_at: number
}

export interface ApiTopic {
  id: string
  category_id: string
  user_id: string
  title: string
  is_pinned: boolean
  is_locked: boolean
  created_at: number
  updated_at: number
  owner?: {
    owner_id: string
    username: string
    avatar_url: string
  }
}

export interface ApiPost {
  id: string
  topic_id: string
  user_id: string
  content: string
  parent_post_id?: string
  created_at: number
  updated_at: number
  owner?: {
    owner_id: string
    username: string
    avatar_url: string
  }
}

export type ApiCategoryResponse = ApiCategory

export interface ApiPaginatedTopics {
  items: ApiTopic[]
  next_cursor?: string
  limit: number
}

export interface ApiPaginatedPosts {
  items: ApiPost[]
  next_cursor?: string
  limit: number
}

export interface ApiTopicCreateRequest {
  title: string
  content: string
}

export interface ApiTopicModerateRequest {
  is_locked?: boolean
  is_pinned?: boolean
}

export interface ApiPostCreateRequest {
  content: string
  parent_post_id?: string
}

export interface ApiPostUpdateRequest {
  content: string
}

export interface IForumApi {
  getCategories(): Promise<ApiCategoryResponse[]>
  getTopics(categoryId: string, cursor?: string, limit?: number): Promise<ApiPaginatedTopics>
  createTopic(categoryId: string, payload: ApiTopicCreateRequest): Promise<void>
  moderateTopic(topicId: string, payload: ApiTopicModerateRequest): Promise<void>
  getPosts(topicId: string, cursor?: string, limit?: number): Promise<ApiPaginatedPosts>
  createPost(topicId: string, payload: ApiPostCreateRequest): Promise<void>
  editPost(postId: string, payload: ApiPostUpdateRequest): Promise<void>
}
