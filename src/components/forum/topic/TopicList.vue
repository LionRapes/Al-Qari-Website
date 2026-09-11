<script setup lang="ts">
import type { ApiTopic } from '@/types/forum.types'
import { useI18n } from 'vue-i18n'
import TopicCard from '@/components/forum/topic/TopicCard.vue'

const { t } = useI18n()

defineProps<{
  topics: ApiTopic[]
  nextCursor?: number
  isLoadingMore: boolean
}>()

defineEmits<{
  (e: 'load-more', cursor: number): void
  (e: 'topic-moderated'): void
}>()
</script>

<template>
  <div class="space-y-4">
    <TopicCard
      v-for="topic in topics"
      :key="topic.id"
      :topic="topic"
      @topic-moderated="$emit('topic-moderated')"
    />

    <!-- Load More Pagination -->
    <div v-if="nextCursor" class="flex justify-center pt-8">
      <button
        @click="$emit('load-more', nextCursor)"
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
</template>
