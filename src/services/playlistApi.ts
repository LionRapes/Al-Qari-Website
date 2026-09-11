import type {
  ApiPlaylist,
  ApiPaginatedPlaylists,
  ApiCreatePlaylistResponse,
  ApiShareLinkResponse,
  ApiJoinPlaylistResponse,
  ApiPlaylistMembersResponse,
  ApiPlaylistRelation,
  IPlaylistApi,
  ApiUserPlaylistsResponse,
  ApiUpdatePlaylistRequest,
  ApiGenerateShareLinkRequest,
} from '@/types/playlist.types'
import { getAuthHeaders } from '@/utils/authUtils'
import { cacheService } from './cacheService'
import { emitEvent } from '@/utils/eventUtils'

const API_BASE = import.meta.env.VITE_BACKEND_URL

const playlistApi: IPlaylistApi = {
  async createPlaylist(payload: ApiUpdatePlaylistRequest): Promise<ApiCreatePlaylistResponse> {
    const res = await fetch(`${API_BASE}/playlists/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error('Failed to create playlist')
    return res.json()
  },

  async getPlaylist(playlistId: string): Promise<ApiPlaylist> {
    return cacheService.fetchCached(`${API_BASE}/playlists/${playlistId}`, 5 * 60 * 1000)
  },

  async getPublicPlaylists(limit: number = 20, offset: number = 0): Promise<ApiPaginatedPlaylists> {
    const res = await fetch(`${API_BASE}/playlists/public?limit=${limit}&offset=${offset}`)
    if (!res.ok) throw new Error('Failed to fetch public playlists')
    return res.json()
  },

  async getUserSharedPlaylists(): Promise<ApiUserPlaylistsResponse> {
    const res = await fetch(`${API_BASE}/playlists/shared`, {
      headers: getAuthHeaders(),
    })
    if (!res.ok) throw new Error('Failed to fetch shared playlists')
    return res.json()
  },

  async getUserOwnedPlaylists(): Promise<ApiUserPlaylistsResponse> {
    const res = await fetch(`${API_BASE}/playlists/owned`, {
      headers: getAuthHeaders(),
    })
    if (!res.ok) throw new Error('Failed to fetch owned playlists')
    return res.json()
  },

  async searchPlaylists(q: string, limit: number = 20): Promise<ApiPaginatedPlaylists> {
    const res = await fetch(
      `${API_BASE}/playlists/search?q=${encodeURIComponent(q)}&limit=${limit}`,
      {
        headers: getAuthHeaders(),
      },
    )
    if (!res.ok) throw new Error('Failed to search playlists')
    return res.json()
  },

  async updatePlaylist(playlistId: string, payload: ApiUpdatePlaylistRequest): Promise<void> {
    const res = await fetch(`${API_BASE}/playlists/${playlistId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error('Failed to update playlist')

    await cacheService.updateCache<ApiPlaylist>(
      `${API_BASE}/playlists/${playlistId}`,
      (playlist) => ({
        ...playlist,
        title: payload.title || playlist.title,
        data: payload.data || playlist.data,
        is_public: payload.is_public || playlist.is_public,
      }),
    )
    emitEvent('PLAYLIST_UPDATED')
  },

  async deletePlaylist(playlistId: string): Promise<void> {
    const res = await fetch(`${API_BASE}/playlists/${playlistId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })
    if (!res.ok) throw new Error('Failed to delete playlist')

    await cacheService.deleteCache(`${API_BASE}/playlists/${playlistId}`)
    emitEvent('PLAYLIST_UPDATED')
  },

  async forkPlaylist(playlistId: string): Promise<ApiCreatePlaylistResponse> {
    const res = await fetch(`${API_BASE}/playlists/${playlistId}/fork`, {
      method: 'POST',
      headers: getAuthHeaders(),
    })
    if (!res.ok) throw new Error('Failed to fork playlist')
    return res.json()
  },

  async generateShareLink(
    playlistId: string,
    payload: ApiGenerateShareLinkRequest,
  ): Promise<ApiShareLinkResponse> {
    const res = await fetch(`${API_BASE}/playlists/${playlistId}/share`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
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

  async removeMember(playlistId: string, targetUserId: string): Promise<void> {
    const res = await fetch(`${API_BASE}/playlists/${playlistId}/members/${targetUserId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })
    if (!res.ok) throw new Error('Failed to remove member. You might not have permission.')
  },
}

export default playlistApi
