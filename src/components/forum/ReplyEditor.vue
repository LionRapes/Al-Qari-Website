<script setup lang="ts">
import { renderMarkdown } from '@/utils/markdownUtils'
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps<{
  isSubmitting?: boolean
  error?: string | null
  placeholder?: string
  buttonText?: string
  initialContent?: string
}>()

const emit = defineEmits<{
  (e: 'submit', content: string): void
}>()

const content = ref(props.initialContent || '')
const isPreviewMode = ref(false)

const renderedPreview = computed(() => renderMarkdown(content.value))

const handleSubmit = () => {
  if (!content.value.trim() || props.isSubmitting) return
  emit('submit', content.value.trim())
}

// Expose a method so the parent view can clear the editor after a successful post
const clear = () => {
  content.value = ''
  isPreviewMode.value = false
}

defineExpose({ clear })
</script>

<template>
  <div class="reply-editor w-full">
    <!-- Optional Error Alert -->
    <div
      v-if="error"
      class="mb-4 text-sm text-text-red bg-bg-surface p-3 rounded border border-border-theme"
    >
      {{ error }}
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div
        class="border border-border-theme rounded-lg bg-bg-surface overflow-hidden focus-within:border-primary transition-colors flex flex-col"
      >
        <!-- Editor Header / Tabs -->
        <div
          class="flex items-center justify-between bg-bg-surface-hover px-4 py-3 border-b border-border-theme"
        >
          <span class="text-sm font-semibold text-text-heading">
            {{ t('forum.post.reply.markdown_supported', 'Markdown Supported') }}
          </span>

          <div class="flex bg-bg-base rounded-lg border border-border-theme p-0.5">
            <button
              type="button"
              @click="isPreviewMode = false"
              :class="
                !isPreviewMode
                  ? 'bg-bg-surface shadow-sm text-text-heading'
                  : 'text-text-muted hover:text-text-base'
              "
              class="px-3 py-1 text-xs font-medium rounded-md transition-colors"
            >
              {{ t('forum.post.reply.edit', 'Edit') }}
            </button>
            <button
              type="button"
              @click="isPreviewMode = true"
              :disabled="!content.trim()"
              :class="
                isPreviewMode
                  ? 'bg-bg-surface shadow-sm text-text-heading'
                  : 'text-text-muted hover:text-text-base disabled:opacity-50'
              "
              class="px-3 py-1 text-xs font-medium rounded-md transition-colors"
            >
              {{ t('forum.post.reply.preview', 'Preview') }}
            </button>
          </div>
        </div>

        <!-- Editor Body -->
        <div class="p-2 bg-bg-base grow flex flex-col">
          <textarea
            v-if="!isPreviewMode"
            v-model="content"
            rows="5"
            :placeholder="
              placeholder || t('forum.post.reply.placeholder', 'Type your reply here...')
            "
            class="custom-scrollbar w-full bg-transparent p-2 text-text-base placeholder-text-muted focus:outline-none resize-y min-h-[120px]"
            :disabled="isSubmitting"
          ></textarea>

          <div
            v-else
            class="custom-scrollbar w-full bg-transparent p-2 text-text-base overflow-y-auto min-h-[120px] prose prose-invert max-w-none"
            v-html="renderedPreview"
          ></div>
        </div>
      </div>

      <!-- Footer / Submit -->
      <div class="flex justify-end">
        <button
          type="submit"
          :disabled="isSubmitting || !content.trim()"
          class="bg-primary text-text-heading hover:opacity-90 font-semibold py-2 px-6 rounded-lg transition-opacity disabled:opacity-50 flex items-center gap-2 border border-border-theme"
        >
          <span
            v-if="isSubmitting"
            class="h-4 w-4 rounded-full border-2 border-text-heading border-t-transparent animate-spin"
          ></span>
          {{
            isSubmitting
              ? t('forum.post.reply.submit.loading', 'Posting...')
              : buttonText || t('forum.post.reply.submit.default', 'Post Reply')
          }}
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
/* Custom Scrollbar specifically for the editor text areas */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: var(--border-theme) transparent;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 8px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: var(--border-theme);
  border-radius: 8px;
  transition: background-color 0.3s ease;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: var(--text-muted);
}
</style>
