<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const { t } = useI18n()
const router = useRouter()
</script>

<template>
  <div class="mb-8 border-b border-border-theme pb-4">
    <button
      @click="router.back()"
      class="text-sm font-medium text-text-muted hover:text-primary transition-colors mb-2 inline-block"
    >
      {{ t('forum.post.back') }}
    </button>
    <h1 class="text-3xl font-bold text-text-heading">
      {{ t('forum.post.title') }}
    </h1>
  </div>
</template>
