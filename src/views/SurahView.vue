<script setup lang="ts">
import { onMounted, watch, computed, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

import { useSurahDetails } from '@/composables/useSurahDetails'
import { useAyahPlayback } from '@/composables/useAyahPlayback'
import { useLastRead } from '@/composables/useLastRead'
import { useAyahSelection } from '@/composables/useAyahSelection'
import { usePlaylistEditor } from '@/composables/usePlaylistEditor'
import { useLazyScroll } from '@/composables/useLazyScroll'

import { useSurahPagination } from '@/composables/useSurahPagination'
import { useLastReadTracker } from '@/composables/useLastReadTracker'
import { useQuickPlaylist } from '@/composables/useQuickPlaylist'

import SurahHeader from '@/components/quran/SurahHeader.vue'
import AyahCard from '@/components/quran/AyahCard.vue'
import IconCheck from '@/components/icons/IconCheck.vue'
import QuickSaveWidget from '@/components/quran/QuickSaveWidget.vue'

const route = useRoute()
const queryParams = computed(() => route.query)

const { currentSurah, isLoading, initSurah } = useSurahDetails()
const versesCount = computed(() => currentSurah.value?.versesCount)

const { displayAyahs, loadNextChunk, resetPagination } = useSurahPagination(currentSurah)

const { activeAyahNumber, isPlaying, handlePlayAyah, clear } = useAyahPlayback(
  currentSurah,
  displayAyahs,
)
const { selectedAyahs, toggleAyah, clearSelection, formattedAyahRange } =
  useAyahSelection(versesCount)

const { title, isPublic, tracks, isSaving, savePlaylist } = usePlaylistEditor()
const { handleQuickSave } = useQuickPlaylist(
  currentSurah,
  selectedAyahs,
  formattedAyahRange,
  tracks,
  isPublic,
  savePlaylist,
  clearSelection,
  queryParams,
)

watch(selectedAyahs, (newVal) => {
  if (newVal.length > 0 && !title.value.trim()) {
    title.value = `${currentSurah.value?.name} Playlist`
  }
})

const { saveLastRead, getLastRead } = useLastRead()
const { ayahElements } = useLastReadTracker(
  currentSurah,
  displayAyahs,
  getLastRead,
  saveLastRead,
  queryParams,
)

const { triggerRef } = useLazyScroll(
  () => {
    if (currentSurah.value) loadNextChunk()
  },
  { rootMargin: '300px' },
)

const onPlayClicked = (ayahNumber: number) => {
  if (!currentSurah.value) return
  handlePlayAyah(ayahNumber, {
    surahId: Number(route.params.id),
    riwayahId: (route.query.riwayah as string) || 'hafs',
    reciterId: (route.query.reciter as string) || 'abdur_rashid_sufi_qdc_64k',
    surahName: currentSurah.value.name,
    reciterName: ((route.query.reciter as string) || '').replace(/_/g, ' '),
  })
}

const loadSurahData = async () => {
  const surahId = Number(route.params.id)
  if (!surahId) return

  resetPagination()
  await initSurah(
    surahId,
    (route.query.lang as string) || 'en',
    (route.query.riwayah as string) || 'hafs',
    (route.query.tafsir as string) || 'ru-tafseer-al-saddi',
    (route.query.transcription as string) || 'en',
    (route.query.reciter as string) || 'abdur_rashid_sufi_qdc_64k',
  )

  if (currentSurah.value) loadNextChunk()
}

onMounted(loadSurahData)
onUnmounted(() => {
  clear()
})
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
            <div
              v-for="ayah in displayAyahs"
              :key="ayah.number"
              ref="ayahElements"
              :data-verse="ayah.number"
              class="relative group transition-colors duration-300 border-l-4"
              :class="[
                selectedAyahs.includes(ayah.number) || activeAyahNumber === ayah.number
                  ? 'bg-primary/5 border-primary'
                  : 'border-transparent hover:bg-bg-surface-hover',
              ]"
            >
              <AyahCard
                :ayahNumber="ayah.number"
                :arabicText="ayah.arabic"
                :translationText="ayah.translation"
                :transcriptionText="ayah.transcription"
                :tafsirText="ayah.tafsir"
                :isPlaying="activeAyahNumber === ayah.number && isPlaying"
                @play="onPlayClicked"
              >
                <button
                  @click="toggleAyah(ayah.number)"
                  class="w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all cursor-pointer shadow-sm"
                  :class="
                    selectedAyahs.includes(ayah.number)
                      ? 'bg-primary border-primary text-bg-base opacity-100'
                      : 'border-border-theme bg-bg-surface text-transparent lg:opacity-0 group-hover:opacity-100'
                  "
                >
                  <IconCheck class="w-3 h-3" />
                </button>
              </AyahCard>
            </div>
          </div>
        </template>

        <!-- Invisible Lazy Scroll Trigger -->
        <div ref="triggerRef" class="h-10 w-full py-8"></div>
      </div>
    </div>

    <QuickSaveWidget
      v-model:title="title"
      :selected-count="selectedAyahs.length"
      :is-saving="isSaving"
      @save="handleQuickSave"
      @clear="clearSelection"
    />
  </main>
</template>
