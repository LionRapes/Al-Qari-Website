<script setup lang="ts">
defineProps<{ error: string; retryText: string }>()
defineEmits<{ (e: 'retry'): void }>()
</script>

<template>
  <div class="bg-bg-surface border-l-4 border-text-red p-6 rounded-r-lg shadow-sm">
    <div class="flex items-center">
      <span class="text-text-red font-semibold text-lg">{{ error }}</span>
    </div>
    <button
      @click="$emit('retry')"
      class="mt-4 text-text-blue hover:text-text-hover transition-colors text-sm font-medium"
    >
      {{ retryText }}
    </button>
  </div>
</template>
