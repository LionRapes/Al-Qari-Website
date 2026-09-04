import { ref, computed } from 'vue'
import playlistApi from '@/services/playlistApi'
import { parsePlaylistString } from '@/utils/playlistUtils'
import type { PlaylistSummary } from '@/types/ui.types'

export function usePlaylistDetail() {
  const playlist = ref<PlaylistSummary | null>(null)
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
      playlist.value = {
        id: data.id,
        title: data.title,
        isPublic: data.is_public,
        data: data.data,
        owner: data.owner,
      }
    } catch {
      console.error('Failed to load playlist:')
      error.value = 'Failed to load playlist'
    } finally {
      isLoading.value = false
    }
  }

  return {
    playlist,
    tracks,
    isLoading,
    error,
    fetchPlaylist,
  }
}
