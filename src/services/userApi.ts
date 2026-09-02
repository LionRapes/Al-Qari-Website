import type { ApiUserProfile, ApiAuthResponse, ApiMessageResponse, IUserApi } from '@/types/index'

const API_BASE = import.meta.env.VITE_BACKEND_URL

const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('access_token')
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }
}

const userApi: IUserApi = {
  async requestMagicLink(email: string): Promise<ApiMessageResponse> {
    const res = await fetch(`${API_BASE}/users/auth/magic-link`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    if (!res.ok) throw new Error('Failed to request magic link')
    return res.json()
  },

  async verifyMagicLink(token: string): Promise<ApiAuthResponse> {
    const res = await fetch(`${API_BASE}/users/auth/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
    if (!res.ok) throw new Error('Invalid or expired token')
    return res.json()
  },

  async getUserProfile(userId: string): Promise<ApiUserProfile> {
    const res = await fetch(`${API_BASE}/users/${userId}`, {
      headers: getAuthHeaders(),
    })
    if (!res.ok) {
      if (res.status === 401) {
        localStorage.removeItem('access_token')
        localStorage.removeItem('user_id')
      }
      throw new Error('Failed to fetch user profile')
    }
    return res.json()
  },

  async updateUserProfile(userId: string, username: string): Promise<ApiMessageResponse> {
    const res = await fetch(`${API_BASE}/users/${userId}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ username }),
    })
    if (!res.ok) throw new Error('Failed to update profile')
    return res.json()
  },

  async uploadAvatar(userId: string, file: File): Promise<{ message: string; avatar_url: string }> {
    const formData = new FormData()
    formData.append('file', file)

    const token = localStorage.getItem('access_token')
    const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {}

    const res = await fetch(`${API_BASE}/users/${userId}/avatar`, {
      method: 'POST',
      headers,
      body: formData,
    })

    if (!res.ok) {
      if (res.status === 401) {
        localStorage.removeItem('access_token')
        localStorage.removeItem('user_id')
      }
      throw new Error('Failed to upload avatar')
    }
    return res.json()
  },

  async deleteUser(userId: string): Promise<void> {
    const res = await fetch(`${API_BASE}/users/${userId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })
    if (!res.ok) throw new Error('Failed to delete user')
  },
}

export default userApi
