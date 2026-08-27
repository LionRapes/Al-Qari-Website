<script setup lang="ts">
import { useRoute } from 'vue-router'

defineProps<{
  items: { name: string; path: string }[]
}>()

const route = useRoute()
</script>

<template>
  <nav class="hidden md:flex items-center gap-10 text-sm font-bold">
    <router-link
      v-for="(item, idx) in items"
      :key="idx"
      :to="item.path"
      :class="[
        'link',
        route.path === item.path ? 'text-primary border-b-2 border-primary pb-1' : 'text-text-base',
      ]"
    >
      {{ item.name }}
    </router-link>
  </nav>
</template>

<style scoped>
.link {
  transition:
    color 0.2s ease,
    border-color 0.2s ease,
    padding-bottom 0.2s ease;
}

.link:hover {
  color: var(--primary);
}
</style>
