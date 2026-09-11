<script setup lang="ts">
import UserAvatar from '@/components/UserAvatar.vue'
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
      <div class="h-8 w-8 rounded-full bg-border-theme text-text-heading shrink-0">
        <UserAvatar :avatar-url="playlist.owner.avatar_url" :user-id="playlist.owner.id" />
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
