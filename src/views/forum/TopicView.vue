<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { forumApi } from '@/services/forumApi'
import type { ApiPost } from '@/types/forum.types'
import { formatDate, translateOrOriginal } from '@/utils/commonUtils'
import { useI18n } from 'vue-i18n'
import IconUser from '@/components/icons/IconUser.vue'

const { t, te } = useI18n()

const route = useRoute()
const topicId = route.params.id as string

const posts = ref<ApiPost[]>([])
const isLoading = ref(true)
const isLoadingMore = ref(false)
const error = ref<string | null>(null)
const nextCursor = ref<string | undefined>(undefined)

const replyContent = ref('')
const isSubmitting = ref(false)
const replyError = ref<string | null>(null)

const fetchPosts = async (cursor?: string) => {
  try {
    if (!cursor) {
      isLoading.value = true
      error.value = null
    } else {
      isLoadingMore.value = true
    }

    const response = await forumApi.getPosts(topicId, cursor)

    if (cursor) {
      posts.value.push(...response.items)
    } else {
      posts.value = response.items
    }

    nextCursor.value = response.next_cursor
  } catch (err) {
    error.value = String(err) || t('forum.post.error.failed')
  } finally {
    isLoading.value = false
    isLoadingMore.value = false
  }
}

const submitReply = async () => {
  if (!replyContent.value.trim()) return

  isSubmitting.value = true
  replyError.value = null

  try {
    await forumApi.createPost(topicId, { content: replyContent.value })
    replyContent.value = ''
    await fetchPosts()
  } catch (err) {
    replyError.value = String(err) || t('forum.post.reply.error')
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  fetchPosts()
})
</script>

<template>
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Navigation / Header -->
    <div class="mb-8 border-b border-border-theme pb-4">
      <button
        @click="$router.back()"
        class="text-sm font-medium text-text-muted hover:text-primary transition-colors mb-2 inline-block"
      >
        {{ t('forum.post.back') }}
      </button>

      <h1 class="text-3xl font-bold text-text-heading">
        {{ t('forum.post.title') }}
      </h1>
    </div>

    <!-- Initial Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center py-16">
      <div class="animate-pulse flex flex-col items-center">
        <div
          class="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4"
        ></div>
        <span class="text-text-muted text-lg">
          {{ t('forum.post.loading') }}
        </span>
      </div>
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="bg-bg-surface border-l-4 border-text-red p-6 rounded-r-lg shadow-sm mb-6"
    >
      <div class="flex items-center">
        <span class="text-text-red font-semibold text-lg">{{ error }}</span>
      </div>
      <button
        @click="fetchPosts()"
        class="mt-4 text-text-blue hover:text-text-hover transition-colors text-sm font-medium"
      >
        {{ t('forum.post.error.retry') }}
      </button>
    </div>

    <!-- Posts Feed -->
    <div v-else class="space-y-6">
      <div
        v-for="post in posts"
        :key="post.id"
        class="bg-bg-surface border border-border-theme rounded-xl overflow-hidden"
      >
        <!-- Post Header -->
        <div
          class="bg-bg-surface-hover px-6 py-3 border-b border-border-theme flex items-center justify-between"
        >
          <div class="flex items-center gap-3">
            <div
              class="h-8 w-8 rounded-full bg-border-theme flex items-center justify-center text-text-heading font-bold text-sm overflow-hidden shrink-0"
            >
              <img
                v-if="post.owner?.avatar_url"
                :src="post.owner?.avatar_url"
                class="w-full h-full object-cover"
              />
              <IconUser v-else class="w-6 h-6 text-primary" />
            </div>

            <span class="font-semibold text-text-heading">
              {{ post.owner?.username || t('forum.post.unknown_user') }}
            </span>
          </div>

          <span class="text-xs text-text-muted font-medium">
            {{ formatDate(post.created_at, 'full') }}
          </span>
        </div>

        <!-- Post Body -->
        <div class="px-6 py-5 text-text-base whitespace-pre-wrap leading-relaxed">
          {{ translateOrOriginal(post.content, t, te) }}
        </div>
      </div>

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

      <!-- Reply Section -->
      <div class="mt-10 pt-6 border-t border-border-theme">
        <h3 class="text-xl font-bold text-text-heading mb-4">
          {{ t('forum.post.reply.title') }}
        </h3>

        <div
          v-if="replyError"
          class="mb-4 text-sm text-text-red bg-bg-surface p-3 rounded border border-border-theme"
        >
          {{ replyError }}
        </div>

        <form @submit.prevent="submitReply" class="space-y-4">
          <textarea
            v-model="replyContent"
            rows="5"
            :placeholder="t('forum.post.reply.placeholder')"
            class="w-full bg-bg-surface border border-border-theme rounded-lg p-4 text-text-base focus:outline-none focus:border-primary transition-colors resize-y"
            :disabled="isSubmitting"
          ></textarea>

          <div class="flex justify-end">
            <button
              type="submit"
              :disabled="isSubmitting || !replyContent.trim()"
              class="bg-primary text-text-heading hover:opacity-90 font-semibold py-2 px-6 rounded-lg transition-opacity disabled:opacity-50 flex items-center gap-2 border border-border-theme"
            >
              <span
                v-if="isSubmitting"
                class="h-4 w-4 rounded-full border-2 border-text-heading border-t-transparent animate-spin"
              ></span>

              {{
                isSubmitting
                  ? t('forum.post.reply.submit.loading')
                  : t('forum.post.reply.submit.default')
              }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
