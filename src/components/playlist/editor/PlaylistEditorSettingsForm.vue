<script setup lang="ts">
import IconCheck from '@/components/icons/IconCheck.vue'

defineProps<{
  title: string
  isPublic: boolean
}>()

defineEmits<{
  (e: 'update:title', value: string): void
  (e: 'update:isPublic', value: boolean): void
}>()
</script>

<template>
  <div class="bg-bg-surface border border-border-theme p-6 rounded-3xl flex flex-col gap-5">
    <div>
      <label class="block text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
        {{ $t('playlist.editor.settings.playlistTitle') }}
      </label>
      <input
        :value="title"
        @input="$emit('update:title', ($event.target as HTMLInputElement).value)"
        type="text"
        :placeholder="$t('playlist.editor.settings.namePlaceholder')"
        class="w-full bg-bg-surface-hover border border-border-theme rounded-xl px-4 py-3 text-text-base focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-colors"
      />
    </div>
    <label class="flex items-start gap-3 cursor-pointer select-none group mt-1">
      <div class="relative w-5 h-5">
        <input
          type="checkbox"
          :checked="isPublic"
          @change="$emit('update:isPublic', ($event.target as HTMLInputElement).checked)"
          class="peer appearance-none w-full h-full rounded border border-primary/30 bg-bg-surface cursor-pointer checked:bg-primary"
        />

        <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
          <IconCheck v-if="isPublic" class="w-3.5 h-3.5 text-bg-base" />
        </div>
      </div>

      <div class="flex flex-col">
        <span class="text-text-base font-medium text-sm group-hover:text-primary transition-colors">
          {{ $t('playlist.editor.settings.makePublic') }}
        </span>
        <span class="text-text-muted text-xs mt-0.5">
          {{ $t('playlist.editor.settings.publicDescription') }}
        </span>
      </div>
    </label>
  </div>
</template>
