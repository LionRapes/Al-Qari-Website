// --- API Response Types ---

export interface ApiUserProfile {
  id: string
  email: string
  username: string
  created_at: string
  avatar_url: string
}

export interface ApiAuthResponse {
  access_token: string
  token_type: string
  user_id: string
  is_new?: boolean
}

export interface ApiMessageResponse {
  message: string
}

export interface ApiVerse {
  id: number
  text: string
}

export interface ApiRiwayahSurah {
  id: number
  name: string
  type: 'meccan' | 'medinan'
  total_verses: number
  verses: ApiVerse[]
}

export interface ApiTranslationSurah {
  id: number
  name: string
  verses: ApiVerse[]
}

export interface ApiTafsirSurah {
  id: number
  verses: ApiVerse[]
}

export interface ApiTimestamp {
  id: number
  verses: {
    id: number
    start: number
    end: number
  }[]
}

export interface ApiQuote {
  id: number
  title: string
  body: string
  source: string
}

// --- Metadata Types ---

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

// Internal

export interface UnifiedAyah {
  number: number
  arabic: string
  translation: string
  transcription: string
  tafsir: string
  timestamp: { start: number; end: number } | null
  isPlaying: boolean
}

export interface UnifiedSurah {
  id: number
  name: string
  nameArabic: string
  revelationType: 'meccan' | 'medinan'
  versesCount: number
  showAudhubillah: boolean
  showBismillah: boolean
  ayahs: UnifiedAyah[]
}

export interface DropdownOption {
  id: string | number
  label: string
}

export interface AudioCardData {
  id: number
  title: string
  subtitle: string
  desc: string
  time: string
  isPlaying: boolean
}

export interface SurahOfDay {
  title: string
  englishText: string
  arabicText: string
}

// API
export interface IUserApi {
  requestMagicLink(email: string): Promise<ApiMessageResponse>
  verifyMagicLink(token: string): Promise<ApiAuthResponse>
  getUserProfile(userId: string): Promise<ApiUserProfile>
  updateUserProfile(userId: string, username: string): Promise<ApiMessageResponse>
  uploadAvatar(userId: string, file: File): Promise<{ message: string; avatar_url: string }>
  deleteUser(userId: string): Promise<void>
}

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
