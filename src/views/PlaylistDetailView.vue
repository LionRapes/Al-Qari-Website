<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePlaylistDetail } from '@/composables/usePlaylistDetail'

import PlaylistDetailSkeleton from '@/components/playlist/detail/PlaylistDetailSkeleton.vue'
import PlaylistDetailError from '@/components/playlist/detail/PlaylistDetailError.vue'
import PlaylistDetailHeader from '@/components/playlist/detail/PlaylistDetailHeader.vue'
import PlaylistDetailTrack from '@/components/playlist/detail/PlaylistDetailTrack.vue'
import IconBack from '@/components/icons/IconBack.vue'

const route = useRoute()
const router = useRouter()

const playlistId = route.params.id as string

const { playlist, tracks, isLoading, error, fetchPlaylist } = usePlaylistDetail()

const handleBack = () => {
  const previousPath = window.history.state?.back

  if (typeof previousPath === 'string' && previousPath.endsWith('/edit')) {
    router.push('/playlists')
  } else {
    router.back()
  }
}

onMounted(() => {
  if (playlistId) {
    fetchPlaylist(playlistId)
  }
})
</script>

<template>
  <main class="max-w-3xl mx-auto px-6 mt-8 pb-12">
    <button
      @click="handleBack"
      class="mb-6 flex items-center gap-2 text-sm font-medium text-text-muted hover:text-primary transition-colors cursor-pointer"
    >
      <IconBack />
      {{ $t('common.back') }}
    </button>

    <PlaylistDetailSkeleton v-if="isLoading" />

    <PlaylistDetailError v-else-if="error" :error="error" @retry="fetchPlaylist(playlistId)" />

    <div v-else-if="playlist">
      <PlaylistDetailHeader :playlist="playlist" />

      <section class="flex flex-col gap-6">
        <div
          v-if="tracks.length === 0"
          class="p-8 text-center border border-dashed border-border-theme rounded-2xl text-text-muted"
        >
          {{ $t('playlist.detail.emptyData') }}
        </div>

        <PlaylistDetailTrack
          v-for="(track, index) in tracks"
          :key="`${track.surahNumber}-${index}`"
          :track="track"
        />
      </section>
    </div>
  </main>
</template>
