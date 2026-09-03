import type { ApiMessageResponse } from './common.types'

// Core user identity and profile data
export interface ApiUserProfile {
  id: string
  email: string
  username: string
  created_at: string
  avatar_url: string
}

// Authentication payload returned upon successful login
export interface ApiAuthResponse {
  access_token: string
  token_type: string
  user_id: string
  is_new?: boolean
}

// Contract for User-related network requests
export interface IUserApi {
  requestMagicLink(email: string): Promise<ApiMessageResponse>
  verifyMagicLink(token: string): Promise<ApiAuthResponse>
  getUserProfile(userId: string): Promise<ApiUserProfile>
  updateUserProfile(userId: string, username: string): Promise<ApiMessageResponse>
  uploadAvatar(userId: string, file: File): Promise<{ message: string; avatar_url: string }>
  deleteUser(userId: string): Promise<void>
}
