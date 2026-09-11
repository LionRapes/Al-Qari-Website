import type { Owner } from './common.types'

export interface ApiCategory {
  id: string
  title: string
  slug: string
  description: string
  created_at: number
  is_restricted: boolean
}

export interface ApiTopic {
  id: string
  category_id: string
  title: string
  views_count: number
  user_id: string
  is_pinned: boolean
  is_locked: boolean
  created_at: number
  updated_at: number
  owner?: Owner
}

export interface ApiPost {
  id: string
  topic_id: string
  parent_post_id?: string
  content_markdown: string
  is_edited: boolean
  edited_at: number
  edited_by: string
  created_at: number
  owner?: Owner
}

export type ApiCategoryResponse = ApiCategory

export interface ApiPaginatedTopics {
  items: ApiTopic[]
  next_cursor?: number
  limit: number
}

export interface ApiPaginatedPosts {
  items: ApiPost[]
  next_cursor?: number
  limit: number
}

export interface ApiTopicCreateRequest {
  title: string
  content: string
}

export interface ApiTopicModerateRequest {
  is_locked?: boolean
  is_pinned?: boolean
  reason?: string
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
  getCategory(categoryId: string): Promise<ApiCategoryResponse>
  getTopics(categoryId: string, cursor?: number, limit?: number): Promise<ApiPaginatedTopics>
  getTopic(topicId: string): Promise<ApiTopic>
  createTopic(categoryId: string, payload: ApiTopicCreateRequest): Promise<void>
  moderateTopic(topicId: string, payload: ApiTopicModerateRequest): Promise<void>
  getPosts(topicId: string, cursor?: number, limit?: number): Promise<ApiPaginatedPosts>
  createPost(topicId: string, payload: ApiPostCreateRequest): Promise<void>
  editPost(postId: string, payload: ApiPostUpdateRequest): Promise<void>
  deletePost(postId: string, reason: string): Promise<void>
  deleteTopic(topicId: string, reason: string): Promise<void>
}
