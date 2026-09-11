import { ref } from 'vue'
import { forumApi } from '@/services/forumApi'
import type { ApiPost } from '@/types/forum.types'
import { useI18n } from 'vue-i18n'

export function useTopicPosts(topicId: string) {
  const { t } = useI18n()

  const posts = ref<ApiPost[]>([])
  const isLoading = ref(true)
  const isLoadingMore = ref(false)
  const error = ref<string | null>(null)
  const nextCursor = ref<string | undefined>(undefined)

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

  const refreshPosts = () => fetchPosts()

  return {
    posts,
    isLoading,
    isLoadingMore,
    error,
    nextCursor,
    fetchPosts,
    refreshPosts,
  }
}
