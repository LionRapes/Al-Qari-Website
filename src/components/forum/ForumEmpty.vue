<script setup lang="ts">
defineProps<{ text: string }>()
</script>

<template>
  <div class="text-center py-16 bg-bg-surface rounded-xl border border-border-theme">
    <p class="text-text-muted text-lg">{{ text }}</p>
    <slot></slot>
  </div>
</template>
