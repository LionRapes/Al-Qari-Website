import { cacheService } from './cacheService'
import type {
  ApiMetadata,
  ApiQuote,
  ApiRiwayahSurah,
  ApiTafsirSurah,
  ApiTimestamp,
  ApiTranslationSurah,
  IQuranApi,
} from '@/types/index'

const API_BASE = import.meta.env.VITE_BACKEND_URL

const quranApi: IQuranApi = {
  async getMetadata(): Promise<ApiMetadata> {
    const res = await fetch(`${API_BASE}/metadata/`)
    if (!res.ok) throw new Error('Failed to fetch metadata')
    return res.json()
  },

  async getQuotes(lang: string): Promise<ApiQuote[]> {
    const res = await fetch(`${API_BASE}/quran/quote/${lang}`)
    if (!res.ok) throw new Error('Failed to fetch metadata')
    return res.json()
  },

  getRiwayah(riwayahId: string): Promise<ApiRiwayahSurah[]> {
    return cacheService.fetchCached(`${API_BASE}/quran/riwayah/${riwayahId}`)
  },

  async getSurah(riwayahId: string, surahId: number): Promise<ApiRiwayahSurah> {
    const fullCacheKey = `${API_BASE}/quran/riwayah/${riwayahId}`
    const cachedFull = await cacheService.peekCached<ApiRiwayahSurah[]>(fullCacheKey)

    if (cachedFull) {
      const surah = cachedFull.find((item) => String(item.id) === String(surahId))
      if (surah) return surah
    }

    const res = await fetch(`${API_BASE}/quran/riwayah/${riwayahId}/${surahId}`)
    if (!res.ok) throw new Error('Failed to fetch surah')
    return res.json()
  },

  getTranslation(langId: string): Promise<ApiTranslationSurah[]> {
    return cacheService.fetchCached(`${API_BASE}/quran/translation/${langId}`)
  },

  async getTranslatedSurah(langId: string, surahId: number): Promise<ApiTranslationSurah> {
    const fullCacheKey = `${API_BASE}/quran/translation/${langId}`
    const cachedFull = await cacheService.peekCached<ApiTranslationSurah[]>(fullCacheKey)

    if (cachedFull) {
      const surah = cachedFull.find((item) => String(item.id) === String(surahId))
      if (surah) return surah
    }

    const res = await fetch(`${API_BASE}/quran/translation/${langId}/${surahId}`)
    if (!res.ok) throw new Error('Failed to fetch translated surah')
    return res.json()
  },

  async getTafsirSurah(tafsirId: string, surahId: number): Promise<ApiTafsirSurah> {
    return cacheService.fetchCached(`${API_BASE}/quran/tafsir/${tafsirId}/${surahId}`)
  },

  async getTranscriptionSurah(
    riwayahId: string,
    langId: string,
    surahId: number,
  ): Promise<ApiTranslationSurah> {
    const res = await fetch(`${API_BASE}/quran/transcription/${riwayahId}/${langId}/${surahId}`)
    if (!res.ok) throw new Error('Failed to fetch transcription')
    return res.json()
  },

  async getTimestamps(riwayahId: string, reciterId: string): Promise<ApiTimestamp[]> {
    const res = await fetch(`${API_BASE}/quran/audio/${riwayahId}/${reciterId}/timestamps`)
    if (!res.ok) throw new Error('Failed to fetch timestamps')
    return res.json()
  },

  async getAudioUrl(riwayahId: string, reciterId: string, surahId: number): Promise<string> {
    const res = await fetch(`${API_BASE}/quran/audio/${riwayahId}/${reciterId}/${surahId}`)
    if (!res.ok) throw new Error('Failed to fetch audio url')
    const data = await res.json()
    return data.url
  },
}

export default quranApi
