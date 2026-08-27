<script setup lang="ts">
import { ref } from 'vue'
import SidebarDropdown from '../components/quran/SidebarDropdown.vue'
import IconBook from '@/components/icons/IconBook.vue'
import IconTranslation from '@/components/icons/IconTranslation.vue'
import IconAudio from '@/components/icons/IconAudio.vue'
import IconRiwayah from '@/components/icons/IconRiwayah.vue'
import AudioCard from '@/components/quran/AudioCard.vue'

const selectedReciter = ref({ id: 'mishary', label: 'Mishary Rashid Alafasy' })
const selectedLanguage = ref({ id: 'ru', label: 'Русский' })
const selectedTafsir = ref({ id: 'sadi', label: "Tafsir As-Sa'di" })
const selectedRiwayah = ref({ id: 'hafs', label: "Hafs 'an 'Asim" })

const reciters = [
  { id: 'mishary', label: 'Mishary Rashid Alafasy' },
  { id: 'abdulbasit', label: "Abdul Basit 'Abd us-Samad" },
  { id: 'husary', label: 'Mahmoud Khalil Al-Husary' },
]

const languages = [
  { id: 'ru', label: 'Русский (Russian)' },
  { id: 'en', label: 'English' },
  { id: 'ar', label: 'العربية (Arabic)' },
]

const tafsirs = [
  { id: 'sadi', label: "Tafsir As-Sa'di" },
  { id: 'jalalayn', label: 'Tafsir Al-Jalalayn' },
  { id: 'ibnkathir', label: 'Tafsir Ibn Kathir' },
]

const riwayahs = [
  { id: 'hafs', label: "Hafs 'an 'Asim" },
  { id: 'warsh', label: "Warsh 'an Nafi'" },
  { id: 'qalun', label: "Qalun 'an Nafi'" },
]

const audioCards = ref([
  {
    title: 'Аль-Бакара',
    subtitle: 'Аяты 235 – 237',
    desc: 'Аятуль-Курси и продолжение',
    time: '2:15',
    isPlaying: false,
  },
  {
    title: 'Аль-Мульк',
    subtitle: 'Аяты 1 – 12',
    desc: 'Ежедневное повторение перед сном',
    time: '4:30',
    isPlaying: false,
  },
  {
    title: 'Аль-Мульк',
    subtitle: 'Аяты 1 – 13',
    desc: 'Ежедневное повторение перед сном',
    time: '4:30',
    isPlaying: false,
  },
  {
    title: 'Аль-Мульк',
    subtitle: 'Аяты 1 – 10',
    desc: 'Защита от Даджаля',
    time: '1:45',
    isPlaying: false,
  },
  {
    title: 'Аль-Кахф',
    subtitle: 'Аяты 1 – 10',
    desc: 'Защита от Даджаля',
    time: '5:20',
    isPlaying: false,
  },
  { title: 'Ясин', subtitle: 'Аяты 1 – 12', desc: 'Сердце Корана', time: '3:10', isPlaying: false },
])
</script>

<template>
  <main class="max-w-350 mx-auto px-8 mt-6">
    <div class="flex flex-col-reverse lg:flex-row gap-10">
      <!-- LEFT AREA: Main Content (Quran Reader) -->
      <div class="flex-1 min-h-149 bg-bg-surface border border-border-theme rounded-3xl p-8">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AudioCard
            v-for="(card, idx) in audioCards"
            :key="idx"
            :title="card.title"
            :subtitle="card.subtitle"
            :desc="card.desc"
            :time="card.time"
            :is-playing="card.isPlaying"
          />
        </div>
      </div>

      <!-- RIGHT AREA: Sidebar Menus -->
      <aside class="w-full lg:w-80 shrink-0 flex flex-col">
        <!-- Reciter Dropdown -->
        <SidebarDropdown :title="$t('quran.reciter')" :options="reciters" v-model="selectedReciter">
          <template #icon>
            <IconAudio />
          </template>
        </SidebarDropdown>

        <!-- Translation/Language Dropdown -->
        <SidebarDropdown
          :title="$t('quran.translation')"
          :options="languages"
          v-model="selectedLanguage"
        >
          <template #icon>
            <IconTranslation />
          </template>
        </SidebarDropdown>

        <!-- Tafsir Dropdown -->
        <SidebarDropdown :title="$t('quran.tafsir')" :options="tafsirs" v-model="selectedTafsir">
          <template #icon>
            <IconBook />
          </template>
        </SidebarDropdown>

        <!-- Riwayah Dropdown -->
        <SidebarDropdown :title="$t('quran.riwayah')" :options="riwayahs" v-model="selectedRiwayah">
          <template #icon>
            <IconRiwayah />
          </template>
        </SidebarDropdown>
      </aside>
    </div>
  </main>
</template>
