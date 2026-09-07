// Core user identity and profile data
export interface ApiUserProfile {
  id: string
  email: string
  username: string
  created_at: number
  avatar_url: string
  role: string
}

// Uploading payload returned upon successful avatar upload
export interface ApiAvatarUpload {
  avatar_url: string
}

// Authentication payload returned upon successful login
export interface ApiAuthResponse {
  access_token: string
  token_type: string
  user_id: string
  is_new: boolean
}

// Contract for User-related network requests
export interface IUserApi {
  requestMagicLink(email: string, lang: string): Promise<void>
  verifyMagicLink(token: string): Promise<ApiAuthResponse>
  getUserProfile(userId: string): Promise<ApiUserProfile>
  updateUserProfile(userId: string, username: string): Promise<void>
  uploadAvatar(userId: string, file: File): Promise<ApiAvatarUpload>
  deleteUser(userId: string): Promise<void>
}
