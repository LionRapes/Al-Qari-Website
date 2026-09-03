<script setup lang="ts">
import SidebarDropdown from '@/components/quran/SidebarDropdown.vue'
import IconBook from '@/components/icons/IconBook.vue'
import IconTranslation from '@/components/icons/IconTranslation.vue'
import IconAudio from '@/components/icons/IconAudio.vue'
import IconRiwayah from '@/components/icons/IconRiwayah.vue'
import type { DropdownOption } from '@/types/ui.types'

defineProps<{
  isLoadingMetadata: boolean
  dropdownOptions: Record<string, DropdownOption[]>
}>()

const selectedReciter = defineModel<DropdownOption | null>('selectedReciter')
const selectedLanguage = defineModel<DropdownOption | null>('selectedLanguage')
const selectedTafsir = defineModel<DropdownOption | null>('selectedTafsir')
const selectedRiwayah = defineModel<DropdownOption | null>('selectedRiwayah')
</script>

<template>
  <aside class="w-full lg:w-80 shrink-0 flex flex-col">
    <div v-if="isLoadingMetadata" class="animate-pulse flex flex-col gap-4">
      <div
        v-for="i in 4"
        :key="i"
        class="h-18 bg-bg-surface-hover rounded-2xl w-full border border-border-theme"
      ></div>
    </div>

    <template v-else>
      <SidebarDropdown
        :title="$t('quran.reciter')"
        :options="dropdownOptions.reciters!"
        v-model="selectedReciter"
      >
        <template #icon><IconAudio /></template>
      </SidebarDropdown>

      <SidebarDropdown
        :title="$t('quran.translation')"
        :options="dropdownOptions.languages!"
        v-model="selectedLanguage"
      >
        <template #icon><IconTranslation /></template>
      </SidebarDropdown>

      <SidebarDropdown
        :title="$t('quran.tafsir')"
        :options="dropdownOptions.tafsirs!"
        v-model="selectedTafsir"
      >
        <template #icon><IconBook class="w-6 h-6" /></template>
      </SidebarDropdown>

      <SidebarDropdown
        :title="$t('quran.riwayah')"
        :options="dropdownOptions.riwayahs!"
        v-model="selectedRiwayah"
      >
        <template #icon><IconRiwayah /></template>
      </SidebarDropdown>
    </template>
  </aside>
</template>
