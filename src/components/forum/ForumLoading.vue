<script setup lang="ts">
defineProps<{ text: string }>()
</script>

<template>
  <div class="flex justify-center items-center py-16">
    <div class="animate-pulse flex flex-col items-center">
      <div
        class="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4"
      ></div>
      <span class="text-text-muted text-lg">{{ text }}</span>
    </div>
  </div>
</template>
