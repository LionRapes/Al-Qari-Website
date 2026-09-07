<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import TheHeader from './components/header/TheHeader.vue'
import AudioPlayer from './components/quran/AudioPlayer.vue'
import LoadingScreen from './components/LoadingScreen.vue'

const { t } = useI18n()
const isLoading = ref(true)

onMounted(() => {
  if (
    localStorage.theme === 'dark' ||
    (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
  ) {
    document.documentElement.classList.add('dark')
  }
})

const navigation = computed(() => [
  { name: t('nav.home'), path: '/' },
  { name: t('nav.quran'), path: '/quran' },
  { name: t('nav.playlists'), path: '/playlists' },
  { name: t('nav.forum'), path: '/forum' },
])
</script>

<template>
  <div class="relative z-0 min-h-screen text-text-base font-sans pb-12">
    <div class="fixed inset-0 -z-20 bg-(image:--bg-gradient-light)"></div>
    <div
      class="fixed inset-0 -z-10 bg-(image:--bg-gradient-dark) transition-opacity duration-1000 ease-in-out"
      style="opacity: var(--dark-layer-opacity)"
    ></div>

    <transition name="fade" mode="out-in">
      <LoadingScreen v-if="isLoading" @ready="isLoading = false" />

      <div v-else class="flex flex-col w-full">
        <TheHeader :navigation="navigation" />

        <div class="grid w-full">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" class="col-start-1 row-start-1 w-full" />
            </transition>
          </router-view>
        </div>

        <AudioPlayer />
      </div>
    </transition>
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease-in-out;
}

.fade-leave-active {
  pointer-events: none;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
