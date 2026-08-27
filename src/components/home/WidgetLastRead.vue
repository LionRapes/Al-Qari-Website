<script setup lang="ts">
import IconChevron from '../icons/IconChevron.vue'
import ProgressRing from './ProgressRing.vue'

defineProps<{
  surah: string
  verse: string
  progress: number
}>()

defineEmits<{
  (e: 'continue'): void
}>()
</script>

<template>
  <div
    class="bg-bg-surface border border-border-theme rounded-2xl p-6 relative overflow-hidden group"
  >
    <h2 class="text-primary font-semibold text-lg mb-6">{{ $t('home.lastread.title') }}</h2>

    <div class="flex items-center gap-8">
      <ProgressRing :percentage="progress" />

      <div class="flex flex-col">
        <div class="flex items-center gap-2 mb-1">
          <div class="w-5 h-5 rounded bg-primary/10 flex items-center justify-center text-primary">
            <IconChevron class="w-3 h-3" :is-open="true" />
          </div>
          <h3 class="text-text-heading font-medium">
            {{ surah }} <span class="text-primary text-sm">({{ verse }})</span>
          </h3>
        </div>
        <p class="text-xs text-text-muted mb-4">{{ $t('home.lastread.subtitle') }}</p>

        <button
          @click="$emit('continue')"
          class="bg-bg-surface hover:bg-bg-surface-hover text-text-heading text-sm font-medium py-2.5 px-5 rounded-lg transition-colors border border-[#2a4a32]/50 w-fit"
        >
          {{ $t('home.lastread.continue') }}
        </button>
      </div>
    </div>
  </div>
</template>
