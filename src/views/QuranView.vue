<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAudioPlayer } from '@/composables/useAudioPlayer'
import { useQuranData } from '@/composables/useQuranData'

import QuranSidebar from '@/components/quran/QuranSidebar.vue'
import QuranSurahGrid from '@/components/quran/QuranSurahGrid.vue'

const router = useRouter()

const {
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
} = useQuranData()

const { activeSurahId, isPlaying, playToggle, trackTitle } = useAudioPlayer()

const navigateToSurah = (surahId: number) => {
  router.push({
    path: `/quran/${surahId}`,
    query: {
      riwayah: selectedRiwayah.value?.id,
      lang: selectedLanguage.value?.id,
      tafsir: selectedTafsir.value?.id,
      transcription: getTranscriptionLang(),
      reciter: selectedReciter.value?.id,
    },
  })
}

const handlePlayToggle = (surahId: number, title: string) => {
  playToggle(surahId, selectedRiwayah.value?.id as string, selectedReciter.value?.id as string, {
    title,
    reciter: selectedReciter.value?.label as string,
  })
}

onMounted(async () => {
  await initData()
})

watch(selectedReciter, (newReciter, oldReciter) => {
  if (newReciter?.id !== oldReciter?.id && activeSurahId.value !== null) {
    playToggle(activeSurahId.value, selectedRiwayah.value?.id as string, newReciter?.id as string, {
      title: trackTitle.value,
      reciter: newReciter?.label as string,
    })
  }
})
</script>

<template>
  <main class="max-w-350 mx-auto px-8 mt-6 pb-6">
    <div class="flex justify-end items-center mb-6">
      <button
        @click="router.push('/playlists/create')"
        class="px-6 py-2.5 text-primary font-bold text-sm rounded-xl hover:bg-primary hover:text-bg-base transition-all cursor-pointer"
      >
        {{ $t('quran.createPlaylist') }}
      </button>
    </div>

    <div class="flex flex-col-reverse lg:flex-row gap-10">
      <QuranSurahGrid
        :audio-cards="surahCards"
        :is-fetching-network="isFetchingNetwork"
        :active-surah-id="activeSurahId"
        :is-playing="isPlaying"
        @navigate="navigateToSurah"
        @play-toggle="handlePlayToggle"
      />

      <QuranSidebar
        :is-loading-metadata="isLoadingMetadata"
        :dropdown-options="dropdownOptions"
        v-model:selected-reciter="selectedReciter"
        v-model:selected-language="selectedLanguage"
        v-model:selected-tafsir="selectedTafsir"
        v-model:selected-riwayah="selectedRiwayah"
      />
    </div>
  </main>
</template>
