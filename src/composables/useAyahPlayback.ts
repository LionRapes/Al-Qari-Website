import { ref, watch, type Ref } from 'vue'
import { useAudioPlayer } from '@/composables/useAudioPlayer'
import type { UnifiedAyah, UnifiedSurah } from '@/types/ui.types'

interface PlaybackConfig {
  surahId: number
  riwayahId: string
  reciterId: string
  surahName: string
  reciterName: string
}

export function useAyahPlayback(
  currentSurah: Ref<UnifiedSurah | null>,
  displayAyahs: Ref<UnifiedAyah[]>,
) {
  const { activeSurahId, activeReciterId, isPlaying, playToggle, exactSeek, currentTime } =
    useAudioPlayer()
  const activeAyahNumber = ref<number | null>(null)

  watch(currentTime, (newTime) => {
    if (!currentSurah.value || activeSurahId.value !== currentSurah.value.id) return

    const currentIndex = displayAyahs.value.findIndex(
      (a) => a.timestamp && newTime >= a.timestamp.start && newTime <= a.timestamp.end,
    )

    if (currentIndex !== -1) {
      const activeAyah = displayAyahs.value[currentIndex]!
      if (activeAyahNumber.value !== activeAyah.number) {
        activeAyahNumber.value = activeAyah.number
      }
    } else {
      const currentActiveAyah = displayAyahs.value.find((a) => a.number === activeAyahNumber.value)

      if (currentActiveAyah?.timestamp && newTime > currentActiveAyah.timestamp.end) {
        const currentIndexInDisplay = displayAyahs.value.findIndex(
          (a) => a.number === activeAyahNumber.value,
        )

        const nextAyah = displayAyahs.value[currentIndexInDisplay + 1]

        if (nextAyah?.timestamp) {
          exactSeek(nextAyah.timestamp.start)
          activeAyahNumber.value = nextAyah.number
        } else {
          if (isPlaying.value) {
            playToggle(currentSurah.value.id, '', '')
          }
          activeAyahNumber.value = null
        }
      }
    }
  })

  const handlePlayAyah = async (ayahNumber: number, config: PlaybackConfig) => {
    if (!currentSurah.value) return

    const ayah = displayAyahs.value.find((a) => a.number === ayahNumber)
    if (!ayah || !ayah.timestamp) return

    const isActiveAyah = activeAyahNumber.value === ayahNumber

    if (activeSurahId.value !== config.surahId) {
      await playToggle(config.surahId, config.riwayahId, config.reciterId, {
        title: config.surahName,
        reciter: config.reciterName,
      })
    } else if (isActiveAyah || !isPlaying.value) {
      await playToggle(config.surahId, config.riwayahId, config.reciterId)
    }

    if (!isActiveAyah) exactSeek(ayah.timestamp.start)
    activeAyahNumber.value = ayahNumber
  }

  const clear = () => {
    playToggle(-1)
    activeReciterId.value = null
    activeSurahId.value = null
  }
  return {
    activeAyahNumber,
    isPlaying,
    handlePlayAyah,
    clear,
  }
}
