<script setup lang="ts">
defineProps<{
  percentage: number
}>()
</script>

<template>
  <div class="relative w-28 h-28 shrink-0">
    <svg viewBox="0 0 36 36" class="w-full h-full transform -rotate-90">
      <circle
        cx="18"
        cy="18"
        r="15.915"
        fill="transparent"
        stroke="currentColor"
        class="text-bg-base"
        stroke-width="3"
      ></circle>
      <circle
        cx="18"
        cy="18"
        r="15.915"
        fill="transparent"
        stroke="currentColor"
        class="text-primary transition-all duration-1000 ease-out"
        stroke-width="3"
        :stroke-dasharray="`${percentage} ${100 - percentage}`"
        stroke-dashoffset="0"
        stroke-linecap="round"
      ></circle>
    </svg>
    <div class="absolute inset-0 flex items-center justify-center">
      <span class="text-2xl font-bold text-text-heading">{{ percentage }}%</span>
    </div>
  </div>
</template>
