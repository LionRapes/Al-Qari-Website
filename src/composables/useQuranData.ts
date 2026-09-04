import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import type { ApiMetadata, RiwayahMetadata } from '@/types/quran.types'
import quranApi from '@/services/quranApi'
import type { SurahCardData, DropdownOption } from '@/types/ui.types'

const metadata = ref<ApiMetadata | null>(null)
const isLoadingMetadata = ref(true)
const isFetchingNetwork = ref(false)

const selectedReciter = ref<DropdownOption | null>(null)
const selectedLanguage = ref<DropdownOption | null>(null)
const selectedTafsir = ref<DropdownOption | null>(null)
const selectedRiwayah = ref<DropdownOption | null>(null)

const dropdownOptions = ref({ reciters: [], languages: [], tafsirs: [], riwayahs: [] } as Record<
  string,
  DropdownOption[]
>)
const surahCards = ref<SurahCardData[]>([])

const lastMappedKey = ref<string>('')

export function useQuranData() {
  const { locale } = useI18n()

  const initData = async () => {
    if (metadata.value) {
      isLoadingMetadata.value = false
      return
    }

    isLoadingMetadata.value = true
    try {
      const data = await quranApi.getMetadata()
      metadata.value = data

      dropdownOptions.value.languages = (data.translations || []).map((t) => ({
        id: t,
        label: t.toUpperCase(),
      }))
      dropdownOptions.value.tafsirs = (data.tafsirs || []).map((t) => ({
        id: t,
        label: t.replace(/-/g, ' '),
      }))

      const riwayahKeys = Object.keys(data).filter((k) => k !== 'translations' && k !== 'tafsirs')
      dropdownOptions.value.riwayahs = riwayahKeys.map((k) => ({
        id: k,
        label: k.charAt(0).toUpperCase() + k.slice(1),
      }))

      if (dropdownOptions.value.riwayahs.length > 0)
        selectedRiwayah.value = dropdownOptions.value.riwayahs[0]!

      if (dropdownOptions.value.tafsirs.length > 0)
        selectedTafsir.value = dropdownOptions.value.tafsirs[0]!

      if (dropdownOptions.value.languages.length > 0) {
        const userLang = locale.value.split('-')[0]?.toLowerCase()
        const matchedLang = dropdownOptions.value.languages.find((l) => l.id === userLang)

        selectedLanguage.value =
          matchedLang ||
          dropdownOptions.value.languages.find((l) => l.id === 'en') ||
          dropdownOptions.value.languages[0]!
      }
    } catch (error) {
      console.error('Failed to initialize Quran data:', error)
    } finally {
      isLoadingMetadata.value = false
    }
  }

  const prefetchFullData = () => {
    if (!selectedRiwayah.value || !selectedLanguage.value) return

    const riwayahId = selectedRiwayah.value.id as string
    const langId = selectedLanguage.value.id as string

    Promise.all([
      quranApi.getRiwayah(riwayahId),
      quranApi.getTranslation(langId),
      quranApi.getTranscription(riwayahId, langId),
    ]).catch((error) => console.warn('Background prefetch failed:', error))
  }

  const loadSurahs = async () => {
    if (!selectedRiwayah.value || !selectedLanguage.value) return

    const currentKey = `${selectedRiwayah.value.id}-${selectedLanguage.value.id}`

    if (lastMappedKey.value === currentKey && surahCards.value.length > 0) {
      return
    }

    const riwayahId = selectedRiwayah.value.id as string
    const langId = selectedLanguage.value.id as string
    isFetchingNetwork.value = true
    try {
      const [riwayahData, transData] = await Promise.all([
        quranApi.getRiwayah(`${riwayahId}_title`),
        quranApi.getTranslation(`${langId}_title`),
      ])

      surahCards.value = riwayahData.map((rSurah) => {
        const tSurah = transData.find((t) => t.id === rSurah.id)
        return {
          id: rSurah.id,
          title: tSurah ? tSurah.name : rSurah.name,
          subtitle: rSurah.name,
          desc: `${rSurah.type.charAt(0).toUpperCase() + rSurah.type.slice(1)} • ${rSurah.total_verses} Verses`,
          time: '',
          isPlaying: false,
        }
      })

      lastMappedKey.value = currentKey
      prefetchFullData()
    } catch (error) {
      console.error('Failed to load Surahs in background:', error)
    } finally {
      isFetchingNetwork.value = false
    }
  }

  const getTranscriptionLang = (): string => {
    const langKey = selectedLanguage.value?.id as string
    let transcriptionLang = langKey

    if (metadata.value && selectedRiwayah.value?.id) {
      const rNode = metadata.value[selectedRiwayah.value.id as string] as RiwayahMetadata
      if (rNode?.transcriptions && !rNode.transcriptions.includes(langKey)) {
        transcriptionLang = rNode.transcriptions[0] || 'en'
      }
    }
    return transcriptionLang
  }

  watch(selectedRiwayah, (newRiw) => {
    if (!metadata.value || !newRiw) return

    const rNode = metadata.value[newRiw.id as string] as RiwayahMetadata
    if (rNode?.reciters) {
      dropdownOptions.value.reciters = rNode.reciters.map((r) => ({
        id: `${r.name}_${r.bitrate}`,
        label: r.name.replace(/_/g, ' '),
      }))

      const isValidCurrent = dropdownOptions.value.reciters.find(
        (r) => r.id === selectedReciter.value?.id,
      )
      selectedReciter.value = isValidCurrent || dropdownOptions.value.reciters[0]!
    }
  })

  watch(
    () => [selectedRiwayah.value, selectedLanguage.value],
    ([nRiw, nLang]) => {
      if (nRiw && nLang) {
        loadSurahs()
      }
    },
  )

  return {
    isLoadingMetadata,
    isFetchingNetwork,
    selectedReciter,
    selectedLanguage,
    selectedTafsir,
    selectedRiwayah,
    dropdownOptions,
    surahCards,
    initData,
    getTranscriptionLang,
  }
}
