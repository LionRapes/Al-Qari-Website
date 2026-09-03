import { ref, computed } from 'vue'
import playlistApi from '@/services/playlistApi'

export interface PlaylistSummary {
  id: string
  title: string
  isPublic: boolean
  role: string
  ownerId?: string
}

export function usePlaylistsLibrary() {
  const ownedPlaylists = ref<PlaylistSummary[]>([])
  const sharedPlaylists = ref<PlaylistSummary[]>([])
  const publicPlaylists = ref<PlaylistSummary[]>([])

  const personalPlaylistIds = computed(() => {
    const ids = new Set<string>()
    for (const p of ownedPlaylists.value) ids.add(p.id)
    for (const p of sharedPlaylists.value) ids.add(p.id)
    return ids
  })

  const discoverPlaylists = computed(() => {
    const currentUserId = localStorage.getItem('user_id') || ''
    return publicPlaylists.value.filter((p) => {
      if (personalPlaylistIds.value.has(p.id)) return false
      if (currentUserId && p.ownerId === currentUserId) return false
      return true
    })
  })

  const isLoadingPersonal = ref(true)
  const isLoadingPublic = ref(true)
  const searchQuery = ref('')

  const fetchPersonalPlaylists = async (userId: string) => {
    isLoadingPersonal.value = true
    try {
      const [ownedRes, sharedRes] = await Promise.all([
        playlistApi.getUserOwnedPlaylists(userId),
        playlistApi.getUserSharedPlaylists(userId),
      ])

      ownedPlaylists.value = ownedRes.playlists.map((p) => ({
        id: p.id,
        title: p.title,
        isPublic: p.is_public,
        role: 'owner',
      }))

      sharedPlaylists.value = sharedRes.playlists.map((p) => ({
        id: p.playlist_id,
        title: p.title,
        isPublic: p.is_public,
        role: p.role,
      }))
    } catch (error) {
      console.error('Failed to load personal playlists:', error)
    } finally {
      isLoadingPersonal.value = false
    }
  }

  const fetchPublicPlaylists = async () => {
    isLoadingPublic.value = true
    try {
      const res = await playlistApi.getPublicPlaylists(10, 0)
      publicPlaylists.value = res.playlists.map((p) => ({
        id: p.id,
        title: p.title,
        isPublic: p.is_public,
        role: 'viewer',
        ownerId: p.owner_id,
      }))
    } catch (error) {
      console.error('Failed to load public playlists:', error)
    } finally {
      isLoadingPublic.value = false
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.value.trim()) {
      await fetchPublicPlaylists()
      return
    }

    isLoadingPublic.value = true
    try {
      const res = await playlistApi.searchPlaylists(searchQuery.value, 10)
      publicPlaylists.value = res.playlists.map((p) => ({
        id: p.id,
        title: p.title,
        isPublic: p.is_public,
        role: 'viewer',
        ownerId: p.owner_id,
      }))
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      isLoadingPublic.value = false
    }
  }

  return {
    ownedPlaylists,
    sharedPlaylists,
    publicPlaylists,
    discoverPlaylists,
    isLoadingPersonal,
    isLoadingPublic,
    searchQuery,
    fetchPersonalPlaylists,
    fetchPublicPlaylists,
    handleSearch,
  }
}
