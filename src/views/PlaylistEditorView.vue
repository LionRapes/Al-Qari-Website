<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useQuranData } from '@/composables/useQuranData'
import { useSurahDetails } from '@/composables/useSurahDetails'
import { usePlaylistEditor } from '@/composables/usePlaylistEditor'
import { useAyahSelection } from '@/composables/useAyahSelection'
import { useSurahPreview } from '@/composables/useSurahPreview'

import QuranSidebar from '@/components/quran/QuranSidebar.vue'
import PlaylistEditorHeader from '@/components/playlist/editor/PlaylistEditorHeader.vue'
import PlaylistEditorSurahSelector from '@/components/playlist/editor/PlaylistEditorSurahSelector.vue'
import PlaylistEditorAyahSelector from '@/components/playlist/editor/PlaylistEditorAyahSelector.vue'
import PlaylistEditorSettingsForm from '@/components/playlist/editor/PlaylistEditorSettingsForm.vue'
import PlaylistEditorTrackList from '@/components/playlist/editor/PlaylistEditorTrackList.vue'

const router = useRouter()
const route = useRoute()
const playlistId = route.params.id as string | undefined

const {
  isLoadingMetadata,
  selectedReciter,
  selectedLanguage,
  selectedTafsir,
  selectedRiwayah,
  dropdownOptions,
  surahCards,
  initData,
} = useQuranData()

const { title, isPublic, tracks, isSaving, addTrack, removeTrack, savePlaylist } =
  usePlaylistEditor(playlistId)
const { currentSurah, isLoading: isSurahLoading, fetchSurah } = useSurahDetails()

const versesCount = computed(() => currentSurah.value?.versesCount)
const { selectedAyahs, toggleAyah, toggleAllAyahs, clearSelection, formattedAyahRange } =
  useAyahSelection(versesCount)

const { selectedPreviewSurahId, clearPreview } = useSurahPreview(
  fetchSurah,
  { selectedRiwayah, selectedLanguage, selectedTafsir, selectedReciter },
  clearSelection,
)

onMounted(() => {
  initData()
})

const handleAddTrack = () => {
  if (!selectedPreviewSurahId.value) return

  addTrack({
    surahNumber: selectedPreviewSurahId.value,
    riwayahId: selectedRiwayah.value?.id || 'hafs',
    reciterId: selectedReciter.value?.id || '',
    translationId: selectedLanguage.value?.id || 'en',
    tafsirId: selectedTafsir.value?.id || '',
    rawAyahsInput: formattedAyahRange.value,
  })

  clearPreview()
  clearSelection()
}
</script>

<template>
  <main class="max-w-7xl mx-auto px-6 mt-6 pb-12">
    <PlaylistEditorHeader
      :playlist-id="playlistId"
      :is-saving="isSaving"
      :can-save="!isSaving && tracks.length > 0 && title.trim().length > 0"
      @back="router.back()"
      @save="savePlaylist"
    />

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full pb-10">
      <!-- LEFT COLUMN -->
      <section class="lg:col-span-8 flex flex-col gap-6 h-400">
        <PlaylistEditorSurahSelector
          :surah-cards="surahCards"
          :selected-id="selectedPreviewSurahId"
          @select="(id) => (selectedPreviewSurahId = id)"
        />

        <PlaylistEditorAyahSelector
          :current-surah="currentSurah"
          :is-loading="isSurahLoading"
          :selected-preview-surah-id="selectedPreviewSurahId"
          :selected-ayahs="selectedAyahs"
          @toggle-ayah="toggleAyah"
          @toggle-all="toggleAllAyahs"
        />
      </section>

      <!-- RIGHT COLUMN -->
      <aside class="lg:col-span-4 h-full overflow-y-auto custom-scrollbar pr-2">
        <div class="flex flex-col gap-6">
          <PlaylistEditorSettingsForm v-model:title="title" v-model:is-public="isPublic" />

          <div class="bg-bg-surface border border-border-theme p-6 rounded-3xl flex flex-col gap-5">
            <h3
              class="text-sm font-bold text-text-base uppercase tracking-wider border-b border-border-theme pb-3"
            >
              {{ $t('playlist.editor.trackSettings.title') }}
            </h3>
            <div class="flex justify-center w-full">
              <QuranSidebar
                :is-loading-metadata="isLoadingMetadata"
                :dropdown-options="dropdownOptions"
                v-model:selected-reciter="selectedReciter"
                v-model:selected-language="selectedLanguage"
                v-model:selected-tafsir="selectedTafsir"
                v-model:selected-riwayah="selectedRiwayah"
                class="w-full"
              />
            </div>
            <button
              @click="handleAddTrack"
              :disabled="!selectedPreviewSurahId"
              class="w-full mt-2 py-3.5 bg-primary/10 border border-primary/30 text-primary font-bold text-sm rounded-xl hover:bg-primary hover:text-bg-base disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-sm"
            >
              {{ $t('playlist.editor.trackSettings.addTrack') }}
            </button>
          </div>

          <PlaylistEditorTrackList :tracks="tracks" @remove="removeTrack" />
        </div>
      </aside>
    </div>
  </main>
</template>
