import type { DropdownOption } from '@/types/ui.types'
import { ref, watch, type Ref } from 'vue'

interface PreviewDependencies {
  selectedRiwayah: Ref<DropdownOption | null>
  selectedLanguage: Ref<DropdownOption | null>
  selectedTafsir: Ref<DropdownOption | null>
  selectedReciter: Ref<DropdownOption | null>
}

export function useSurahPreview(
  fetchSurah: (
    surahId: number,
    riwayahId: string,
    languageId: string,
    tafsirId: string,
    translationLanguageId: string,
    reciterId: string,
  ) => void,
  deps: PreviewDependencies,
  onSurahChange: () => void,
) {
  const selectedPreviewSurahId = ref<number | null>(null)

  const loadSurahPreview = () => {
    if (!selectedPreviewSurahId.value) return

    fetchSurah(
      selectedPreviewSurahId.value,
      deps.selectedRiwayah.value?.id || 'hafs',
      deps.selectedLanguage.value?.id || 'en',
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
