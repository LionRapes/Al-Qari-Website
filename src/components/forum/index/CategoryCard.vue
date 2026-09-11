<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { translateOrOriginal } from '@/utils/commonUtils'
import type { ApiCategoryResponse } from '@/types/forum.types'

defineProps<{
  category: ApiCategoryResponse
}>()

const { t, te } = useI18n()
</script>

<template>
  <RouterLink
    :to="`/forum/category/${category.id}`"
    class="group flex flex-col h-full bg-bg-surface border border-border-theme rounded-xl p-6 transition-colors duration-300 hover:bg-bg-surface-hover"
  >
    <div class="grow">
      <h2
        class="text-xl font-semibold text-primary mb-3 group-hover:text-text-heading transition-colors"
      >
        {{ translateOrOriginal(category.title, t, te) }}
      </h2>
      <p class="text-text-muted text-sm line-clamp-3">
        {{ translateOrOriginal(category.description, t, te) }}
      </p>
    </div>

    <div class="mt-6 pt-4 border-t border-border-theme flex items-center justify-between">
      <span class="text-xs font-medium text-text-muted">
        {{ t('forum.view') }}
      </span>
    </div>
  </RouterLink>
</template>
