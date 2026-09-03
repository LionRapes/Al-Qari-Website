<script setup lang="ts">
import PlaylistCard from '@/components/playlist/PlaylistCard.vue'
import type { PlaylistSummary } from '@/types/ui.types'

defineProps<{
  title?: string
  playlists: PlaylistSummary[]
  isLoading: boolean
  emptyMessage: string
  skeletonCount?: number
  gridCols?: string
}>()
</script>

<template>
  <section>
    <h2 v-if="title" class="text-xl font-bold text-text-base mb-6">{{ title }}</h2>

    <div v-if="isLoading" :class="gridCols || 'grid grid-cols-1 md:grid-cols-2 gap-4'">
      <div
        v-for="i in skeletonCount || 4"
        :key="i"
        class="h-24 bg-bg-surface-hover border border-border-theme rounded-2xl animate-pulse"
      ></div>
    </div>

    <div
      v-else-if="playlists.length === 0"
      class="text-text-muted py-8 text-center border border-dashed border-border-theme rounded-2xl text-sm"
    >
      {{ emptyMessage }}
    </div>

    <div v-else :class="gridCols || 'grid grid-cols-1 md:grid-cols-2 gap-4'">
      <PlaylistCard v-for="playlist in playlists" :key="playlist.id" :playlist="playlist" />
    </div>
  </section>
</template>
