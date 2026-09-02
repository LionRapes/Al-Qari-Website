<script setup lang="ts">
defineProps<{
  surahName: string
  surahNameArabic: string
  type: 'meccan' | 'medinan'
  versesCount: number
  showBismillah?: boolean
  showAudhubillah?: boolean
}>()
</script>

<template>
  <div class="flex flex-col items-center justify-center p-8 mb-8 border-b border-border-theme">
    <!-- Surah Names -->
    <h1 class="text-3xl font-bold text-primary mb-2">{{ surahName }}</h1>
    <h2 class="text-4xl text-text-heading font-serif mb-4" dir="rtl">{{ surahNameArabic }}</h2>

    <!-- Metadata (Revelation Place & Verse Count) -->
    <div
      class="flex items-center gap-4 text-sm text-text-muted font-medium tracking-wide uppercase mb-8"
    >
      <span class="capitalize">{{ type }}</span>
      <span class="w-1.5 h-1.5 rounded-full bg-primary/50"></span>
      <span>{{ versesCount }} Verses</span>
    </div>

    <!-- Bismillah Graphic / Text -->
    <div v-if="showBismillah" class="text-3xl text-text-heading font-serif" dir="rtl">
      بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
    </div>
    <div v-if="showAudhubillah" class="text-3xl text-text-heading font-serif" dir="rtl">
      أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ
    </div>
  </div>
</template>
