<script setup lang="ts">
import IconBookmark from '@/components/icons/IconBookmark.vue'
import IconInfo from '@/components/icons/IconInfo.vue'

defineProps<{
  title: string
  englishText: string
  arabicText: string
}>()
</script>

<template>
  <div
    class="bg-bg-surface border border-border-theme rounded-2xl p-6 relative flex flex-col justify-between"
  >
    <div class="flex justify-between items-start mb-4">
      <div class="flex items-center gap-2 text-primary">
        <h2 class="font-semibold text-lg">{{ $t('home.daysurah.title') }}</h2>
        <IconInfo class="w-4 h-4 opacity-80" />
      </div>

      <div class="flex items-center gap-2">
        <IconBookmark class="w-5 h-5 text-primary" />
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center h-full">
      <div>
        <h3 class="text-xl font-bold text-text-heading mb-3">{{ title }}</h3>
        <p class="text-sm text-text-base leading-relaxed mb-4">{{ englishText }}</p>
        <p class="text-xs text-primary">{{ $t('home.daysurah.subtitle') }}</p>
      </div>

      <div class="text-right flex flex-col justify-center items-end">
        <p class="text-3xl text-text-heading leading-10 font-serif" dir="rtl">
          {{ arabicText }}
        </p>
      </div>
    </div>
  </div>
</template>
