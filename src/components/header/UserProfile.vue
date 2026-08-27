<script setup lang="ts">
import IconUser from '../icons/IconUser.vue'

defineProps<{
  name: string
  tier: string
}>()
</script>

<template>
  <router-link
    to="/profile"
    class="flex items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity"
  >
    <div
      class="w-10 h-10 bg-bg-surface rounded-full border-2 border-border-theme/30 flex items-center justify-center overflow-hidden shrink-0"
    >
      <IconUser class="w-6 h-6 text-primary" />
    </div>
    <div class="text-sm hidden sm:block">
      <div class="text-text-base font-semibold">{{ name }}</div>
      <div class="text-primary text-[10px] tracking-wider font-semibold uppercase mt-0.5">
        {{ tier }}
      </div>
    </div>
  </router-link>
</template>
