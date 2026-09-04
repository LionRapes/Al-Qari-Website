import type { IUserApi, ApiAuthResponse, ApiUserProfile } from '@/types/user.types'
import type { ApiMessageResponse } from '@/types/common.types'
import { getAuthHeaders, handleApiError } from '@/utils/authUtils'
import { cacheService } from './cacheService'
import { emitEvent } from '@/utils/eventUtils'

const API_BASE = import.meta.env.VITE_BACKEND_URL

const userApi: IUserApi = {
  async getUserProfile(userId: string): Promise<ApiUserProfile> {
    return cacheService.fetchCached(`${API_BASE}/users/${userId}`, 5 * 60 * 1000)
  },

  async requestMagicLink(email: string, lang: string): Promise<ApiMessageResponse> {
    const res = await fetch(`${API_BASE}/users/auth/magic-link`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, lang }),
    })

    handleApiError(res, 'Failed to request magic link')
    return res.json()
  },

  async verifyMagicLink(token: string): Promise<ApiAuthResponse> {
    const res = await fetch(`${API_BASE}/users/auth/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })

    handleApiError(res, 'Invalid or expired token')
    return res.json()
  },

  async updateUserProfile(userId: string, username: string): Promise<ApiMessageResponse> {
    const res = await fetch(`${API_BASE}/users/${userId}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ username }),
    })

    handleApiError(res, 'Failed to update profile')

    await cacheService.updateCache<ApiUserProfile>(`${API_BASE}/users/${userId}`, (profile) => ({
      ...profile,
      username,
    }))
    emitEvent('USER_PROFILE_UPDATED')

    return res.json()
  },

  async uploadAvatar(userId: string, file: File): Promise<{ message: string; avatar_url: string }> {
    const formData = new FormData()
    formData.append('file', file)

    const res = await fetch(`${API_BASE}/users/${userId}/avatar`, {
      method: 'POST',
      headers: getAuthHeaders(true),
      body: formData,
    })

    handleApiError(res, 'Failed to upload avatar')

    const responseData = await res.json()
    await cacheService.updateCache<ApiUserProfile>(`${API_BASE}/users/${userId}`, (profile) => ({
      ...profile,
      avatar_url: responseData.avatar_url,
    }))
    emitEvent('USER_PROFILE_UPDATED')

    return responseData
  },

  async deleteUser(userId: string): Promise<void> {
    const res = await fetch(`${API_BASE}/users/${userId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })

    handleApiError(res, 'Failed to delete user')
  },
}

export default userApi
