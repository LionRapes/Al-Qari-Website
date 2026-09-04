<script setup lang="ts">
import PlaylistSection from '@/components/playlist/PlaylistSection.vue'
import type { PlaylistSummary } from '@/types/ui.types'
import { isUUIDToken } from '@/utils/validators'
import { ref } from 'vue'

const query = defineModel<string>('searchQuery', { required: true })
const tokenError = ref('')

defineProps<{
  playlists: PlaylistSummary[]
  isLoading: boolean
}>()

const emit = defineEmits<{
  (e: 'search'): void
  (e: 'join-token', token: string): void
}>()

let searchTimeout: ReturnType<typeof setTimeout>
const onSearchInput = () => {
  clearTimeout(searchTimeout)
  tokenError.value = ''

  const words = query.value.trim().split(/\s+/)
  if (words.length > 10) query.value = words.slice(0, 10).join(' ')

  searchTimeout = setTimeout(() => {
    emit('search')
  }, 300)
}

const onSubmitSearch = () => {
  const trimmed = query.value.trim()
  if (isUUIDToken(trimmed)) {
    emit('join-token', trimmed)
  } else {
    emit('search')
  }
}
</script>

<template>
  <aside class="sticky top-32 flex flex-col gap-6">
    <div class="bg-bg-surface border border-border-theme rounded-2xl p-6">
      <h2 class="text-lg font-bold text-text-base mb-4">{{ $t('playlist.discover.title') }}</h2>
      <form @submit.prevent="onSubmitSearch" class="relative flex flex-col gap-2">
        <input
          v-model="query"
          @input="onSearchInput"
          type="text"
          :placeholder="$t('playlist.discover.placeholder')"
          class="w-full bg-bg-surface-hover border border-border-theme text-text-base text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
        />
        <span class="text-[11px] text-text-muted">
          {{ $t('playlist.discover.tip') }}
        </span>
      </form>
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
