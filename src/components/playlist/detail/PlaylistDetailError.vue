<script setup lang="ts">
defineProps<{
  error: string
}>()

defineEmits<{
  (e: 'retry'): void
}>()
</script>

<template>
  <div class="bg-error/10 border border-error/20 text-error rounded-3xl p-10 text-center">
    <p class="font-medium mb-4">{{ error }}</p>
    <button
      @click="$emit('retry')"
      class="px-6 py-2 bg-error text-text-heading text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity cursor-pointer"
    >
      {{ $t('playlist.detail.tryAgain') }}
    </button>
  </div>
</template>
