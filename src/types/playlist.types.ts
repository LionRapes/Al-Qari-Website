import type { Owner } from './common.types'

export interface ApiPlaylist {
  id: string
  title: string
  data: string
  is_public: boolean
  forked_from_id: string
  created_at: number
  updated_at: number
  owner?: Owner
  added_at?: string
  role?: string
}

export interface ApiPlaylistMember {
  user_id: string
  role: string
  username: string
  avatar_url: string
  added_at: string
}

export interface ApiPaginatedPlaylists {
  limit: number
  offset?: number
  query?: string
  playlists: ApiPlaylist[]
}

export interface ApiPlaylistMembersResponse {
  playlist_id: string
  members: ApiPlaylistMember[]
}

export interface ApiUserPlaylistsResponse {
  user_id: string
  playlists: ApiPlaylist[]
}

export interface ApiCreatePlaylistResponse {
  playlist_id: string
}

export interface ApiShareLinkResponse {
  share_token: string
}

export interface ApiJoinPlaylistResponse {
  playlist_id: string
  role: string
}

export interface ApiPlaylistRelation {
  playlist_id: string
  user_id: string
  role: string
  added_at?: string
}

export interface ApiCreatePlaylistRequest {
  title: string
  data: string
  is_public?: boolean
}

export interface ApiUpdatePlaylistRequest {
  title?: string
  data?: string
  is_public?: boolean
}

export interface ApiGenerateShareLinkRequest {
  role: string
  expires_in_hours?: number
}

export interface IPlaylistApi {
  createPlaylist(payload: ApiCreatePlaylistRequest): Promise<ApiCreatePlaylistResponse>
  getPublicPlaylists(limit?: number, offset?: number): Promise<ApiPaginatedPlaylists>
  getPlaylist(playlistId: string): Promise<ApiPlaylist>
  getUserSharedPlaylists(): Promise<ApiUserPlaylistsResponse>
  getUserOwnedPlaylists(): Promise<ApiUserPlaylistsResponse>
  searchPlaylists(q: string, limit?: number): Promise<ApiPaginatedPlaylists>

  updatePlaylist(playlistId: string, payload: ApiUpdatePlaylistRequest): Promise<void>
  deletePlaylist(playlistId: string): Promise<void>
  forkPlaylist(playlistId: string): Promise<ApiCreatePlaylistResponse>

  generateShareLink(
    playlistId: string,
    payload: ApiGenerateShareLinkRequest,
  ): Promise<ApiShareLinkResponse>
  joinPlaylist(token: string): Promise<ApiJoinPlaylistResponse>

  getMembers(playlistId: string): Promise<ApiPlaylistMembersResponse>
  getRelation(playlistId: string, userId: string): Promise<ApiPlaylistRelation>
  removeMember(playlistId: string, targetUserId: string): Promise<void>
}
