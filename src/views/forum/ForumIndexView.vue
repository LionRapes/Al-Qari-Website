<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { forumApi } from '@/services/forumApi'
import type { ApiCategoryResponse } from '@/types/forum.types'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { translateOrOriginal } from '@/utils/commonUtils'

const { t, te } = useI18n()

const categories = ref<ApiCategoryResponse[]>([])
const isLoading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    isLoading.value = true
    error.value = null
    categories.value = await forumApi.getCategories()
  } catch {
    error.value = t('forum.error.failed')
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="mb-8 border-b border-border-theme pb-4">
      <h1 class="text-3xl font-bold text-text-heading">
        {{ t('forum.header.title') }}
      </h1>
      <p class="text-text-muted mt-2">
        {{ t('forum.header.subtitle') }}
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center py-16">
      <div class="animate-pulse flex flex-col items-center">
        <div
          class="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4"
        ></div>
        <span class="text-text-muted text-lg">
          {{ t('forum.loading') }}
        </span>
      </div>
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="bg-bg-surface border-l-4 border-text-red p-6 rounded-r-lg shadow-sm"
    >
      <div class="flex items-center">
        <span class="text-text-red font-semibold text-lg">{{ error }}</span>
      </div>
      <button
        @click="forumApi.getCategories()"
        class="mt-4 text-text-blue hover:text-text-hover transition-colors text-sm font-medium"
      >
        {{ t('forum.error.retry') }}
      </button>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="categories.length === 0"
      class="text-center py-16 bg-bg-surface rounded-xl border border-border-theme"
    >
      <p class="text-text-muted text-lg">
        {{ t('forum.empty') }}
      </p>
    </div>

    <!-- Categories Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <RouterLink
        :key="category.id"
        :to="`/forum/category/${category.id}`"
        class="group flex flex-col h-full bg-bg-surface border border-border-theme rounded-xl p-6 transition-colors duration-300 hover:bg-bg-surface-hover"
        v-for="category in categories"
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
    </div>
  </div>
</template>
