<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAudioPlayer } from '@/composables/useAudioPlayer'
import { useLazyScroll } from '@/composables/useLazyScroll'
import { useQuranData } from '@/composables/useQuranData'

import SidebarDropdown from '../components/quran/SidebarDropdown.vue'
import IconBook from '@/components/icons/IconBook.vue'
import IconTranslation from '@/components/icons/IconTranslation.vue'
import IconAudio from '@/components/icons/IconAudio.vue'
import IconRiwayah from '@/components/icons/IconRiwayah.vue'
import SurahCard from '@/components/quran/SurahCard.vue'

const router = useRouter()

const {
  isLoadingMetadata,
  isFetchingNetwork,
  selectedReciter,
  selectedLanguage,
  selectedTafsir,
  selectedRiwayah,
  dropdownOptions,
  audioCards,
  initData,
  getTranscriptionLang,
} = useQuranData()

const { activeSurahId, isPlaying, playToggle, trackTitle } = useAudioPlayer()

const BATCH_SIZE = 12
const visibleCount = ref(0)
const visibleAudioCards = computed(() => audioCards.value.slice(0, visibleCount.value))

const { containerRef, triggerRef } = useLazyScroll(() => {
  if (visibleCount.value < audioCards.value.length) {
    visibleCount.value += BATCH_SIZE
  }
})

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

onMounted(async () => {
  await initData()
  visibleCount.value = BATCH_SIZE
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
    <div class="flex flex-col-reverse lg:flex-row gap-10">
      <!-- LEFT AREA -->
      <div
        ref="containerRef"
        class="flex-1 h-[75vh] lg:h-[calc(100vh-8rem)] max-h-142 overflow-y-auto custom-scrollbar bg-bg-surface border border-border-theme rounded-3xl p-8"
      >
        <div v-if="isFetchingNetwork" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            v-for="i in BATCH_SIZE"
            :key="i"
            class="h-32 bg-bg-surface-hover rounded-2xl border border-border-theme animate-pulse"
          ></div>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SurahCard
            v-for="card in visibleAudioCards"
            :key="card.id"
            :id="card.id"
            :title="card.title"
            :subtitle="card.subtitle"
            :desc="card.desc"
            :is-playing="activeSurahId === card.id && isPlaying"
            @click="navigateToSurah(card.id)"
            @play-toggle="
              (id) =>
                playToggle(id, selectedRiwayah?.id as string, selectedReciter?.id as string, {
                  title: card.title,
                  reciter: selectedReciter?.label as string,
                })
            "
          />
        </div>

        <div ref="triggerRef" class="h-10 w-full mt-4"></div>
      </div>

      <!-- RIGHT AREA -->
      <aside class="w-full lg:w-80 shrink-0 flex flex-col">
        <div v-if="isLoadingMetadata" class="animate-pulse flex flex-col gap-4">
          <div
            v-for="i in 4"
            :key="i"
            class="h-18 bg-bg-surface-hover rounded-2xl w-full border border-border-theme"
          ></div>
        </div>

        <template v-else>
          <SidebarDropdown
            :title="$t('quran.reciter')"
            :options="dropdownOptions.reciters!"
            v-model="selectedReciter"
          >
            <template #icon><IconAudio /></template>
          </SidebarDropdown>
          <SidebarDropdown
            :title="$t('quran.translation')"
            :options="dropdownOptions.languages!"
            v-model="selectedLanguage"
          >
            <template #icon><IconTranslation /></template>
          </SidebarDropdown>
          <SidebarDropdown
            :title="$t('quran.tafsir')"
            :options="dropdownOptions.tafsirs!"
            v-model="selectedTafsir"
          >
            <template #icon><IconBook class="w-6 h-6" /></template>
          </SidebarDropdown>
          <SidebarDropdown
            :title="$t('quran.riwayah')"
            :options="dropdownOptions.riwayahs!"
            v-model="selectedRiwayah"
          >
            <template #icon><IconRiwayah /></template>
          </SidebarDropdown>
        </template>
      </aside>
    </div>
  </main>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
  margin-block: 1rem;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: var(--color-border-theme, #1f3024);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: var(--color-primary, #d4af60);
}
</style>
