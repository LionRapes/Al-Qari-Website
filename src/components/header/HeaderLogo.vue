<script setup lang="ts">
import IconBook from '@/components/icons/IconBook.vue'
import IconHamburger from '@/components/icons/IconHamburger.vue'
import IconClose from '@/components/icons/IconClose.vue'

defineProps<{
  isMobileMenuOpen: boolean
}>()

// [[#HEADER-toggleMenu| ]]
defineEmits<{
  (e: 'toggle'): void
}>()
</script>

<template>
  <div class="flex items-center gap-3 text-primary font-bold text-xl tracking-wider uppercase">
    <button
      @click="$emit('toggle')"
      class="w-10 h-10 bg-primary/30 rounded-xl flex items-center justify-center transition-transform md:cursor-default cursor-pointer md:hover:scale-100 hover:scale-105"
    >
      <!-- Desktop Logo Icon -->
      <IconBook class="hidden md:block w-6 h-6 text-primary" />

      <!-- Mobile Hamburger Icon -->
      <IconHamburger v-if="!isMobileMenuOpen" class="block md:hidden w-6 h-6 text-primary" />

      <!-- Mobile Close Icon (X) -->
      <IconClose v-else class="block md:hidden w-6 h-6 text-primary" />
    </button>
    <RouterLink to="/" class="hover:opacity-85 transition-opacity"> Al-Qari </RouterLink>
  </div>
</template>
