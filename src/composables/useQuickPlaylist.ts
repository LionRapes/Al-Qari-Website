import type { UnifiedSurah } from '@/types/ui.types'
import type { Ref } from 'vue'
import type { LocationQuery } from 'vue-router'
import type { EditorTrack } from './usePlaylistEditor'

export function useQuickPlaylist(
  currentSurah: Ref<UnifiedSurah | null>,
  selectedAyahs: Ref<number[]>,
  formattedAyahRange: Ref<string>,
  tracks: Ref<EditorTrack[]>,
  isPublic: Ref<boolean>,
  savePlaylist: () => Promise<void>,
  clearSelection: () => void,
  queryParams: Ref<LocationQuery>,
) {
  const handleQuickSave = async () => {
    if (!currentSurah.value || selectedAyahs.value.length === 0) return

    tracks.value = [
      {
        surahNumber: currentSurah.value.id,
        riwayahId: String(queryParams.value.riwayah || 'hafs'),
        reciterId: String(queryParams.value.reciter || 'abdur_rashid_sufi_qdc_64k'),
        translationId: String(queryParams.value.lang || 'en'),
        tafsirId: String(queryParams.value.tafsir || 'ru-tafseer-al-saddi'),
        rawAyahsInput: formattedAyahRange.value,
      },
    ]
    isPublic.value = false

    await savePlaylist()
    clearSelection()
  }

  return { handleQuickSave }
}
