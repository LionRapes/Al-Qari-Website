<script setup lang="ts">
import { ref } from 'vue'
import playlistApi from '@/services/playlistApi'
import type { PlaylistSummary } from '@/types/ui.types'
import { useRouter } from 'vue-router'
import IconShare from '@/components/icons/IconShare.vue'
import CopyWidget from '@/components/CopyWidget.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import IconEdit from '../icons/IconEdit.vue'

const props = defineProps<{
  playlist: PlaylistSummary
}>()

const emit = defineEmits<{
  (e: 'deleted', id: string): void
}>()

const router = useRouter()
const showDeleteModal = ref(false)
const isDeleting = ref(false)

const navigateToPlaylist = () => {
  router.push({ path: `/playlists/${props.playlist.id}` })
}

const navigateToEdit = () => {
  router.push({ path: `/playlists/${props.playlist.id}/edit` })
}

const executeDelete = async () => {
  isDeleting.value = true
  try {
    await playlistApi.deletePlaylist(props.playlist.id)
    showDeleteModal.value = false
    emit('deleted', props.playlist.id)
  } catch (error) {
    console.error('Failed to delete playlist:', error)
  } finally {
    isDeleting.value = false
  }
}
</script>

<template>
  <!-- Card Container -->
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
        <!-- Edit Button -->
        <button
          v-if="playlist.role === 'owner' || playlist.role === 'editor'"
          @click.stop="navigateToEdit"
          class="p-1.5 rounded-lg bg-bg-surface-hover text-text-muted hover:text-text-blue transition-colors"
        >
          <IconEdit />
        </button>

        <!-- Share Button -->
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
              @click.stop="copy"
              class="p-1.5 rounded-lg bg-bg-surface-hover text-text-muted hover:text-primary transition-colors"
            >
              <IconShare class="w-3.5 h-3.5" />
            </button>
          </template>
        </CopyWidget>

        <!-- Delete Trigger -->
        <button
          v-if="playlist.role === 'owner'"
          @click.stop="showDeleteModal = true"
          class="p-1.5 rounded-lg bg-bg-surface-hover text-text-muted hover:text-text-red transition-colors"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>

        <!-- Role Badge -->
        <span
          class="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded border whitespace-nowrap"
          :class="{
            'bg-primary/10 text-primary border-primary/20': playlist.role === 'owner',
            'bg-text-muted/10 text-text-blue border-text-blue/20': playlist.role === 'editor',
            'bg-text-muted/10 text-text-muted/60 border-text-muted/20':
              playlist.role === 'viewer' && !playlist.owner,
            'bg-text-muted/10 text-text-green border-text-green/20': playlist.owner,
          }"
        >
          {{
            playlist.isPublic
              ? $t('playlist.card.public')
              : $t(`playlist.card.role.${playlist.role}`)
          }}
        </span>
      </div>
    </div>

    <div v-if="playlist.owner" class="text-xs text-text-muted">
      {{ $t('playlist.card.by', { owner: playlist.owner?.username }) }}
    </div>
  </div>

  <!-- Teleported Modal -->
  <ConfirmDialog
    :is-open="showDeleteModal"
    :is-loading="isDeleting"
    :title="$t('playlist.card.delete.title')"
    :message="$t('playlist.card.delete.message')"
    :cancel-text="$t('common.cancel')"
    :confirm-text="$t('common.delete')"
    @cancel="showDeleteModal = false"
    @confirm="executeDelete"
  />
</template>
