<script setup lang="ts">
import IconQuotes from '../icons/IconQuotes.vue'

defineProps<{
  title?: string
  body: string
  source: string
}>()
</script>

<template>
  <div
    class="bg-bg-surface/80 border border-border-theme rounded-2xl p-7 flex flex-col hover:border-primary/30 transition-colors"
  >
    <IconQuotes class="w-8 h-8 text-primary/60 mb-4 shrink-0" />

    <div class="flex-1">
      <h3 v-if="title" class="text-primary font-medium text-lg mb-2">{{ title }}</h3>
      <p class="text-text-base text-[15px] leading-relaxed">{{ body }}</p>
    </div>

    <p class="text-text-muted text-sm mt-6">{{ source }}</p>
  </div>
</template>
