<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

import { useTopicPosts } from '@/composables/useTopicPosts'

import TopicHeader from '@/components/forum/topic/TopicHeader.vue'
import PostCard from '@/components/forum/post/PostCard.vue'
import TopicReplyForm from '@/components/forum/post/TopicReplyForm.vue'
import ForumLoading from '@/components/forum/ForumLoading.vue'
import ForumError from '@/components/forum/ForumError.vue'
import { getAuth } from '@/utils/authUtils'
import type { ApiTopic } from '@/types/forum.types'
import forumApi from '@/services/forumApi'

const { t } = useI18n()
const route = useRoute()
const topicId = route.params.id as string
const topicMetadata = ref<ApiTopic | null>(null)

const { posts, isLoading, isLoadingMore, error, nextCursor, fetchPosts, refreshPosts } =
  useTopicPosts(topicId)

const fetchTopicMetadata = async () => {
  try {
    topicMetadata.value = await forumApi.getTopic(topicId)
  } catch (e) {
    console.error('Failed to load topic metadata', e)
  }
}

onMounted(() => {
  fetchPosts()
  fetchTopicMetadata()
})
const auth = getAuth()
</script>

<template>
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- 1. Header -->
    <TopicHeader />

    <!-- 2. UI States -->
    <ForumLoading v-if="isLoading" :text="t('forum.post.loading')" />

    <ForumError
      v-else-if="error"
      :error="error"
      :retry-text="t('forum.post.error.retry')"
      @retry="fetchPosts()"
    />

    <!-- 3. Posts Feed -->
    <div v-else class="space-y-6">
      <PostCard
        v-for="(post, index) in posts"
        :key="post.id"
        :post="post"
        :is-main-post="index === 0"
        :is-topic-author="posts[0]?.owner?.username === post.owner?.username"
        :current-user-id="auth?.userId"
        @post-edited="refreshPosts"
        @post-deleted="refreshPosts"
      />

      <!-- Load More Pagination -->
      <div v-if="nextCursor" class="flex justify-center py-4">
        <button
          @click="fetchPosts(nextCursor)"
          :disabled="isLoadingMore"
          class="bg-bg-surface border border-border-theme hover:bg-bg-surface-hover text-text-base font-medium py-2 px-6 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          <span
            v-if="isLoadingMore"
            class="h-4 w-4 rounded-full border-2 border-text-base border-t-transparent animate-spin"
          ></span>
          {{
            isLoadingMore ? t('forum.post.load_more.loading') : t('forum.post.load_more.default')
          }}
        </button>
      </div>

      <!-- 4. Reply Section -->
      <TopicReplyForm
        :topic-id="topicId"
        :is-locked="topicMetadata?.is_locked || false"
        @reply-posted="refreshPosts"
      />
    </div>
  </div>
</template>
