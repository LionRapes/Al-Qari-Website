<script setup lang="ts">
import { useRoute } from 'vue-router'

defineProps<{
  isOpen: boolean
  items: { name: string; path: string }[]
}>()

defineEmits<{
  (e: 'close'): void
}>()

const route = useRoute()
</script>

<template>
  <transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="transform -translate-y-4 opacity-0"
    enter-to-class="transform translate-y-0 opacity-100"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="transform translate-y-0 opacity-100"
    leave-to-class="transform -translate-y-4 opacity-0"
  >
    <div
      v-if="isOpen"
      class="absolute top-22.5 left-0 w-full bg-bg-surface border-b border-border-theme md:hidden px-8 py-6 shadow-2xl"
    >
      <nav class="flex flex-col gap-6 text-base font-medium">
        <router-link
          v-for="(item, idx) in items"
          :key="idx"
          :to="item.path"
          @click="$emit('close')"
          :class="[
            'transition-colors',
            route.path === item.path ? 'text-primary' : 'text-base hover:text-text-base',
          ]"
        >
          {{ item.name }}
        </router-link>
      </nav>
    </div>
  </transition>
</template>
