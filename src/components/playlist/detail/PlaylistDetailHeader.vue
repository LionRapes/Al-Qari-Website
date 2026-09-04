<script setup lang="ts">
import type { PlaylistSummary } from '@/types/ui.types'

defineProps<{
  playlist: PlaylistSummary
}>()
</script>

<template>
  <header class="mb-8">
    <div class="flex items-start justify-between gap-4 mb-3">
      <h1 class="text-2xl lg:text-3xl font-bold text-text-base wrap-break-word">
        {{ playlist.title }}
      </h1>
      <span
        class="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-lg border whitespace-nowrap shrink-0"
        :class="
          playlist.isPublic
            ? 'bg-text-green/10 text-text-green border-text-green/20'
            : 'bg-text-muted/10 text-text-mborder-text-muted border-text-muted/20'
        "
      >
        {{ playlist.isPublic ? $t('playlist.detail.public') : $t('playlist.detail.private') }}
      </span>
    </div>

    <div v-if="playlist.owner" class="flex items-center gap-3">
      <div
        class="w-8 h-8 rounded-full overflow-hidden bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0"
      >
        <img
          v-if="playlist.owner.avatar_url"
          :src="playlist.owner.avatar_url"
          alt="playlist.Owner Avatar"
          class="w-full h-full object-cover"
        />
        <span v-else class="text-primary text-xs font-bold uppercase">
          {{ (playlist.owner.username || playlist.owner.id || 'U').charAt(0) }}
        </span>
      </div>
      <p class="text-sm text-text-muted flex items-center gap-1">
        {{ $t('playlist.detail.createdBy') }}
        <span class="font-medium text-text-base">
          {{ playlist.owner.username || playlist.owner.id }}
        </span>
      </p>
    </div>
  </header>
</template>
