import type { UnifiedAyah, UnifiedSurah } from '@/types/ui.types'
import { ref, watch, nextTick, onBeforeUnmount } from 'vue'
import type { Ref } from 'vue'
import type { LocationQuery } from 'vue-router'
import type { LastReadData } from './useLastRead'

export function useLastReadTracker(
  currentSurah: Ref<UnifiedSurah | null>,
  displayAyahs: Ref<UnifiedAyah[]>,
  getLastRead: () => LastReadData | null,
  saveLastRead: (data: LastReadData) => void,
  queryParams: Ref<LocationQuery>,
) {
  const ayahElements = ref<HTMLElement[]>([])
  let observer: IntersectionObserver | null = null

  const updateLastReadProgress = (ayahNum: number) => {
    if (!currentSurah.value) return

    const currentSaved = getLastRead()
    if (currentSaved && currentSaved.surahId === currentSurah.value.id) {
      if (ayahNum <= currentSaved.verseNumber) return
    }

    const total = currentSurah.value.versesCount
    saveLastRead({
      surahId: currentSurah.value.id,
      surahName: currentSurah.value.name,
      verseNumber: ayahNum,
      progress: Math.round((ayahNum / total) * 100),
      query: queryParams.value,
    })
  }

  const setupScrollObserver = () => {
    if (observer) observer.disconnect()
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const ayahNum = Number((entry.target as HTMLElement).dataset.verse)
            if (ayahNum) updateLastReadProgress(ayahNum)
          }
        })
      },
      { rootMargin: '-20% 0px -70% 0px' },
    )

    ayahElements.value.forEach((el) => {
      if (el) observer?.observe(el)
    })
  }

  watch(displayAyahs, async () => {
    await nextTick()
    setupScrollObserver()
  })

  onBeforeUnmount(() => {
    if (observer) observer.disconnect()
  })

  return { ayahElements }
}
