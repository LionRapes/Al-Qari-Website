<script setup lang="ts">
defineProps<{
  isOpen?: boolean
}>()
</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="transition-transform"
    :class="{ 'rotate-180': isOpen }"
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
</template>
