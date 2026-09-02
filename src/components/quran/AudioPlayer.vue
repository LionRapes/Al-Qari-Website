<script setup lang="ts">
import { useAudioPlayer } from '@/composables/useAudioPlayer'
import IconPlay from '../icons/IconPlay.vue'

const {
  activeSurahId,
  activeReciterId,
  isPlaying,
  progress,
  timeText,
  trackTitle,
  trackReciter,
  playToggle,
  seek,
} = useAudioPlayer()

const handleGlobalSeek = (event: Event) => {
  const target = event.target as HTMLInputElement
  seek(Number(target.value))
}
</script>

<template>
  <transition name="slide-up">
    <div
      v-if="activeSurahId && activeReciterId"
      class="fixed bottom-0 left-0 right-0 mx-auto w-9/10 bg-bg-surface border-t border-border-theme rounded-2xl shadow-2xl z-50 px-6 py-2 max-h-18"
    >
      <div class="max-w-350 mx-auto flex items-center gap-6">
        <!-- Track Info -->
        <div class="hidden md:flex flex-col min-w-50">
          <span class="text-text-heading font-semibold text-sm line-clamp-1">
            {{ trackTitle }}
          </span>
          <span class="text-text-muted text-xs mt-0.5 line-clamp-1">
            {{ trackReciter }}
          </span>
        </div>

        <!-- Controls & Scrubber -->
        <div class="flex-1 flex flex-col sm:flex-row items-center gap-4">
          <button
            @click="playToggle(activeSurahId, '', activeReciterId)"
            class="w-10 h-10 shrink-0 bg-primary/10 hover:bg-primary/20 rounded-full flex items-center justify-center text-primary transition-colors"
          >
            <IconPlay :isPlaying="isPlaying" />
          </button>

          <div class="flex-1 flex items-center gap-3 w-full">
            <span class="text-xs text-text-muted font-medium w-10 text-right">{{ timeText }}</span>
            <input
              type="range"
              class="flex-1 custom-slider"
              min="0"
              max="100"
              step="0.1"
              :value="progress"
              @input="handleGlobalSeek"
            />
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.custom-slider {
  appearance: none;
  height: 6px;
  background: color-mix(in srgb, var(--color-text-muted) 20%, transparent);
  border-radius: 999px;
  outline: none;
  cursor: pointer;
}
.custom-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--color-primary);
  cursor: pointer;
  transition: transform 0.1s ease-in-out;
}
.custom-slider::-webkit-slider-thumb:hover {
  transform: scale(1.3);
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition:
    transform 0.3s ease-out,
    opacity 0.3s ease-out;
}
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>
