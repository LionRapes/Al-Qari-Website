<script setup lang="ts">
import { onMounted } from 'vue'
import { usePlaylistsLibrary } from '@/composables/usePlaylistsLibrary'
import PlaylistSection from '@/components/playlist/PlaylistSection.vue'
import PlaylistAuthBanner from '@/components/playlist/PlaylistAuthBanner.vue'
import PlaylistDiscoverSidebar from '@/components/playlist/PlaylistDiscoverSidebar.vue'

const currentUserId = localStorage.getItem('user_id') || ''

const {
  ownedPlaylists,
  sharedPlaylists,
  discoverPlaylists,
  isLoadingPersonal,
  isLoadingPublic,
  searchQuery,
  fetchPersonalPlaylists,
  fetchPublicPlaylists,
  handleSearch,
} = usePlaylistsLibrary()

onMounted(() => {
  if (currentUserId) fetchPersonalPlaylists(currentUserId)
  fetchPublicPlaylists()
})
</script>

<template>
  <main class="max-w-350 mx-auto px-8 mt-6">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-10">
      <!-- LEFT COLUMN: Personal Library or Auth Banner -->
      <section class="lg:col-span-8 flex flex-col gap-8">
        <PlaylistAuthBanner v-if="!currentUserId" />

        <template v-else>
          <PlaylistSection
            :title="$t('playlist.section.ownedTitle')"
            :playlists="ownedPlaylists"
            :is-loading="isLoadingPersonal"
            :empty-message="$t('playlist.section.ownedEmpty')"
            :skeleton-count="4"
          />

          <hr class="border-border-theme opacity-50" />

          <PlaylistSection
            :title="$t('playlist.section.sharedTitle')"
            :playlists="sharedPlaylists"
            :is-loading="isLoadingPersonal"
            :empty-message="$t('playlist.section.sharedEmpty')"
            :skeleton-count="2"
          />
        </template>
      </section>

      <!-- RIGHT COLUMN: Discover & Search -->
      <section class="lg:col-span-4 relative">
        <PlaylistDiscoverSidebar
          v-model:search-query="searchQuery"
          :playlists="discoverPlaylists"
          :is-loading="isLoadingPublic"
          @search="handleSearch"
        />
      </section>
    </div>
  </main>
</template>
