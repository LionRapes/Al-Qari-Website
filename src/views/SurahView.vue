<script setup lang="ts">
import { ref, onMounted, watch, computed, nextTick, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { useSurahDetails } from '@/composables/useSurahDetails'
import { useAyahPlayback } from '@/composables/useAyahPlayback'
import { useLastRead } from '@/composables/useLastRead'
import SurahHeader from '@/components/quran/SurahHeader.vue'
import AyahCard from '@/components/quran/AyahCard.vue'

const route = useRoute()

const { currentSurah, isLoading, fetchSurah } = useSurahDetails()
const { saveLastRead, getLastRead } = useLastRead()

const formattedReciterName = computed(() => {
  const rec = (route.query.reciter as string) || ''
  return rec.replace(/_/g, ' ').replace(' 32k', '')
})

const displayAyahs = computed(() => currentSurah.value?.ayahs || [])

const { activeAyahNumber, isPlaying, handlePlayAyah, handleCopyVerse } = useAyahPlayback(
  currentSurah,
  displayAyahs,
)

const onPlayClicked = (ayahNumber: number) => {
  if (!currentSurah.value) return
  const surahId = Number(route.params.id)
  handlePlayAyah(ayahNumber, {
    surahId,
    riwayahId: (route.query.riwayah as string) || 'hafs',
    reciterId: (route.query.reciter as string) || 'Abdul-bary_Mohammad_32k',
    surahName: currentSurah.value.name,
    reciterName: formattedReciterName.value,
  })
}

const ayahElements = ref<HTMLElement[]>([])
let observer: IntersectionObserver | null = null

const setupScrollObserver = () => {
  if (observer) observer.disconnect()

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const ayahNum = Number((entry.target as HTMLElement).dataset.verse)
          if (ayahNum) updateLastReadProgress(ayahNum)
        }
      })
    },
    {
      rootMargin: '-20% 0px -70% 0px',
    },
  )

  ayahElements.value.forEach((el) => {
    if (el) observer?.observe(el)
  })
}

watch(currentSurah, async (newVal) => {
  if (newVal) {
    if (!activeAyahNumber.value) updateLastReadProgress(1)
    await nextTick()
    setupScrollObserver()
  }
})

onBeforeUnmount(() => {
  if (observer) observer.disconnect()
})

const updateLastReadProgress = (ayahNum: number) => {
  if (!currentSurah.value) return

  const currentSaved = getLastRead()
  if (currentSaved && currentSaved.surahId === currentSurah.value.id) {
    if (ayahNum <= currentSaved.verseNumber) {
      return
    }
  }

  const total = currentSurah.value.versesCount
  saveLastRead({
    surahId: currentSurah.value.id,
    surahName: currentSurah.value.name,
    verseNumber: ayahNum,
    progress: Math.round((ayahNum / total) * 100),
    query: route.query,
  })
}

const loadSurahData = () => {
  const surahId = Number(route.params.id)
  if (surahId) {
    fetchSurah(
      surahId,
      (route.query.riwayah as string) || 'hafs',
      (route.query.lang as string) || 'en',
      (route.query.tafsir as string) || 'ru-tafseer-al-saddi',
      (route.query.transcription as string) || (route.query.lang as string) || 'en',
      (route.query.reciter as string) || 'Abdul-bary_Mohammad_32k',
    )
  }
}

onMounted(loadSurahData)
watch(() => route.query, loadSurahData, { deep: true })
</script>

<template>
  <main class="max-w-350 mx-auto px-8 mt-6 pb-32">
    <div class="flex flex-col-reverse lg:flex-row gap-10">
      <div
        class="flex-1 bg-bg-surface border border-border-theme rounded-3xl overflow-hidden min-h-125"
      >
        <div v-if="isLoading" class="flex items-center justify-center h-full p-20">
          <div
            class="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"
          ></div>
        </div>

        <template v-else-if="currentSurah">
          <SurahHeader
            :surahName="currentSurah.name"
            :surahNameArabic="currentSurah.nameArabic"
            :type="currentSurah.revelationType"
            :versesCount="currentSurah.versesCount"
            :showBismillah="currentSurah.showBismillah"
            :showAudhubillah="currentSurah.showAudhubillah"
          />

          <div class="flex flex-col">
            <div
              v-for="ayah in displayAyahs"
              :key="ayah.number"
              ref="ayahElements"
              :data-verse="ayah.number"
            >
              <AyahCard
                :ayahNumber="ayah.number"
                :arabicText="ayah.arabic"
                :translationText="ayah.translation"
                :transcriptionText="ayah.transcription"
                :tafsirText="ayah.tafsir"
                :isPlaying="activeAyahNumber === ayah.number && isPlaying"
                @play="onPlayClicked"
                @copy="handleCopyVerse"
              />
            </div>
          </div>
        </template>
      </div>
    </div>
  </main>
</template>
