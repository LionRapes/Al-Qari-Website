<script setup lang="ts">
import type { PlaylistSummary } from '@/composables/usePlaylistsLibrary'
import PlaylistSection from '@/components/playlist/PlaylistSection.vue'

const query = defineModel<string>('searchQuery', { required: true })

defineProps<{
  playlists: PlaylistSummary[]
  isLoading: boolean
}>()

const emit = defineEmits<{
  (e: 'search'): void
}>()

let searchTimeout: ReturnType<typeof setTimeout>
const onSearchInput = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    emit('search')
  }, 300)
}
</script>

<template>
  <aside class="sticky top-32 flex flex-col gap-6">
    <div class="bg-bg-surface border border-border-theme rounded-2xl p-6">
      <h2 class="text-lg font-bold text-text-base mb-4">{{ $t('playlist.discover.title') }}</h2>
      <div class="relative">
        <input
          v-model="query"
          @input="onSearchInput"
          type="text"
          :placeholder="$t('playlist.discover.placeholder')"
          class="w-full bg-bg-surface-hover border border-border-theme text-text-base text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
        />
      </div>
    </div>

    <PlaylistSection
      :playlists="playlists"
      :is-loading="isLoading"
      :empty-message="$t('playlist.discover.empty')"
      :skeleton-count="3"
      grid-cols="flex flex-col gap-4"
    />
  </aside>
</template>
