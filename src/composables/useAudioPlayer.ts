import { ref } from 'vue'
import quranApi from '@/services/quranApi'

const audio = new Audio()
const activeSurahId = ref<number | null>(null)
const activeReciterId = ref<string | null>(null)
const isPlaying = ref(false)
const progress = ref(0)
const currentTime = ref(0)
const timeText = ref('0:00')

const trackTitle = ref('')
const trackReciter = ref('')

let isInitialized = false

export function useAudioPlayer() {
  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00'
    const m = Math.floor(seconds / 60)
    const s = Math.floor(seconds % 60)
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  if (!isInitialized) {
    audio.addEventListener('timeupdate', () => {
      if (audio.duration) {
        currentTime.value = audio.currentTime
        progress.value = (audio.currentTime / audio.duration) * 100
        timeText.value = formatTime(audio.currentTime)
      }
    })

    audio.addEventListener('ended', () => {
      isPlaying.value = false
      progress.value = 0
      activeSurahId.value = null
    })

    isInitialized = true
  }

  const playToggle = async (
    surahId: number,
    riwayahId?: string,
    reciterId?: string,
    meta?: { title: string; reciter: string },
  ) => {
    const isSurahChanged = activeSurahId.value !== surahId
    if (!isSurahChanged && activeReciterId.value === reciterId) {
      if (isPlaying.value) audio.pause()
      else audio.play()

      isPlaying.value = !isPlaying.value
      return
    }

    if (isSurahChanged) progress.value = 0

    activeSurahId.value = surahId
    if (reciterId) activeReciterId.value = reciterId
    isPlaying.value = true
    timeText.value = 'Loading...'

    if (meta) {
      trackTitle.value = meta.title
      trackReciter.value = meta.reciter
    }

    audio.pause()

    try {
      if (!riwayahId || !reciterId) throw new Error('Missing audio parameters')
      audio.src = await quranApi.getAudioUrl(riwayahId, reciterId, surahId)

      if (!isSurahChanged) {
        audio.onloadedmetadata = () => {
          audio.currentTime = (progress.value / 100) * audio.duration
          audio.onloadedmetadata = null
        }
      }

      audio.play()
    } catch (error) {
      console.error('Audio playback error:', error)
      isPlaying.value = false
      timeText.value = 'Error'
    }
  }

  const seek = (percentage: number) => {
    if (audio.duration) {
      audio.currentTime = (percentage / 100) * audio.duration
      progress.value = percentage
    }
  }

  const exactSeek = (seconds: number) => {
    audio.currentTime = seconds
  }

  return {
    activeSurahId,
    activeReciterId,
    isPlaying,
    progress,
    currentTime,
    timeText,
    trackTitle,
    trackReciter,
    playToggle,
    seek,
    exactSeek,
  }
}
