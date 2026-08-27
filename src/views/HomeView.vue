<script setup lang="ts">
import WidgetLastRead from '../components/home/WidgetLastRead.vue'
import WidgetSurahOfDay from '../components/home/WidgetSurahOfDay.vue'
import QuoteCard from '../components/home/QuoteCard.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const lastRead = {
  surah: 'Al-Baqarah',
  verse: '2:108',
  progress: 78,
}

const surahOfTheDay = {
  title: 'Al-Ikhlas (112)',
  englishText:
    'In the name of Allah, the Most Compassionate, the Most Merciful. Say, "He is Allah, the One and Only; Allah, the Eternal Refuge."',
  arabicText: 'قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ',
}

const quotes = [
  {
    id: 1,
    title: 'O believers!',
    body: 'O believers! Remember Allah often and glorify Him morning and evening.',
    source: '« Quran 33:41-42',
  },
  {
    id: 2,
    title: '',
    body: "The best among you is the one who doesn't harm others with his tongue and hands.",
    source: '- Prophet Muhammed (PBUH 301:01-04-19)',
  },
]

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

      <WidgetSurahOfDay
        class="lg:col-span-7"
        :title="surahOfTheDay.title"
        :englishText="surahOfTheDay.englishText"
        :arabicText="surahOfTheDay.arabicText"
      />
    </div>

    <section>
      <h2 class="text-primary font-semibold text-xl mb-5">{{ $t('home.quotes') }}</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
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
