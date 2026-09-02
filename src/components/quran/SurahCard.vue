<script setup lang="ts">
import IconBook from '../icons/IconBook.vue'
import IconOther from '../icons/IconOther.vue'
import IconPlay from '../icons/IconPlay.vue'

interface Props {
  id: number
  title: string
  subtitle: string
  desc: string
  isPlaying: boolean
}

defineProps<Props>()

defineEmits<{
  (e: 'playToggle', id: number): void
}>()
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
      <div class="flex items-center gap-3">
        <button
          @click.stop="$emit('playToggle', id)"
          class="text-primary hover:scale-110 transition-transform"
        >
          <IconPlay :is-playing="isPlaying" />
        </button>

        <button class="text-text-muted hover:text-text-hover">
          <IconOther />
        </button>
      </div>
    </div>

    <!-- Card Info -->
    <div>
      <h3 class="text-[15px] font-medium text-text-base">{{ subtitle }}</h3>
      <p class="text-[13px] text-text-muted mt-1.5 line-clamp-2 leading-relaxed">
        {{ desc }}
      </p>
    </div>
  </div>
</template>
