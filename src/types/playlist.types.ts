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
