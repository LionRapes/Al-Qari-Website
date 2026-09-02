<script setup lang="ts">
import WidgetLastRead from '@/components/home/WidgetLastRead.vue'
import WidgetSurahOfDay from '@/components/home/WidgetSurahOfDay.vue'
import QuoteCard from '@/components/home/QuoteCard.vue'
import { useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { ApiQuote, SurahOfDay } from '@/types/index.ts'
import quranApi from '@/services/quranApi'

const router = useRouter()
const { locale } = useI18n()

const lastRead = {
  surah: 'Al-Baqarah',
  verse: '2:108',
  progress: 78,
}

const surahOfTheDay = ref<SurahOfDay>({
  title: '',
  englishText: '',
  arabicText: '',
})

const quotes = ref<ApiQuote[]>([])

const loadHomeData = async () => {
  try {
    const randomSurahId = Math.floor(Math.random() * 114) + 1
    const data = await quranApi.getSurah('hafs', randomSurahId)
    const dataTranslated = await quranApi.getTranslatedSurah(locale.value, randomSurahId)

    surahOfTheDay.value = {
      title: `${dataTranslated.name || data.name} (${randomSurahId})`,
      englishText: dataTranslated.verses[0]?.text || 'Read and explore this Surah.',
      arabicText: data.name,
    }
  } catch (error) {
    console.error('Failed to load Surah of the Day:', error)
  }
}

const loadQuotesData = async () => {
  try {
    const data = await quranApi.getQuotes(locale.value)
    const shuffled = [...data].sort(() => 0.5 - Math.random())
    quotes.value = shuffled.slice(0, 2)
  } catch (error) {
    console.error('Failed to load quotes:', error)
  }
}

onMounted(async () => {
  await loadHomeData()
  await loadQuotesData()
})

const handleContinueReading = () => {
  router.push('/quran')
}
</script>

<template>
  <main class="max-w-350 mx-auto px-8 mt-6">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10">
      <WidgetLastRead
        class="lg:col-span-5"
        :surah="lastRead.surah"
        :verse="lastRead.verse"
        :progress="lastRead.progress"
        @continue="handleContinueReading"
      />

      <div
        v-if="surahOfTheDay.title === ''"
        class="bg-bg-surface-hover border border-border-theme rounded-2xl p-6 relative w-200"
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
