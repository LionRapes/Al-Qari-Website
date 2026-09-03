<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useLazyScroll } from '@/composables/useLazyScroll'
import SurahCard from '@/components/quran/SurahCard.vue'
import type { SurahCardData } from '@/types/ui.types'

const props = defineProps<{
  isFetchingNetwork: boolean
  audioCards: SurahCardData[]
  activeSurahId: number | null
  isPlaying: boolean
}>()

const emit = defineEmits<{
  (e: 'navigate', id: number): void
  (e: 'playToggle', id: number, title: string): void
}>()

const BATCH_SIZE = 12
const visibleCount = ref(0)
const visibleAudioCards = computed(() => props.audioCards.slice(0, visibleCount.value))

const { containerRef, triggerRef } = useLazyScroll(() => {
  if (visibleCount.value < props.audioCards.length) {
    visibleCount.value += BATCH_SIZE
  }
})

onMounted(() => {
  visibleCount.value = BATCH_SIZE
})
</script>

<template>
  <div
    ref="containerRef"
    class="flex-1 h-[75vh] lg:h-[calc(100vh-8rem)] max-h-142 overflow-y-auto custom-scrollbar bg-bg-surface border border-border-theme rounded-3xl p-8"
  >
    <div v-if="isFetchingNetwork" class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="i in BATCH_SIZE"
        :key="i"
        class="h-32 bg-bg-surface-hover rounded-2xl border border-border-theme animate-pulse"
      ></div>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <SurahCard
        v-for="card in visibleAudioCards"
        :key="card.id"
        :id="card.id"
        :title="card.title"
        :subtitle="card.subtitle"
        :desc="card.desc"
        :is-playing="activeSurahId === card.id && isPlaying"
        @click="emit('navigate', card.id)"
        @play-toggle="emit('playToggle', card.id, card.title)"
      />
    </div>

    <div ref="triggerRef" class="h-10 w-full mt-4"></div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
  margin-block: 1rem;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: var(--color-border-theme, #1f3024);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: var(--color-primary, #d4af60);
}
</style>
