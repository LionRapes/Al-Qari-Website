<script setup lang="ts">
import TheHeader from './components/header/TheHeader.vue'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import AudioPlayer from './components/quran/AudioPlayer.vue'

const { t } = useI18n()

const navigation = computed(() => [
  { name: t('nav.home'), path: '/' },
  { name: t('nav.quran'), path: '/quran' },
  { name: t('nav.playlists'), path: '/playlists' },
])
</script>

<template>
  <div class="min-h-screen bg-base-gradient text-text-base font-sans pb-12">
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
