import { ref } from 'vue'
import { forumApi } from '@/services/forumApi'
import type { ApiCategoryResponse, ApiTopic } from '@/types/forum.types'
import { useI18n } from 'vue-i18n'

export function useCategoryTopics(categoryId: string) {
  const { t } = useI18n()

  const category = ref<ApiCategoryResponse | null>(null)
  const topics = ref<ApiTopic[]>([])
  const isLoading = ref(true)
  const isLoadingMore = ref(false)
  const error = ref<string | null>(null)
  const nextCursor = ref<number | undefined>(undefined)

  const fetchCategory = async () => {
    try {
      category.value = await forumApi.getCategory(categoryId)
    } catch (err) {
      console.error('Failed to load category details', err)
    }
  }

  const fetchTopics = async (cursor?: number) => {
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

  const refreshTopics = () => fetchTopics()

  return {
    category,
    topics,
    isLoading,
    isLoadingMore,
    error,
    nextCursor,
    fetchCategory,
    fetchTopics,
    refreshTopics,
  }
}
