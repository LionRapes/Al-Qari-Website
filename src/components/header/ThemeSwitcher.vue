<script setup lang="ts">
import { ref, onMounted } from 'vue'
import IconTheme from '../icons/IconTheme.vue'

const isDark = ref(false)

const initTheme = () => {
  if (
    localStorage.theme == 'dark' ||
    (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
  ) {
    document.documentElement.classList.add('dark')
    isDark.value = true
  }
}

onMounted(initTheme)

const toggleTheme = () => {
  isDark.value = !isDark.value
  if (isDark.value) {
    document.documentElement.classList.add('dark')
    localStorage.theme = 'dark'
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.theme = 'light'
  }
}
</script>

<template>
  <button
    @click="toggleTheme"
    class="p-2 hover:bg-bg-surface-hover rounded-lg transition-colors flex items-center justify-center text-text-base"
    aria-label="Toggle theme"
  >
    <IconTheme :is-dark="isDark" />
  </button>
</template>
