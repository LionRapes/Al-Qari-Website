<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useSurahDetails } from '@/composables/useSurahDetails'
import { useAudioPlayer } from '@/composables/useAudioPlayer'
import SurahHeader from '@/components/quran/SurahHeader.vue'
import AyahCard from '@/components/quran/AyahCard.vue'

const route = useRoute()
const activeAyahNumber = ref<number | null>(null)

const { currentSurah, isLoading, fetchSurah } = useSurahDetails()
const { activeSurahId, isPlaying, playToggle, exactSeek, currentTime } = useAudioPlayer()

const formattedReciterName = computed(() => {
  const rec = (route.query.reciter as string) || ''
  return rec.replace(/_/g, ' ').replace(' 32k', '')
})

const handlePlayAyah = async (ayahNumber: number) => {
  if (!currentSurah.value) return

  const ayah = currentSurah.value.ayahs.find((a) => a.number === ayahNumber)
  if (!ayah || !ayah.timestamp) return

  const isActiveAyah = activeAyahNumber.value === ayahNumber
  const surahId = Number(route.params.id)
  const riwayahId = route.query.riwayah as string
  const reciterId = route.query.reciter as string

  if (activeSurahId.value !== surahId) {
    await playToggle(surahId, riwayahId, reciterId, {
      title: currentSurah.value.name,
      reciter: formattedReciterName.value,
    })
  } else if (isActiveAyah || !isPlaying.value) {
    await playToggle(surahId, riwayahId, reciterId)
  }
  if (!isActiveAyah) exactSeek(ayah.timestamp.start)
  activeAyahNumber.value = ayahNumber
}

watch(currentTime, (newTime) => {
  if (!currentSurah.value || activeSurahId.value !== currentSurah.value.id) return

  const activeAyah = currentSurah.value.ayahs.find(
    (a) => a.timestamp && newTime >= a.timestamp.start && newTime <= a.timestamp.end,
  )

  if (activeAyah && activeAyahNumber.value !== activeAyah.number) {
    activeAyahNumber.value = activeAyah.number
  }
})

const loadSurahData = () => {
  const surahId = Number(route.params.id)
  if (surahId) {
    fetchSurah(
      surahId,
      (route.query.riwayah as string) || 'hafs',
      (route.query.lang as string) || 'en',
      (route.query.tafsir as string) || 'ru-tafseer-al-saddi',
      (route.query.transcription as string) || (route.query.lang as string) || 'en',
      (route.query.reciter as string) || 'Abdul-bary_Mohammad_32k',
    )
  }
}

const handleCopyVerse = (text: string) => navigator.clipboard.writeText(text)

onMounted(loadSurahData)
watch(() => route.query, loadSurahData, { deep: true })
</script>

<template>
  <main class="max-w-350 mx-auto px-8 mt-6 pb-32">
    <div class="flex flex-col-reverse lg:flex-row gap-10">
      <div
        class="flex-1 bg-bg-surface border border-border-theme rounded-3xl overflow-hidden min-h-125"
      >
        <div v-if="isLoading" class="flex items-center justify-center h-full p-20">
          <div
            class="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"
          ></div>
        </div>

        <template v-else-if="currentSurah">
          <SurahHeader
            :surahName="currentSurah.name"
            :surahNameArabic="currentSurah.nameArabic"
            :type="currentSurah.revelationType"
            :versesCount="currentSurah.versesCount"
            :showBismillah="currentSurah.showBismillah"
            :showAudhubillah="currentSurah.showAudhubillah"
          />

          <div class="flex flex-col">
            <AyahCard
              v-for="ayah in currentSurah.ayahs"
              :key="ayah.number"
              :ayahNumber="ayah.number"
              :arabicText="ayah.arabic"
              :translationText="ayah.translation"
              :transcriptionText="ayah.transcription"
              :tafsirText="ayah.tafsir"
              :isPlaying="activeAyahNumber === ayah.number && isPlaying"
              @play="handlePlayAyah"
              @copy="handleCopyVerse"
            />
          </div>
        </template>
      </div>
    </div>
  </main>
</template>
