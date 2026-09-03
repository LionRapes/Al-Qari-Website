<script setup lang="ts">
import playlistApi from '@/services/playlistApi'
import type { PlaylistSummary } from '@/types/ui.types'
import { useRouter } from 'vue-router'
import IconShare from '../icons/IconShare.vue'
import CopyWidget from '../CopyWidget.vue'
import { onMounted, ref } from 'vue'
import userApi from '@/services/userApi.ts'
import type { ApiUserProfile } from '@/types/user.types.ts'

const props = defineProps<{
  playlist: PlaylistSummary
}>()

const router = useRouter()
const user = ref<ApiUserProfile | null>(null)
onMounted(async () => {
  if (props.playlist.ownerId) user.value = await userApi.getUserProfile(props.playlist.ownerId)
})
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

      <div class="flex items-center gap-2 shrink-0">
        <CopyWidget
          :get-text="
            async () => {
              if (playlist.isPublic || playlist.role !== 'owner') return playlist.title
              try {
                const res = await playlistApi.generateShareLink(playlist.id, {
                  role: 'viewer',
                  expires_in_hours: 24,
                })
                return res.share_token
              } catch (error) {
                console.error('Failed to prepare share link:', error)
              }
              return ''
            }
          "
        >
          <template #default="{ copy }">
            <button
              type="button"
              @click="copy"
              class="p-1.5 rounded-lg bg-bg-surface-hover text-text-muted hover:text-primary transition-colors"
            >
              <IconShare class="w-3.5 h-3.5" />
            </button>
          </template>
        </CopyWidget>

        <span
          class="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded border whitespace-nowrap"
          :class="{
            'bg-primary/10 text-primary border-primary/20': playlist.role === 'owner',
            'bg-text-muted/10 text-text-blue border-text-blue/20': playlist.role === 'editor',
            'bg-text-muted/10 text-text-muted/60 border-text-muted/20':
              playlist.role === 'viewer' && !playlist.ownerId,
            'bg-text-muted/10 text-text-green border-text-green/20': playlist.ownerId,
          }"
        >
          {{
            playlist.ownerId
              ? $t('playlist.card.public')
              : $t(`playlist.card.role.${playlist.role}`)
          }}
        </span>
      </div>
    </div>

    <div v-if="playlist.ownerId" class="text-xs text-text-muted">
      {{ $t('playlist.card.by', { owner: user?.username }) }}
    </div>
  </div>
</template>
