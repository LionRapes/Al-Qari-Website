<script setup lang="ts">
import IconUser from '@/components/icons/IconUser.vue'

defineProps<{
  isLoggedIn: boolean
  name?: string
  tier?: string
  avatarUrl?: string
}>()
</script>

<template>
  <router-link
    :to="isLoggedIn ? '/profile' : '/login'"
    class="flex items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity"
  >
    <div
      class="w-10 h-10 bg-bg-surface rounded-full border-2 border-border-theme/30 flex items-center justify-center overflow-hidden shrink-0"
    >
      <img
        v-if="isLoggedIn && avatarUrl"
        :src="avatarUrl"
        :alt="name || 'User avatar'"
        class="w-full h-full object-cover"
      />
      <IconUser v-else class="w-6 h-6 text-primary" />
    </div>
    <div class="text-sm hidden sm:block">
      <template v-if="isLoggedIn">
        <div class="text-text-base font-semibold">{{ name }}</div>
        <div class="text-primary text-[10px] tracking-wider font-semibold uppercase mt-0.5">
          {{ tier }}
        </div>
      </template>
      <template v-else>
        <div class="text-text-base font-semibold">{{ $t('nav.login') }}</div>
      </template>
    </div>
  </router-link>
</template>
