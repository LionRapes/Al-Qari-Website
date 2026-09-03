<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useHomeDashboard } from '@/composables/useHomeDashboard'

import WidgetLastRead from '@/components/home/WidgetLastRead.vue'
import WidgetSurahOfDay from '@/components/home/WidgetSurahOfDay.vue'
import QuoteCard from '@/components/home/QuoteCard.vue'

const router = useRouter()
const { lastRead, surahOfTheDay, quotes, initDashboardData } = useHomeDashboard()

const handleContinueReading = () => {
  router.push({
    path: `/quran/${lastRead.value.surahId}`,
    query: lastRead.value.query,
  })
}

onMounted(async () => {
  await initDashboardData()
})
</script>

<template>
  <main class="max-w-350 mx-auto px-8 mt-6">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10">
      <WidgetLastRead
        class="lg:col-span-5"
        :surah="lastRead.surahName"
        :verse="`${lastRead.surahId}:${lastRead.verseNumber}`"
        :progress="lastRead.progress"
        @continue="handleContinueReading"
      />

      <div
        v-if="surahOfTheDay.title === ''"
        class="bg-bg-surface-hover border border-border-theme rounded-2xl p-6 relative lg:col-span-7 animate-pulse"
      ></div>

      <WidgetSurahOfDay
        v-else
        class="lg:col-span-7"
        :title="surahOfTheDay.title"
        :englishText="surahOfTheDay.englishText"
        :arabicText="surahOfTheDay.arabicText"
      />
    </div>

    <section>
      <h2 class="text-primary font-semibold text-xl mb-5">{{ $t('home.quotes') }}</h2>

      <div v-if="quotes.length === 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          v-for="i in 2"
          :key="i"
          class="h-50 bg-bg-surface-hover border border-border-theme rounded-2xl p-7 flex flex-col animate-pulse"
        ></div>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <QuoteCard
          v-for="quote in quotes"
          :key="quote.id"
          :title="quote.title"
          :body="quote.body"
          :source="quote.source"
        />
      </div>
    </section>
  </main>
</template>
