import { ref } from 'vue'
import { useRouter } from 'vue-router'
import playlistApi from '@/services/playlistApi'
import { encodePlaylistString, encodeAyahArray } from '@/utils/playlistUtils'
import { parsePlaylistString } from '@/utils/playlistUtils'
import type { PlaylistItem } from '@/types/playlist.types'

export interface EditorTrack extends Omit<PlaylistItem, 'ayahs'> {
  rawAyahsInput: string
}

export function usePlaylistEditor(existingId?: string) {
  const router = useRouter()
  const title = ref('')
  const isPublic = ref(false)
  const tracks = ref<EditorTrack[]>([])

  const isLoading = ref(false)
  const isSaving = ref(false)
  const error = ref('')

  const loadExistingPlaylist = async () => {
    if (!existingId) return
    isLoading.value = true
    try {
      const playlist = await playlistApi.getPlaylist(existingId)
      title.value = playlist.title
      isPublic.value = playlist.is_public

      const decodedItems = parsePlaylistString(playlist.data)
      tracks.value = decodedItems.map((item) => ({
        surahNumber: item.surahNumber,
        riwayahId: item.riwayahId,
        reciterId: item.reciterId,
        translationId: item.translationId,
        tafsirId: item.tafsirId,
        rawAyahsInput: encodeAyahArray(item.ayahs),
      }))
    } catch {
      error.value = 'Failed to load existing playlist.'
    } finally {
      isLoading.value = false
    }
  }

  const parseRawAyahs = (input: string): number[] => {
    if (!input.trim()) return []
    const ayahs = new Set<number>()
    for (const segment of input.split(',')) {
      const trimmed = segment.trim()
      if (trimmed.includes('-')) {
        const [start, end] = trimmed.split('-').map(Number)
        if (start && end && start <= end) {
          for (let i = start; i <= end; i++) ayahs.add(i)
        }
      } else {
        const num = Number(trimmed)
        if (!isNaN(num)) ayahs.add(num)
      }
    }
    return Array.from(ayahs).sort((a, b) => a - b)
  }

  const addTrack = (track: EditorTrack) => tracks.value.push(track)
  const removeTrack = (index: number) => tracks.value.splice(index, 1)

  const savePlaylist = async () => {
    if (!title.value.trim() || tracks.value.length === 0) {
      error.value = 'Title and at least one track are required.'
      return
    }

    isSaving.value = true
    error.value = ''

    try {
      const playlistItems: PlaylistItem[] = tracks.value.map((t) => ({
        surahNumber: t.surahNumber,
        riwayahId: t.riwayahId,
        reciterId: t.reciterId,
        translationId: t.translationId,
        tafsirId: t.tafsirId,
        ayahs: parseRawAyahs(t.rawAyahsInput),
      }))

      const dataString = encodePlaylistString(playlistItems)
      const payload = { title: title.value, data: dataString, is_public: isPublic.value }

      if (existingId) {
        await playlistApi.updatePlaylist(existingId, payload)
        router.push(`/playlists/${existingId}`)
      } else {
        const response = await playlistApi.createPlaylist(payload)
        router.push(`/playlists/${response.playlist_id}`)
      }
    } catch {
      error.value = 'Failed to save playlist'
    } finally {
      isSaving.value = false
    }
  }

  if (existingId) loadExistingPlaylist()

  return {
    title,
    isPublic,
    tracks,
    isLoading,
    isSaving,
    error,
    addTrack,
    removeTrack,
    savePlaylist,
  }
}
