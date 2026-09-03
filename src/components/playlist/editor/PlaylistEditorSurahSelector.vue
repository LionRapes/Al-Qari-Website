<script setup lang="ts">
import type { SurahCardData } from '@/types/ui.types'

defineProps<{
  surahCards: SurahCardData[]
  selectedId: number | null
}>()

defineEmits<{
  (e: 'select', id: number): void
}>()
</script>

<template>
  <div
    class="h-[35%] min-h-62.5 flex flex-col bg-bg-surface border border-border-theme rounded-3xl overflow-hidden"
  >
    <div
      class="p-4 border-b border-border-theme bg-bg-surface-hover/50 flex justify-between items-center shrink-0"
    >
      <h2 class="font-bold text-text-base text-sm uppercase tracking-wider">
        {{ $t('playlist.editor.surahSelector.title') }}
      </h2>
    </div>
    <div
      class="overflow-y-auto custom-scrollbar p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3"
    >
      <button
        v-for="surah in surahCards"
        :key="surah.id"
        @click="$emit('select', surah.id)"
        class="flex flex-col items-start p-4 rounded-2xl border transition-all cursor-pointer text-left"
        :class="
          selectedId === surah.id
            ? 'border-primary bg-primary/10'
            : 'border-border-theme bg-bg-surface-hover hover:border-primary/50'
        "
      >
        <div class="flex justify-between items-center w-full mb-1">
          <span
            class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
            :class="
              selectedId === surah.id ? 'bg-primary text-bg-base' : 'bg-primary/10 text-primary'
            "
          >
            {{ surah.id }}
          </span>
          <span class="text-xs font-semibold text-text-muted">{{ surah.subtitle }}</span>
        </div>
        <h3 class="font-bold text-text-heading text-sm mt-1">{{ surah.title }}</h3>
      </button>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
  margin-block: 0.5rem;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: var(--color-border-theme);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: var(--color-primary);
}

.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: var(--color-border-theme) transparent;
}
</style>
