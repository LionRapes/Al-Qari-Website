// Base structural unit for all Quran text content
export interface ApiVerse {
  id: number
  text: string
}

// Full Surah representation including specific reading styles
export interface ApiRiwayahSurah {
  id: number
  name: string
  type: 'meccan' | 'medinan'
  total_verses: number
  verses: ApiVerse[]
}

// Translated or localized Surah content
export interface ApiTranslationSurah {
  id: number
  name: string
  verses: ApiVerse[]
}

// Exegesis/Tafsir mapped to verses
export interface ApiTafsirSurah {
  id: number
  verses: ApiVerse[]
}

// Word/Verse level audio synchronization metadata
export interface ApiTimestamp {
  id: number
  verses: {
    id: number
    start: number
    end: number
  }[]
}

// Standalone inspirational or reference texts
export interface ApiQuote {
  id: number
  title: string
  body: string
  source: string
}

// Available Quran editions and reciter configurations
export interface ApiMetadata {
  tafsirs: string[]
  translations: string[]
  [key: string]: RiwayahMetadata | string[] | undefined
}

export interface RiwayahMetadata {
  reciters: ApiReciter[]
  transcriptions: string[]
}

export interface ApiReciter {
  name: string
  bitrate: string
}

// Contract for Quran data retrieval requests
export interface IQuranApi {
  getMetadata(): Promise<ApiMetadata>
  getQuotes(lang: string): Promise<ApiQuote[]>
  getRiwayah(riwayahId: string): Promise<ApiRiwayahSurah[]>
  getSurah(riwayahId: string, surahId: number): Promise<ApiRiwayahSurah>
  getTranslation(langId: string): Promise<ApiTranslationSurah[]>
  getTranslatedSurah(langId: string, surahId: number): Promise<ApiTranslationSurah>
  getTafsirSurah(tafsirId: string, surahId: number): Promise<ApiTafsirSurah>
  getTranscriptionSurah(
    riwayahId: string,
    langId: string,
    surahId: number,
  ): Promise<ApiTranslationSurah>
  getTimestamps(riwayahId: string, reciterId: string): Promise<ApiTimestamp[]>
  getAudioUrl(riwayahId: string, reciterId: string, surahId: number): Promise<string>
}
