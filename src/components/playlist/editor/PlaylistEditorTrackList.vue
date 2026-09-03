<script setup lang="ts">
import IconClose from '@/components/icons/IconClose.vue'
import type { EditorTrack } from '@/composables/usePlaylistEditor'

defineProps<{ tracks: EditorTrack[] }>()
defineEmits<{ (e: 'remove', index: number): void }>()
</script>

<template>
  <div class="bg-bg-surface border border-border-theme p-6 rounded-3xl">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-sm font-bold text-text-base uppercase tracking-wider">
        {{ $t('playlist.editor.trackList.title') }}
      </h3>
      <span
        class="px-3 py-1 bg-bg-surface-hover border border-border-theme text-text-muted text-xs font-bold rounded-full"
      >
        {{ tracks.length }}
      </span>
    </div>
    <div
      v-if="tracks.length === 0"
      class="text-center text-text-muted text-sm py-6 border border-dashed border-border-theme rounded-2xl"
    >
      {{ $t('playlist.editor.trackList.emptyState') }}
    </div>
    <div v-else class="flex flex-col gap-3">
      <div
        v-for="(track, index) in tracks"
        :key="index"
        class="flex items-center justify-between p-3 bg-bg-surface-hover rounded-xl border border-border-theme"
      >
        <div class="flex items-center gap-3 overflow-hidden">
          <div
            class="w-6 h-6 rounded-md bg-primary/10 text-primary font-bold text-[10px] flex items-center justify-center shrink-0"
          >
            {{ index + 1 }}
          </div>
          <div class="truncate">
            <h4 class="font-bold text-text-heading text-xs truncate">
              {{ $t('playlist.editor.trackList.surah') }} {{ track.surahNumber }}
            </h4>
            <p class="text-[10px] text-text-muted truncate">
              {{ $t('playlist.editor.trackList.ayahs') }}:
              {{ track.rawAyahsInput || $t('playlist.editor.trackList.full') }}
            </p>
          </div>
        </div>
        <button
          @click="$emit('remove', index)"
          class="text-text-muted hover:bg-text-base/10 rounded-md hover:text-text-red hover:border hover:border-text-red/10 p-1"
        >
          <IconClose class="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
</template>
