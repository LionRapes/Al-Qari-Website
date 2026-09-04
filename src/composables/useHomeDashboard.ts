import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLastRead, type LastReadData } from '@/composables/useLastRead'
import quranApi from '@/services/quranApi'
import type { SurahOfDay } from '@/types/ui.types'
import type { ApiQuote } from '@/types/quran.types'
import { cacheService } from '@/services/cacheService'

export function useHomeDashboard() {
  const { locale } = useI18n()
  const { getLastRead } = useLastRead()

  const lastRead = ref<LastReadData>({
    surahId: 1,
    surahName: 'Al-Fatihah',
    verseNumber: 1,
    progress: 0,
    query: {},
  })

  const surahOfTheDay = ref<SurahOfDay>({
    title: '',
    englishText: '',
    arabicText: '',
  })

  const quotes = ref<ApiQuote[]>([])

  const loadSurahOfTheDayData = async () => {
    try {
      const cached = await cacheService.getOrSet(
        'surahOfTheDay',
        async () => {
          const randomSurahId = Math.floor(Math.random() * 114) + 1
          const data = await quranApi.getSurah('hafs', randomSurahId)
          const dataTranslated = await quranApi.getTranslatedSurah(locale.value, randomSurahId)
          return {
            data,
            dataTranslated,
            randomSurahId,
          }
        },
        24 * 60 * 60 * 1000,
      )

      surahOfTheDay.value = {
        title: `${cached.dataTranslated.name || cached.data.name} (${cached.randomSurahId})`,
        englishText: cached.dataTranslated.verses[0]?.text || '',
        arabicText: cached.data.name,
      }
    } catch (error) {
      console.error('Failed to load Surah of the Day:', error)
    }
  }

  const loadQuotesData = async () => {
    try {
      const data = await quranApi.getQuotes(locale.value)
      const shuffled = [...data].sort(() => 0.5 - Math.random())
      quotes.value = shuffled.slice(0, 2)
    } catch (error) {
      console.error('Failed to load quotes:', error)
    }
  }

  const initDashboardData = async () => {
    const savedRead = getLastRead()
    if (savedRead) lastRead.value = savedRead

    await Promise.all([loadSurahOfTheDayData(), loadQuotesData()])
  }

  return {
    lastRead,
    surahOfTheDay,
    quotes,
    initDashboardData,
  }
}
