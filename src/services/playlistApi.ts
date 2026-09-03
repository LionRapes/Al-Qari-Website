import type { ApiMessageResponse } from '@/types/common.types'
import type {
  ApiPlaylist,
  ApiPaginatedPlaylists,
  ApiCreatePlaylistResponse,
  ApiForkPlaylistResponse,
  ApiShareLinkResponse,
  ApiJoinPlaylistResponse,
  ApiPlaylistMembersResponse,
  ApiPlaylistRelation,
  ApiUserSharedPlaylistsResponse,
  ApiUserOwnedPlaylistsResponse,
} from '@/types/playlist.types'
import getAuthHeaders from '@/utils/authUtils'

const API_BASE = import.meta.env.VITE_BACKEND_URL

const playlistApi = {
  async getPublicPlaylists(limit: number = 20, offset: number = 0): Promise<ApiPaginatedPlaylists> {
    const res = await fetch(`${API_BASE}/playlists/public?limit=${limit}&offset=${offset}`, {
      headers: getAuthHeaders(),
    })
    if (!res.ok) throw new Error('Failed to fetch public playlists')
    return res.json()
  },

  async searchPlaylists(q: string, limit: number = 20): Promise<ApiPaginatedPlaylists> {
    const res = await fetch(`${API_BASE}/playlists/search?q=${q}&limit=${limit}`, {
      headers: getAuthHeaders(),
    })
    if (!res.ok) throw new Error('Failed to search playlists')
    return res.json()
  },

  async createPlaylist(payload: {
    title: string
    data: string
    is_public?: boolean
  }): Promise<ApiCreatePlaylistResponse> {
    const res = await fetch(`${API_BASE}/playlists/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error('Failed to create playlist')
    return res.json()
  },

  async getPlaylist(playlistId: string): Promise<ApiPlaylist> {
    const res = await fetch(`${API_BASE}/playlists/${playlistId}`, {
      headers: getAuthHeaders(),
    })
    if (!res.ok) throw new Error('Failed to fetch playlist')
    return res.json()
  },

  async updatePlaylist(
    playlistId: string,
    payload: { title?: string; data?: string; is_public?: boolean },
  ): Promise<ApiMessageResponse> {
    const res = await fetch(`${API_BASE}/playlists/${playlistId}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error('Failed to update playlist')
    return res.json()
  },

  async deletePlaylist(playlistId: string): Promise<void> {
    const res = await fetch(`${API_BASE}/playlists/${playlistId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })
    if (!res.ok) throw new Error('Failed to delete playlist')
  },

  async forkPlaylist(playlistId: string): Promise<ApiForkPlaylistResponse> {
    const res = await fetch(`${API_BASE}/playlists/${playlistId}/fork`, {
      method: 'POST',
      headers: getAuthHeaders(),
    })
    if (!res.ok) throw new Error('Failed to fork playlist')
    return res.json()
  },

  async generateShareLink(
    playlistId: string,
    payload: { role: string; expires_in_hours?: number },
  ): Promise<ApiShareLinkResponse> {
    const res = await fetch(`${API_BASE}/playlists/${playlistId}/share`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error('Failed to generate share link')
    return res.json()
  },

  async joinPlaylist(token: string): Promise<ApiJoinPlaylistResponse> {
    const res = await fetch(`${API_BASE}/playlists/join/${token}`, {
      method: 'POST',
      headers: getAuthHeaders(),
    })
    if (!res.ok) throw new Error('Failed to join playlist. Token may be invalid or expired.')
    return res.json()
  },

  async getMembers(playlistId: string): Promise<ApiPlaylistMembersResponse> {
    const res = await fetch(`${API_BASE}/playlists/${playlistId}/members`, {
      headers: getAuthHeaders(),
    })
    if (!res.ok) throw new Error('Failed to fetch playlist members')
    return res.json()
  },

  async getRelation(playlistId: string, userId: string): Promise<ApiPlaylistRelation> {
    const res = await fetch(`${API_BASE}/playlists/${playlistId}/members/${userId}`, {
      headers: getAuthHeaders(),
    })
    if (!res.ok) throw new Error('Failed to fetch user relation to playlist')
    return res.json()
  },

  async removeMember(playlistId: string, targetUserId: string): Promise<ApiMessageResponse> {
    const res = await fetch(`${API_BASE}/playlists/${playlistId}/members/${targetUserId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })
    if (!res.ok) throw new Error('Failed to remove member. You might not have permission.')
    return res.json()
  },

  async getUserSharedPlaylists(userId: string): Promise<ApiUserSharedPlaylistsResponse> {
    const res = await fetch(`${API_BASE}/playlists/user/${userId}/shared`, {
      headers: getAuthHeaders(),
    })
    if (!res.ok) throw new Error('Failed to fetch shared playlists')
    return res.json()
  },

  async getUserOwnedPlaylists(userId: string): Promise<ApiUserOwnedPlaylistsResponse> {
    const res = await fetch(`${API_BASE}/playlists/user/${userId}/owned`, {
      headers: getAuthHeaders(),
    })
    if (!res.ok) throw new Error('Failed to fetch owned playlists')
    return res.json()
  },
}

export default playlistApi
