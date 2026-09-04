<script setup lang="ts">
import { computed, watch } from 'vue'
import IconCheck from '@/components/icons/IconCheck.vue'
import AyahCard from '@/components/quran/AyahCard.vue'
import { useAyahPlayback } from '@/composables/useAyahPlayback'
import type { DropdownOption, UnifiedSurah } from '@/types/ui.types'

const props = defineProps<{
  currentSurah: UnifiedSurah | null
  isLoading: boolean
  selectedPreviewSurahId: number | null
  selectedAyahs: number[]
  selectedRiwayah?: DropdownOption | null
  selectedReciter?: DropdownOption | null
}>()

defineEmits<{
  (e: 'toggle-ayah', number: number): void
  (e: 'toggle-all'): void
}>()

const surahRef = computed(() => props.currentSurah)
const ayahsRef = computed(() => props.currentSurah?.ayahs || [])

const { activeAyahNumber, isPlaying, handlePlayAyah, clear } = useAyahPlayback(surahRef, ayahsRef)

watch(
  () => props.currentSurah?.id,
  (newId, oldId) => {
    if (newId !== oldId && newId !== undefined) {
      clear()
    }
  },
)

const onPlayClicked = (ayahNumber: number) => {
  if (!props.currentSurah) return

  handlePlayAyah(ayahNumber, {
    surahId: props.currentSurah.id,
    surahName: props.currentSurah.name,
    riwayahId: props.selectedRiwayah?.id || 'hafs',
    reciterId: props.selectedReciter?.id || 'abdur_rashid_sufi_qdc_64k',
    reciterName: props.selectedReciter?.label || 'Abdur Rashid Sufi',
  })
}
</script>

<template>
  <div
    class="h-[65%] flex flex-col bg-bg-surface border border-border-theme rounded-3xl overflow-hidden"
  >
    <div
      class="p-4 border-b border-border-theme bg-bg-surface-hover/50 flex justify-between items-center shrink-0"
    >
      <h2 class="font-bold text-text-base text-sm uppercase tracking-wider">
        {{ $t('playlist.editor.ayahSelector.title') }}
        <span v-if="currentSurah" class="text-text-muted lowercase font-normal ml-2">
          {{ $t('playlist.editor.ayahSelector.selected', { count: selectedAyahs.length }) }}
        </span>
      </h2>
      <button
        v-if="currentSurah"
        @click="$emit('toggle-all')"
        class="text-xs font-bold text-primary hover:text-primary/80 transition-colors"
      >
        {{
          selectedAyahs.length === currentSurah.versesCount
            ? $t('playlist.editor.ayahSelector.deselectAll')
            : $t('playlist.editor.ayahSelector.selectAll')
        }}
      </button>
    </div>

    <div class="overflow-y-auto custom-scrollbar flex-1 relative">
      <div
        v-if="!selectedPreviewSurahId"
        class="absolute inset-0 flex items-center justify-center text-text-muted text-sm"
      >
        {{ $t('playlist.editor.ayahSelector.emptyState') }}
      </div>

      <div v-else-if="isLoading" class="absolute inset-0 flex items-center justify-center">
        <div
          class="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"
        ></div>
      </div>

      <div v-else-if="currentSurah" class="flex flex-col p-2">
        <div
          v-for="ayah in currentSurah.ayahs"
          :key="ayah.number"
          class="relative group rounded-2xl overflow-hidden transition-colors"
          :class="
            selectedAyahs.includes(ayah.number) || activeAyahNumber === ayah.number
              ? 'bg-primary/5 border border-primary/30'
              : 'hover:bg-bg-surface-hover'
          "
        >
          <button
            @click="$emit('toggle-ayah', ayah.number)"
            class="absolute top-6 left-4 z-10 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors cursor-pointer"
            :class="
              selectedAyahs.includes(ayah.number)
                ? 'bg-primary border-primary text-bg-base'
                : 'border-border-theme bg-bg-surface group-hover:border-primary/50 text-transparent'
            "
          >
            <IconCheck />
          </button>

          <div class="pl-12">
            <!-- 4. Bind playback state and events to AyahCard -->
            <AyahCard
              :ayahNumber="ayah.number"
              :arabicText="ayah.arabic"
              :translationText="ayah.translation"
              :transcriptionText="ayah.transcription"
              :tafsirText="ayah.tafsir"
              :isPlaying="activeAyahNumber === ayah.number && isPlaying"
              @play="onPlayClicked"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
  margin-block: 0.5rem;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: var(--color-border-theme);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: var(--color-primary);
}

.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: var(--color-border-theme) transparent;
}
</style>
