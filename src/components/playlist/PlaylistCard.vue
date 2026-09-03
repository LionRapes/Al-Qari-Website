<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { PlaylistSummary } from '@/composables/usePlaylistsLibrary'

const props = defineProps<{
  playlist: PlaylistSummary
}>()

const router = useRouter()

const navigateToPlaylist = () => {
  router.push(`/playlists/${props.playlist.id}`)
}
</script>

<template>
  <div
    @click="navigateToPlaylist"
    class="p-5 bg-bg-surface border border-border-theme rounded-2xl cursor-pointer hover:border-primary hover:-translate-y-1 transition-all flex flex-col gap-3 group"
  >
    <div class="flex items-start justify-between gap-4">
      <h3
        class="font-bold text-lg text-text-base group-hover:text-primary transition-colors line-clamp-1"
      >
        {{ playlist.title }}
      </h3>
      <span
        class="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded border whitespace-nowrap"
        :class="{
          'bg-primary/10 text-primary border-primary/20': playlist.role === 'owner',
          'bg-blue-500/10 text-blue-500 border-blue-500/20': playlist.role === 'editor',
          'bg-zinc-500/10 text-zinc-500 border-zinc-500/20':
            playlist.role === 'viewer' && !playlist.ownerId,
          'bg-green-500/10 text-green-500 border-green-500/20': playlist.ownerId,
        }"
      >
        {{
          playlist.ownerId ? $t('playlist.card.public') : $t(`playlist.card.role.${playlist.role}`)
        }}
      </span>
    </div>

    <div v-if="playlist.ownerId" class="text-xs text-text-muted">
      {{ $t('playlist.card.by', { owner: playlist.ownerId }) }}
    </div>
  </div>
</template>
