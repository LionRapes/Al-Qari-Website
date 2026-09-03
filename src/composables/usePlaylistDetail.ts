import { ref, computed } from 'vue'
import playlistApi from '@/services/playlistApi'
import userApi from '@/services/userApi'
import type { ApiPlaylist } from '@/types/playlist.types'
import type { ApiUserProfile } from '@/types/user.types'
import { parsePlaylistString } from '@/utils/playlistUtils'

export function usePlaylistDetail() {
  const playlist = ref<ApiPlaylist | null>(null)
  const owner = ref<ApiUserProfile | null>(null)
  const isLoading = ref(true)
  const error = ref('')

  const tracks = computed(() => {
    if (!playlist.value?.data) return []
    return parsePlaylistString(playlist.value.data)
  })

  const fetchPlaylist = async (id: string) => {
    isLoading.value = true
    error.value = ''
    try {
      const data = await playlistApi.getPlaylist(id)
      const ownerData = await userApi.getUserProfile(data.owner_id)
      playlist.value = data
      owner.value = ownerData
    } catch {
      console.error('Failed to load playlist:')
      error.value = 'Failed to load playlist'
    } finally {
      isLoading.value = false
    }
  }

  return {
    playlist,
    owner,
    tracks,
    isLoading,
    error,
    fetchPlaylist,
  }
}
