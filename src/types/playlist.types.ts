import type { ApiMessageResponse } from './common.types'

// --- Core Models ---
export interface ApiPlaylist {
  id: string
  owner_id: string
  title: string
  data: string
  is_public: boolean
  forked_from_id: string
  created_at: string
  updated_at: string
  added_at?: string
  role?: string
  owner?: {
    id: string
    username: string
    avatar_url: string
  }
}

export interface ApiPlaylistMember {
  user_id: string
  role: string
  username: string
  avatar_url: string
  added_at: string
}

export interface ApiUserSharedPlaylist {
  playlist_id: string
  title: string
  is_public: boolean
  role: string
  added_at: string
  owner?: {
    id: string
    username: string
    avatar_url: string
  }
}

export interface PlaylistItem {
  surahNumber: number
  riwayahId: string
  reciterId: string
  translationId: string
  tafsirId: string
  ayahs: number[]
}

// --- Response & Payload Types ---

export interface ApiPaginatedPlaylists {
  limit: number
  offset?: number
  query?: string
  playlists: ApiPlaylist[]
}

export interface ApiCreatePlaylistResponse {
  playlist_id: string
  message: string
}

export interface ApiForkPlaylistResponse {
  new_playlist_id: string
  message: string
}

export interface ApiShareLinkResponse {
  share_token: string
  expires_in_hours: number
}

export interface ApiJoinPlaylistResponse {
  message: string
  playlist_id: string
  role: string
}

export interface ApiPlaylistMembersResponse {
  playlist_id: string
  members: ApiPlaylistMember[]
}

export interface ApiPlaylistRelation {
  playlist_id: string
  user_id: string
  role: string
  added_at?: string
}

export interface ApiUserSharedPlaylistsResponse {
  user_id: string
  playlists: ApiUserSharedPlaylist[]
}

export interface ApiUserOwnedPlaylistsResponse {
  user_id: string
  playlists: ApiPlaylist[]
}

export interface IPlaylistApi {
  getPublicPlaylists(limit?: number, offset?: number): Promise<ApiPaginatedPlaylists>
  searchPlaylists(q: string, limit?: number): Promise<ApiPaginatedPlaylists>
  createPlaylist(payload: {
    title: string
    data: string
    is_public?: boolean
  }): Promise<ApiCreatePlaylistResponse>
  getPlaylist(playlistId: string): Promise<ApiPlaylist>
  updatePlaylist(
    playlistId: string,
    payload: { title?: string; data?: string; is_public?: boolean },
  ): Promise<ApiMessageResponse>
  deletePlaylist(playlistId: string): Promise<void>
  forkPlaylist(playlistId: string): Promise<ApiForkPlaylistResponse>
  generateShareLink(
    playlistId: string,
    payload: { role: string; expires_in_hours?: number },
  ): Promise<ApiShareLinkResponse>
  joinPlaylist(token: string): Promise<ApiJoinPlaylistResponse>
  getMembers(playlistId: string): Promise<ApiPlaylistMembersResponse>
  getRelation(playlistId: string, userId: string): Promise<ApiPlaylistRelation>
  removeMember(playlistId: string, targetUserId: string): Promise<ApiMessageResponse>
  getUserSharedPlaylists(userId: string): Promise<ApiUserSharedPlaylistsResponse>
  getUserOwnedPlaylists(userId: string): Promise<ApiUserOwnedPlaylistsResponse>
}
