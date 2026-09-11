<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { forumApi } from '@/services/forumApi'
import IconLock from '@/components/icons/IconLock.vue'

const props = defineProps<{
  topicId: string
  isLocked?: boolean
}>()

const emit = defineEmits<{ (e: 'reply-posted'): void }>()

const { t } = useI18n()
const replyContent = ref('')
const isSubmitting = ref(false)
const replyError = ref<string | null>(null)

const submitReply = async () => {
  if (props.isLocked || !replyContent.value.trim()) return

  isSubmitting.value = true
  replyError.value = null

  try {
    await forumApi.createPost(props.topicId, { content: replyContent.value })
    replyContent.value = ''
    emit('reply-posted')
  } catch (err) {
    replyError.value = String(err) || t('forum.post.reply.error', 'Failed to post reply')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="mt-10 pt-6 border-t border-border-theme">
    <h3 class="text-xl font-bold text-text-heading mb-4">
      {{ t('forum.post.reply.title', 'Leave a Reply') }}
    </h3>

    <!-- 1. Blocked State (Shows when isLocked is true) -->
    <div
      v-if="isLocked"
      class="bg-bg-surface border border-border-theme rounded-xl p-8 text-center flex flex-col items-center justify-center"
    >
      <IconLock class="mb-3" />
      <h4 class="text-lg font-bold text-text-heading">
        {{ t('forum.topic.locked_title', 'This topic is locked') }}
      </h4>
      <p class="text-text-muted mt-1">
        {{ t('forum.topic.locked_desc', 'You cannot post new replies to this discussion.') }}
      </p>
    </div>

    <!-- 2. Active Form (Shows when isLocked is false) -->
    <div v-else>
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
          :placeholder="t('forum.post.reply.placeholder', 'Write your reply here...')"
          class="custom-scrollbar w-full bg-bg-surface border border-border-theme rounded-lg p-4 text-text-base focus:outline-none focus:border-primary transition-colors resize-y"
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
                ? t('forum.post.reply.submit.loading', 'Posting...')
                : t('forum.post.reply.submit.default', 'Post Reply')
            }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
