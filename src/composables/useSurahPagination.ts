import type { UnifiedSurah } from '@/types/ui.types'
import { ref, computed } from 'vue'
import type { Ref } from 'vue'

export function useSurahPagination(currentSurah: Ref<UnifiedSurah | null>) {
  const currentAyahIndex = ref(0)
  const CHUNK_SIZE = 15

  const displayAyahs = computed(() => {
    if (!currentSurah.value) return []
    return currentSurah.value.ayahs.slice(0, currentAyahIndex.value)
  })

  const loadNextChunk = () => {
    if (!currentSurah.value) return

    const totalAyahs = currentSurah.value.ayahs.length
    if (currentAyahIndex.value >= totalAyahs) return

    currentAyahIndex.value = Math.min(currentAyahIndex.value + CHUNK_SIZE, totalAyahs)
  }

  const resetPagination = () => {
    currentAyahIndex.value = 0
  }

  return { displayAyahs, loadNextChunk, resetPagination }
}
