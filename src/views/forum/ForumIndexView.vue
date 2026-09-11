<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { forumApi } from '@/services/forumApi'
import type { ApiCategoryResponse } from '@/types/forum.types'
import { useI18n } from 'vue-i18n'

import CategoryCard from '@/components/forum/index/CategoryCard.vue'
import ForumLoading from '@/components/forum/ForumLoading.vue'
import ForumError from '@/components/forum/ForumError.vue'
import ForumEmpty from '@/components/forum/ForumEmpty.vue'

const { t } = useI18n()

const categories = ref<ApiCategoryResponse[]>([])
const isLoading = ref(true)
const error = ref<string | null>(null)

const fetchCategories = async () => {
  try {
    isLoading.value = true
    error.value = null
    categories.value = await forumApi.getCategories()
  } catch {
    error.value = t('forum.error.failed')
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchCategories()
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

    <!-- Reusable UI States -->
    <ForumLoading v-if="isLoading" :text="t('forum.loading')" />

    <ForumError
      v-else-if="error"
      :error="error"
      :retry-text="t('forum.error.retry')"
      @retry="fetchCategories"
    />

    <ForumEmpty v-else-if="categories.length === 0" :text="t('forum.empty')" />

    <!-- Categories Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <CategoryCard v-for="category in categories" :key="category.id" :category="category" />
    </div>
  </div>
</template>
