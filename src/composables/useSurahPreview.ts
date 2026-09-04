import type { DropdownOption } from '@/types/ui.types'
import { ref, watch, type Ref } from 'vue'

interface PreviewDependencies {
  selectedRiwayah: Ref<DropdownOption | null>
  selectedLanguage: Ref<DropdownOption | null>
  selectedTafsir: Ref<DropdownOption | null>
  selectedReciter: Ref<DropdownOption | null>
}

export function useSurahPreview(
  initSurah: (
    surahId: number,
    language: string,
    riwayah: string,
    tafsir: string,
    transcriptionLang: string,
    reciter: string,
  ) => Promise<void>,
  deps: PreviewDependencies,
  onSurahChange: () => void,
) {
  const selectedPreviewSurahId = ref<number | null>(null)

  const loadSurahPreview = () => {
    if (!selectedPreviewSurahId.value) return

    initSurah(
      selectedPreviewSurahId.value,
      deps.selectedLanguage.value?.id || 'en',
      deps.selectedRiwayah.value?.id || 'hafs',
      deps.selectedTafsir.value?.id || '',
      deps.selectedLanguage.value?.id || 'en',
      deps.selectedReciter.value?.id || '',
    )
  }

  watch(selectedPreviewSurahId, (newId) => {
    onSurahChange()
    if (newId) loadSurahPreview()
  })

  watch([deps.selectedLanguage, deps.selectedTafsir, deps.selectedRiwayah], () => {
    if (selectedPreviewSurahId.value) loadSurahPreview()
  })

  const clearPreview = () => {
    selectedPreviewSurahId.value = null
  }

  return { selectedPreviewSurahId, clearPreview }
}
