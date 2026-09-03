import type { LocationQuery } from 'vue-router'

const STORAGE_KEY = 'alqari_last_read'

export interface LastReadData {
  surahId: number
  surahName: string
  verseNumber: number
  progress: number
  query: LocationQuery
}

export const useLastRead = () => {
  const saveLastRead = (data: LastReadData) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }

  const getLastRead = (): LastReadData | null => {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : null
  }

  return { saveLastRead, getLastRead }
}
