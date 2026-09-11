import type { IUserApi, ApiAuthResponse, ApiUserProfile, ApiAvatarUpload } from '@/types/user.types'
import { getAuthHeaders, getUserId, handleApiError } from '@/utils/authUtils'
import { cacheService } from './cacheService'
import { emitEvent } from '@/utils/eventUtils'

const API_BASE = import.meta.env.VITE_BACKEND_URL

const userApi: IUserApi = {
  async requestMagicLink(email: string, lang: string): Promise<void> {
    const res = await fetch(`${API_BASE}/users/auth/magic-link`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, lang }),
    })

    handleApiError(res, 'Failed to request magic link')
  },

  async verifyMagicLink(token: string): Promise<ApiAuthResponse> {
    const res = await fetch(`${API_BASE}/users/auth/verify?token=${encodeURIComponent(token)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })

    handleApiError(res, 'Invalid or expired token')
    return res.json()
  },

  async getUserProfile(userId: string): Promise<ApiUserProfile> {
    return cacheService.fetchCached(`${API_BASE}/users/${userId}`, 5 * 60 * 1000)
  },

  async updateUserProfile(username: string): Promise<void> {
    const res = await fetch(`${API_BASE}/users`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ username }),
    })

    handleApiError(res, 'Failed to update profile')

    await cacheService.updateCache<ApiUserProfile>(
      `${API_BASE}/users/${getUserId()}`,
      (profile) => ({
        ...profile,
        username,
      }),
    )
    emitEvent('USER_PROFILE_UPDATED')
  },

  async uploadAvatar(file: File): Promise<ApiAvatarUpload> {
    const formData = new FormData()
    formData.append('file', file)

    const res = await fetch(`${API_BASE}/users/avatar`, {
      method: 'POST',
      headers: getAuthHeaders(true),
      body: formData,
    })

    handleApiError(res, 'Failed to upload avatar')

    const responseData = await res.json()
    await cacheService.updateCache<ApiUserProfile>(
      `${API_BASE}/users/${getUserId()}`,
      (profile) => ({
        ...profile,
        avatar_url: responseData.avatar_url,
      }),
    )
    emitEvent('USER_PROFILE_UPDATED')

    return responseData
  },

  async deleteUser(): Promise<void> {
    const res = await fetch(`${API_BASE}/users`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })

    handleApiError(res, 'Failed to delete user')
  },

  async banUser(userId: string, reason?: string): Promise<void> {
    const url = new URL(`${API_BASE}/users/${userId}/ban`)

    if (reason) {
      url.searchParams.append('reason', reason)
    }

    const res = await fetch(url.toString(), {
      method: 'POST',
      headers: getAuthHeaders(),
    })

    handleApiError(res, 'Failed to ban user')
  },

  async unbanUser(userId: string): Promise<void> {
    const res = await fetch(`${API_BASE}/users/${userId}/ban`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })

    handleApiError(res, 'Failed to unban user')
  },
}

export default userApi
