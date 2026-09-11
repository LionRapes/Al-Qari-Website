<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import type { ApiTopic } from '@/types/forum.types'
import { formatDate, translateOrOriginal } from '@/utils/commonUtils'
import { isModerator } from '@/utils/authUtils'
import ModerateTopicModal from '@/components/forum/topic/ModerateTopicModal.vue'
defineProps<{
  topic: ApiTopic
}>()

const emit = defineEmits<{
  (e: 'topic-moderated'): void
}>()

const { t, te } = useI18n()
const isModModalOpen = ref(false)

const handleModerated = () => {
  isModModalOpen.value = false
  emit('topic-moderated')
}
</script>

<template>
  <RouterLink
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
      <div class="hidden sm:flex shrink-0 items-center gap-4">
        <!-- Moderator Button -->
        <button
          v-if="isModerator()"
          @click.prevent="isModModalOpen = true"
          class="text-xs font-semibold text-text-muted hover:text-primary transition-colors border border-border-theme bg-bg-base px-3 py-1 rounded"
        >
          {{ t('forum.topic.moderate.button', 'Moderate') }}
        </button>
      </div>
    </div>
    <ModerateTopicModal
      :is-open="isModModalOpen"
      :topic="topic"
      @close="isModModalOpen = false"
      @moderated="handleModerated"
    />
  </RouterLink>
</template>
