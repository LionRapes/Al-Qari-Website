<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div
    class="flex flex-col items-center justify-center p-12 text-center bg-bg-surface border border-border-theme rounded-3xl gap-5"
  >
    <div
      class="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold"
    >
      🔒
    </div>
    <div class="max-w-md flex flex-col gap-2">
      <h2 class="text-2xl font-bold text-text-base">{{ $t('playlist.guest.title') }}</h2>
      <p class="text-text-muted text-sm leading-relaxed">
        {{ $t('playlist.guest.desc') }}
      </p>
    </div>
    <button
      @click="router.push('/login')"
      class="mt-2 px-6 py-3 bg-primary text-text-heading font-semibold text-sm rounded-xl hover:opacity-90 transition-opacity shadow-sm cursor-pointer"
    >
      {{ $t('playlist.guest.button') }}
    </button>
  </div>
</template>
