<script setup lang="ts">
import TheHeader from './components/header/TheHeader.vue'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const navigation = computed(() => [
  { name: t('nav.home'), path: '/' },
  { name: t('nav.quran'), path: '/quran' },
])
</script>

<template>
  <div class="min-h-screen bg-base-gradient text-text-base font-sans pb-12">
    <TheHeader :navigation="navigation" />

    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
