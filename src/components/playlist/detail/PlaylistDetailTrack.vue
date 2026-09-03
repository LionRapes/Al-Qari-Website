<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useSurahDetails } from '@/composables/useSurahDetails'
import { useAyahPlayback } from '@/composables/useAyahPlayback'
import AyahCard from '@/components/quran/AyahCard.vue'
import PlaylistDetailTrackHeader from '@/components/playlist/detail/PlaylistDetailTrackHeader.vue'
import type { PlaylistItem } from '@/types/playlist.types'

const props = defineProps<{
  track: PlaylistItem
}>()

const { currentSurah, isLoading, fetchSurah } = useSurahDetails()

onMounted(() => {
  fetchSurah(
    props.track.surahNumber,
    props.track.riwayahId,
    props.track.translationId,
    props.track.tafsirId,
    props.track.translationId,
    props.track.reciterId,
  )
})

const displayAyahs = computed(() => {
  if (!currentSurah.value) return []
  const requestedAyahs = props.track.ayahs
  if (!requestedAyahs || requestedAyahs.length === 0) return currentSurah.value.ayahs
  return currentSurah.value.ayahs.filter((a) => requestedAyahs.includes(a.number))
})

const { activeAyahNumber, isPlaying, handlePlayAyah, handleCopyVerse } = useAyahPlayback(
  currentSurah,
  displayAyahs,
)

const onPlayClicked = (ayahNumber: number) => {
  if (!currentSurah.value) return
  handlePlayAyah(ayahNumber, {
    surahId: props.track.surahNumber,
    riwayahId: props.track.riwayahId,
    reciterId: props.track.reciterId,
    surahName: currentSurah.value.name,
    reciterName: props.track.reciterId.replace(/_/g, ' '),
  })
}
</script>

<template>
  <div class="bg-bg-surface border border-border-theme rounded-3xl overflow-hidden mb-8">
    <div v-if="isLoading" class="flex items-center justify-center p-12">
      <div
        class="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"
      ></div>
    </div>

    <div v-else-if="currentSurah" class="flex flex-col">
      <PlaylistDetailTrackHeader
        :surah-name="currentSurah.name"
        :surah-name-arabic="currentSurah.nameArabic"
        :reciter-id="track.reciterId"
        :tafsir-id="track.tafsirId"
      />

      <div class="flex flex-col p-4 gap-4">
        <AyahCard
          v-for="ayah in displayAyahs"
          :key="ayah.number"
          :ayahNumber="ayah.number"
          :arabicText="ayah.arabic"
          :translationText="ayah.translation"
          :transcriptionText="ayah.transcription"
          :tafsirText="ayah.tafsir"
          :isPlaying="activeAyahNumber === ayah.number && isPlaying"
          @play="onPlayClicked"
          @copy="handleCopyVerse"
        />
      </div>
    </div>
  </div>
</template>
