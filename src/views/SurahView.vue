<script setup lang="ts">
import { ref, onMounted, watch, computed, nextTick, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { useSurahDetails } from '@/composables/useSurahDetails'
import { useAyahPlayback } from '@/composables/useAyahPlayback'
import { useLastRead } from '@/composables/useLastRead'
import SurahHeader from '@/components/quran/SurahHeader.vue'
import AyahCard from '@/components/quran/AyahCard.vue'
import { useAyahSelection } from '@/composables/useAyahSelection'
import IconCheck from '@/components/icons/IconCheck.vue'
import { usePlaylistEditor } from '@/composables/usePlaylistEditor'

const route = useRoute()

const { currentSurah, isLoading, fetchSurah } = useSurahDetails()
const { saveLastRead, getLastRead } = useLastRead()

const formattedReciterName = computed(() => {
  const rec = (route.query.reciter as string) || ''
  return rec.replace(/_/g, ' ').replace(' 64k', '')
})

const displayAyahs = computed(() => currentSurah.value?.ayahs || [])
const versesCount = computed(() => currentSurah.value?.versesCount)

const { activeAyahNumber, isPlaying, handlePlayAyah, handleCopyVerse } = useAyahPlayback(
  currentSurah,
  displayAyahs,
)
const { selectedAyahs, toggleAyah, clearSelection, formattedAyahRange } =
  useAyahSelection(versesCount)
const { title, isPublic, tracks, isSaving, savePlaylist } = usePlaylistEditor()

watch(selectedAyahs, (newVal) => {
  if (newVal.length > 0 && !title.value.trim()) {
    title.value = `${currentSurah.value?.name} Playlist`
  }
})

const handleQuickSave = async () => {
  if (!currentSurah.value || selectedAyahs.value.length === 0) return

  tracks.value = [
    {
      surahNumber: currentSurah.value.id,
      riwayahId: String(route.query.riwayah || 'hafs'),
      reciterId: String(route.query.reciter || 'abdur_rashid_sufi_qdc_64k'),
      translationId: String(route.query.lang || 'en'),
      tafsirId: String(route.query.tafsir || 'ru-tafseer-al-saddi'),
      rawAyahsInput: formattedAyahRange.value,
    },
  ]
  isPublic.value = false

  await savePlaylist()
  clearSelection()
}

const onPlayClicked = (ayahNumber: number) => {
  if (!currentSurah.value) return
  const surahId = Number(route.params.id)
  handlePlayAyah(ayahNumber, {
    surahId,
    riwayahId: (route.query.riwayah as string) || 'hafs',
    reciterId: (route.query.reciter as string) || 'abdur_rashid_sufi_qdc_64k',
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
      (route.query.reciter as string) || 'abdur_rashid_sufi_qdc_64k',
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
              class="relative group transition-colors duration-300 border-l-4"
              :class="
                selectedAyahs.includes(ayah.number) || activeAyahNumber === ayah.number
                  ? 'bg-primary/5 border-primary'
                  : 'border-transparent hover:bg-bg-surface-hover'
              "
            >
              <button
                @click="toggleAyah(ayah.number)"
                class="absolute top-8 left-50 md:left-20 z-10 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all cursor-pointer shadow-sm"
                :class="
                  selectedAyahs.includes(ayah.number)
                    ? 'bg-primary border-primary text-bg-base opacity-100'
                    : 'border-border-theme bg-bg-surface text-transparent opacity-0 group-hover:opacity-100'
                "
              >
                <IconCheck />
              </button>

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
    <Transition name="fade-up">
      <div
        v-if="selectedAyahs.length > 0"
        class="fixed bottom-8 left-1/2 -translate-x-1/2 bg-bg-surface border border-border-theme shadow-2xl shadow-primary/10 rounded-2xl px-4 py-3 flex items-center gap-3 z-50 w-[95%] max-w-xl"
      >
        <span class="text-sm font-bold text-text-base shrink-0 ml-2">
          {{ $t('playlist.editor.quickCreate.selected', { count: selectedAyahs.length }) }}
        </span>

        <div class="w-px h-6 bg-border-theme shrink-0"></div>

        <input
          v-model="title"
          type="text"
          :placeholder="$t('playlist.editor.quickCreate.namePlaceholder')"
          class="flex-1 bg-bg-surface-hover border border-border-theme rounded-lg px-3 py-2 text-sm text-text-base focus:border-primary focus:outline-none transition-colors min-w-[100px]"
        />

        <button
          @click="handleQuickSave"
          :disabled="isSaving || !title.trim()"
          class="px-5 py-2 bg-primary text-bg-base rounded-xl font-bold text-sm hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity shrink-0"
        >
          {{
            isSaving
              ? $t('playlist.editor.quickCreate.saving')
              : $t('playlist.editor.quickCreate.save')
          }}
        </button>

        <button
          @click="clearSelection"
          class="p-2 text-text-muted hover:text-error transition-colors rounded-lg hover:bg-error/10 shrink-0"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </Transition>
  </main>
</template>
