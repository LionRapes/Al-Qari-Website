<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { forumApi } from '@/services/forumApi'
import type { ApiTopic } from '@/types/forum.types'
import { formatDate, translateOrOriginal } from '@/utils/commonUtils'
import { useI18n } from 'vue-i18n'

const { t, te } = useI18n()

const route = useRoute()
const categoryId = route.params.id as string

const topics = ref<ApiTopic[]>([])
const isLoading = ref(true)
const isLoadingMore = ref(false)
const error = ref<string | null>(null)
const nextCursor = ref<string | undefined>(undefined)

const fetchTopics = async (cursor?: string) => {
  try {
    if (!cursor) {
      isLoading.value = true
      error.value = null
    } else {
      isLoadingMore.value = true
    }

    const response = await forumApi.getTopics(categoryId, cursor)

    if (cursor) {
      topics.value.push(...response.items)
    } else {
      topics.value = response.items
    }

    nextCursor.value = response.next_cursor
  } catch (err) {
    error.value = String(err) || t('forum.topic.error.failed')
  } finally {
    isLoading.value = false
    isLoadingMore.value = false
  }
}

onMounted(() => {
  fetchTopics()
})
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header & Actions -->
    <div
      class="flex flex-col sm:flex-row sm:items-center justify-between mb-8 border-b border-border-theme pb-4 gap-4"
    >
      <div>
        <RouterLink
          to="/forum"
          class="text-sm font-medium text-text-muted hover:text-primary transition-colors mb-2 inline-block"
        >
          {{ t('forum.topic.back') }}
        </RouterLink>

        <h1 class="text-3xl font-bold text-text-heading">
          {{ t('forum.topic.title') }}
        </h1>
      </div>

      <button
        class="bg-primary text-text-heading hover:opacity-90 font-semibold py-2 px-4 rounded-lg transition-opacity whitespace-nowrap border border-border-theme"
      >
        {{ t('forum.topic.new_topic') }}
      </button>
    </div>

    <!-- Initial Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center py-16">
      <div class="animate-pulse flex flex-col items-center">
        <div
          class="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4"
        ></div>
        <span class="text-text-muted text-lg">
          {{ t('forum.topic.loading') }}
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
        @click="fetchTopics()"
        class="mt-4 text-text-blue hover:text-text-hover transition-colors text-sm font-medium"
      >
        {{ t('forum.topic.error.retry') }}
      </button>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="topics.length === 0"
      class="text-center py-16 bg-bg-surface rounded-xl border border-border-theme"
    >
      <p class="text-text-muted text-lg mb-4">
        {{ t('forum.topic.empty.title') }}
      </p>
      <button class="text-primary hover:text-text-heading font-medium transition-colors">
        {{ t('forum.topic.empty.cta') }}
      </button>
    </div>

    <!-- Topics List -->
    <div v-else class="space-y-4">
      <RouterLink
        v-for="topic in topics"
        :key="topic.id"
        :to="`/forum/topic/${topic.id}`"
        class="block bg-bg-surface border border-border-theme rounded-xl p-5 transition-colors duration-300 hover:bg-bg-surface-hover group"
      >
        <div class="flex items-start justify-between gap-4">
          <div class="grow min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <span
                v-if="topic.is_pinned"
                class="bg-primary text-bg-surface px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider"
              >
                {{ t('forum.topic.indicators.pinned') }}
              </span>

              <span
                v-if="topic.is_locked"
                class="bg-border-theme text-text-muted px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider"
              >
                {{ t('forum.topic.indicators.locked') }}
              </span>

              <h2
                class="text-xl font-semibold text-text-heading truncate group-hover:text-primary transition-colors"
              >
                {{ translateOrOriginal(topic.title, t, te) }}
              </h2>
            </div>

            <div class="flex items-center gap-2 text-sm text-text-muted mt-2">
              <span class="font-medium text-text-base">
                {{ topic.owner?.username || t('forum.topic.unknown_user') }}
              </span>
              <span>&bull;</span>
              <span>{{ formatDate(topic.created_at) }}</span>
            </div>
          </div>

          <div
            class="hidden sm:flex shrink-0 items-center text-text-muted group-hover:text-primary transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </RouterLink>

      <!-- Load More Pagination -->
      <div v-if="nextCursor" class="flex justify-center pt-8">
        <button
          @click="fetchTopics(nextCursor)"
          :disabled="isLoadingMore"
          class="bg-bg-surface border border-border-theme hover:bg-bg-surface-hover text-text-base font-medium py-2 px-6 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          <span
            v-if="isLoadingMore"
            class="h-4 w-4 rounded-full border-2 border-text-base border-t-transparent animate-spin"
          ></span>

          {{
            isLoadingMore ? t('forum.topic.load_more.loading') : t('forum.topic.load_more.default')
          }}
        </button>
      </div>
    </div>
  </div>
</template>
