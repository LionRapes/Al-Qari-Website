import { ref } from 'vue'
import quranApi from '@/services/quranApi'
import type { UnifiedSurah, UnifiedAyah, ApiVerse, ApiTimestamp } from '@/types/index'

export function useSurahDetails() {
  const currentSurah = ref<UnifiedSurah | null>(null)
  const isLoading = ref(true)

  const fetchSurah = async (
    surahId: number,
    riwayah: string,
    language: string,
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
      const timestamp = timestampsData.find((s: ApiTimestamp) => s.id === surahId)

      if (!arabicData) throw new Error('Surah not found in Arabic data')

      currentSurah.value = {
        id: arabicData.id,
        name: translationData ? translationData.name : arabicData.name,
        nameArabic: arabicData.name,
        revelationType: arabicData.type as 'meccan' | 'medinan',
        versesCount: arabicData.total_verses ?? arabicData.verses.length,
        showAudhubillah: surahId === 1,
        showBismillah: surahId !== 9 && surahId !== 1,
        ayahs: arabicData.verses.map((v: ApiVerse): UnifiedAyah => {
          const tVerse = translationData?.verses.find((tv: ApiVerse) => tv.id === v.id)
          const tafVerse = tafsirData?.verses.find((tafv: ApiVerse) => tafv.id === v.id)
          const trVerse = transcrData?.verses.find((trv: ApiVerse) => trv.id === v.id)
          const tsVerse = timestamp?.verses.find((tsv: { id: number }) => tsv.id === v.id)

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
      console.error('Error fetching full materials:', error)
    } finally {
      isLoading.value = false
    }
  }

  return { currentSurah, isLoading, fetchSurah }
}
