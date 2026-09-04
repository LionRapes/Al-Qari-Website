import { ref } from 'vue'
import quranApi from '@/services/quranApi'
import type { ApiVerse, ApiTimestamp } from '@/types/quran.types'
import type { UnifiedSurah, UnifiedAyah } from '@/types/ui.types'

export function useSurahDetails() {
  const currentSurah = ref<UnifiedSurah | null>(null)
  const isLoading = ref(true)

  const initSurah = async (
    surahId: number,
    language: string,
    riwayah: string,
    tafsir: string,
    transcriptionLang: string,
    reciter: string,
  ) => {
    isLoading.value = true
    try {
      const [arabicData, translationData, tafsirData, transcrData, timestampsData] =
        await Promise.all([
          quranApi.getSurah(riwayah, surahId),
          quranApi.getTranslatedSurah(language, surahId),
          quranApi.getTafsirSurah(tafsir, surahId),
          quranApi.getTranscriptionSurah(riwayah, transcriptionLang, surahId),
          quranApi.getTimestamps(riwayah, reciter),
        ])

      if (!arabicData) throw new Error('Surah not found')

      const timestampSurah = timestampsData?.find((s: ApiTimestamp) => s.id === surahId)

      currentSurah.value = {
        id: arabicData.id,
        name: translationData?.name || arabicData.name,
        nameArabic: arabicData.name,
        revelationType: arabicData.type as 'meccan' | 'medinan',
        versesCount: arabicData.total_verses ?? arabicData.verses.length,
        showAudhubillah: surahId === 1,
        showBismillah: surahId !== 9 && surahId !== 1,
        ayahs: arabicData.verses.map((v: ApiVerse): UnifiedAyah => {
          const tVerse = translationData?.verses.find((tv: ApiVerse) => tv.id === v.id)
          const tafVerse = tafsirData?.verses.find((tafv: ApiVerse) => tafv.id === v.id)
          const trVerse = transcrData?.verses.find((trv: ApiVerse) => trv.id === v.id)
          const tsVerse = timestampSurah?.verses.find((tsv: { id: number }) => tsv.id === v.id)

          return {
            number: v.id,
            arabic: v.text,
            transcription: trVerse ? trVerse.text : '',
            translation: tVerse ? tVerse.text : 'Translation unavailable',
            tafsir: tafVerse ? tafVerse.text : 'Tafsir unavailable for this verse.',
            isPlaying: false,
            timestamp: tsVerse ? { start: tsVerse.start, end: tsVerse.end } : null,
          }
        }),
      }
    } catch (error) {
      console.error('Error initializing surah:', error)
    } finally {
      isLoading.value = false
    }
  }

  return { currentSurah, isLoading, initSurah }
}
