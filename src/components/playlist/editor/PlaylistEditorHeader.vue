<script setup lang="ts">
import IconBack from '@/components/icons/IconBack.vue'

defineProps<{
  playlistId?: string
  isSaving: boolean
  canSave: boolean
}>()

defineEmits<{
  (e: 'back'): void
  (e: 'save'): void
}>()
</script>

<template>
  <header class="flex items-center justify-between mb-6">
    <div class="flex items-center gap-4">
      <button
        @click="$emit('back')"
        class="text-text-muted hover:text-primary transition-colors cursor-pointer p-2 -ml-2"
      >
        <IconBack class="w-5 h-5" />
      </button>
      <h1 class="text-3xl font-bold text-text-base">
        {{
          playlistId
            ? $t('playlist.editor.header.editPlaylist')
            : $t('playlist.editor.header.createPlaylist')
        }}
      </h1>
    </div>
    <button
      @click="$emit('save')"
      :disabled="!canSave"
      class="px-6 py-2.5 bg-primary text-bg-base font-bold rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity cursor-pointer shadow-lg shadow-primary/10"
    >
      {{
        isSaving ? $t('playlist.editor.header.saving') : $t('playlist.editor.header.savePlaylist')
      }}
    </button>
  </header>
</template>
