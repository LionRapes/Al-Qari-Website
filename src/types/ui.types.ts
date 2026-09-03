// Consolidated internal state objects for Frontend UI rendering
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

export interface PlaylistSummary {
  id: string
  title: string
  isPublic: boolean
  role: string
  ownerId?: string
}

// Generic UI element types
export interface DropdownOption {
  id: string
  label: string
}

export interface SurahCardData {
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
