<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import IconLanguage from '../icons/IconLanguage.vue'

const { locale, availableLocales } = useI18n()
const isOpen = ref(false)

const savedLocale = localStorage.getItem('user-locale')
if (savedLocale && availableLocales.includes(savedLocale)) {
  locale.value = savedLocale
}

const toggleMenu = () => {
  isOpen.value = !isOpen.value
}

const changeLanguage = (lang: string) => {
  locale.value = lang
  localStorage.setItem('user-locale', lang)
  isOpen.value = false
}

const closeMenu = (e: Event) => {
  if (!(e.target as Element).closest('.language-switcher')) {
    isOpen.value = false
  }
}

onMounted(() => document.addEventListener('click', closeMenu))
onUnmounted(() => document.removeEventListener('click', closeMenu))
</script>

<template>
  <div class="relative language-switcher">
    <button
      @click="toggleMenu"
      class="px-3 py-2 text-text-base hover:bg-bg-surface-hover rounded-lg transition-colors text-sm font-semibold uppercase flex items-center gap-2"
      aria-label="Select language"
    >
      {{ locale }}
      <IconLanguage :is-open="isOpen" />
    </button>

    <ul
      v-show="isOpen"
      class="absolute right-0 mt-2 w-32 bg-bg-surface border border-border-theme rounded-lg shadow-sm overflow-hidden z-50"
    >
      <li v-for="lang in availableLocales" :key="lang">
        <button
          @click="changeLanguage(lang)"
          class="w-full text-left px-4 py-3 text-sm text-text-base hover:bg-bg-surface-hover transition-colors uppercase"
          :class="{ 'font-bold text-primary': locale === lang }"
        >
          {{ lang }}
        </button>
      </li>
    </ul>
  </div>
</template>
