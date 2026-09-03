<script setup lang="ts">
defineProps<{
  surahName: string
  surahNameArabic: string
  reciterId: string
  tafsirId: string
}>()
</script>

<template>
  <div
    class="bg-bg-surface-hover px-6 py-4 border-b border-border-theme flex items-center justify-between"
  >
    <div>
      <h3 class="font-bold text-text-heading text-lg">
        {{ surahName }}
        <span class="text-text-muted text-sm font-normal">({{ surahNameArabic }})</span>
      </h3>
      <p class="text-xs text-primary font-semibold uppercase tracking-wider mt-1">
        {{ $t('playlist.detail.track.reciter') }}: {{ reciterId.replace(/_/g, ' ') }}
      </p>
    </div>
    <div class="text-right">
      <span
        class="px-2 py-1 bg-bg-surface text-text-muted text-[10px] font-bold uppercase rounded border border-border-theme"
      >
        {{ $t('playlist.detail.track.tafsir') }}: {{ tafsirId }}
      </span>
    </div>
  </div>
</template>
