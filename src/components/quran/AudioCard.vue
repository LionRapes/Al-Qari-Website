<script setup lang="ts">
import IconBook from '../icons/IconBook.vue'

interface Props {
  title: string
  subtitle: string
  desc: string
  time: string
  isPlaying: boolean
}

defineProps<Props>()
</script>

<template>
  <div
    class="bg-bg-surface border border-border-theme rounded-2xl p-5 flex flex-col justify-between hover:border-primary/30 transition-colors group cursor-pointer"
  >
    <!-- Card Header -->
    <div class="flex items-center justify-between mb-5">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 bg-primary/10 rounded-md flex items-center justify-center text-primary">
          <IconBook class="w-4 h-4" />
        </div>
        <span class="font-semibold text-text-heading">{{ title }}</span>
      </div>
      <button class="text-text-muted hover:text-text-hover">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"
          />
        </svg>
      </button>
    </div>

    <!-- Card Info -->
    <div class="mb-6">
      <h3 class="text-[15px] font-medium text-text-base">{{ subtitle }}</h3>
      <p class="text-[13px] text-text-muted mt-1.5 line-clamp-2 leading-relaxed">
        {{ desc }}
      </p>

      <div class="h-5 mt-2">
        <div v-if="time" class="text-xs text-text-muted flex justify-end gap-1.5 items-center">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {{ time }}
        </div>
      </div>
    </div>

    <!-- Mini Card Controls -->
    <div class="flex items-center gap-4 mt-auto">
      <button class="text-primary hover:scale-110 transition-transform">
        <svg v-if="!isPlaying" class="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z" />
        </svg>
        <svg v-else class="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
          <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
        </svg>
      </button>

      <input
        type="range"
        class="flex-1 custom-slider"
        min="0"
        max="100"
        :value="isPlaying ? 40 : 0"
      />

      <button class="text-text-muted hover:text-primary transition-colors">
        <svg class="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
.custom-slider {
  appearance: none;
  width: 100%;
  height: 4px;
  background: color-mix(in srgb, var(--color-text-muted) 20%, transparent);
  border-radius: 5px;
  outline: none;
}
.custom-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--color-primary);
  cursor: pointer;
  transition: transform 0.1s ease-in-out;
}
.custom-slider::-webkit-slider-thumb:hover {
  transform: scale(1.3);
}
.custom-slider::-moz-range-thumb {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--color-primary);
  cursor: pointer;
  border: none;
  transition: transform 0.1s ease-in-out;
}
.custom-slider::-moz-range-thumb:hover {
  transform: scale(1.3);
}
</style>
