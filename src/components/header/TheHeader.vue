<script setup lang="ts">
import { ref } from 'vue'
import HeaderLogo from './HeaderLogo.vue'
import DesktopNav from './DesktopNav.vue'
import MobileNav from './MobileNav.vue'
import UserProfile from './UserProfile.vue'

defineProps<{
  navigation: { name: string; path: string }[]
}>()

const isMobileMenuOpen = ref(false)

// [[HEADER-toggleMenu|Close/Open mobile nav menu]]
const toggleMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}
</script>

<template>
  <header class="relative max-w-350 mx-auto px-8 py-8 flex items-center justify-between z-50">
    <div class="flex items-center gap-16">
      <HeaderLogo :is-mobile-menu-open="isMobileMenuOpen" @toggle="toggleMenu" />

      <DesktopNav :items="navigation" />
    </div>

    <UserProfile name="Амир Ибн Тарик" :tier="$t('userTier.premium')" />

    <MobileNav :is-open="isMobileMenuOpen" :items="navigation" @close="isMobileMenuOpen = false" />
  </header>
</template>
