<script setup lang="ts">
import { useAudioPlayer } from '@/composables/useAudioPlayer'
import IconClose from '@/components/icons/IconClose.vue'
import IconCheck from '../icons/IconCheck.vue'

defineProps<{
  selectedCount: number
  isSaving: boolean
}>()

const title = defineModel<string>('title', { required: true })

const emit = defineEmits<{
  (e: 'save'): void
  (e: 'clear'): void
}>()

const { activeSurahId } = useAudioPlayer()
</script>

<template>
  <Transition name="fade-up">
    <div
      v-if="selectedCount > 0"
      class="fixed left-1/2 -translate-x-1/2 bg-bg-surface border border-border-theme shadow-2xl shadow-primary/10 rounded-2xl px-4 py-3 flex items-center gap-3 z-50 w-[95%] max-w-xl transition-all duration-300"
      :class="activeSurahId ? 'bottom-28 md:bottom-24' : 'bottom-12'"
    >
      <span class="text-sm font-bold text-text-base shrink-0 ml-2">
        {{ $t('playlist.editor.quickCreate.selected', { count: selectedCount }) }}
      </span>

      <div class="w-px h-6 bg-border-theme shrink-0"></div>

      <input
        v-model="title"
        type="text"
        @input="title = title.slice(0, 32)"
        maxlength="32"
        :placeholder="$t('playlist.editor.quickCreate.namePlaceholder')"
        class="flex-1 bg-bg-surface-hover border border-border-theme rounded-lg px-3 py-2 text-sm text-text-base focus:border-primary focus:outline-none transition-colors min-w-25"
      />

      <button
        @click="emit('save')"
        :disabled="isSaving || !title.trim()"
        title="Save Playlist"
        class="flex items-center justify-center w-10 h-10 sm:w-auto sm:h-auto sm:px-5 sm:py-2 bg-primary text-bg-base rounded-xl font-bold text-sm hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shrink-0"
      >
        <IconCheck v-if="!isSaving" />

        <span class="hidden sm:inline">
          {{
            isSaving
              ? $t('playlist.editor.quickCreate.saving')
              : $t('playlist.editor.quickCreate.save')
          }}
        </span>
      </button>

      <button
        @click="emit('clear')"
        class="p-2 text-text-muted hover:text-text-red transition-colors rounded-lg hover:bg-text-red/10 shrink-0"
      >
        <IconClose class="w-5 h-5" />
      </button>
    </div>
  </Transition>
</template>

<style scoped>
.fade-up-enter-active,
.fade-up-leave-active {
  transition: all 0.3s ease;
}
.fade-up-enter-from,
.fade-up-leave-to {
  opacity: 0;
  transform: translate(-50%, 20px);
}
</style>
