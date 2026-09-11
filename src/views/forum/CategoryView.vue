<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

import { useCategoryTopics } from '@/composables/useCategoryTopics'

import CategoryHeader from '@/components/forum/CategoryHeader.vue'
import TopicList from '@/components/forum/topic/TopicList.vue'
import CreateTopicModal from '@/components/forum/topic/CreateTopicModal.vue'
import ForumLoading from '@/components/forum/ForumLoading.vue'
import ForumError from '@/components/forum/ForumError.vue'
import ForumEmpty from '@/components/forum/ForumEmpty.vue'
import { isModerator } from '@/utils/authUtils'

const { t } = useI18n()
const route = useRoute()
const categoryId = route.params.id as string

const {
  category,
  topics,
  isLoading,
  isLoadingMore,
  error,
  nextCursor,
  fetchTopics,
  fetchCategory,
  refreshTopics,
} = useCategoryTopics(categoryId)

const isCreateModalOpen = ref(false)

const handleTopicCreated = () => {
  isCreateModalOpen.value = false
  refreshTopics()
}

onMounted(() => {
  fetchCategory()
  fetchTopics()
})
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <CategoryHeader
      v-if="category"
      :show-create-button="!category.is_restricted || isModerator()"
      @open-create-modal="isCreateModalOpen = true"
    />

    <!-- Reusable UI States -->
    <ForumLoading v-if="isLoading" :text="t('forum.topic.loading')" />

    <ForumError
      v-else-if="error"
      :error="error"
      :retry-text="t('forum.topic.error.retry')"
      @retry="fetchTopics()"
    />

    <ForumEmpty v-else-if="topics.length === 0" :text="t('forum.topic.empty.title')">
      <button
        v-if="!category?.is_restricted || isModerator()"
        @click="isCreateModalOpen = true"
        class="text-primary hover:text-text-heading font-medium transition-colors mt-2"
      >
        {{ t('forum.topic.empty.cta') }}
      </button>
    </ForumEmpty>

    <!-- Topics List -->
    <TopicList
      v-else
      @topic-moderated="refreshTopics"
      :topics="topics"
      :next-cursor="nextCursor"
      :is-loading-more="isLoadingMore"
      @load-more="fetchTopics"
    />

    <!-- Modals -->
    <CreateTopicModal
      :is-open="isCreateModalOpen"
      :category-id="categoryId"
      @close="isCreateModalOpen = false"
      @topic-created="handleTopicCreated"
    />
  </div>
</template>
