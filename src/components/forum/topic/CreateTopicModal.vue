<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { forumApi } from '@/services/forumApi'
import { renderMarkdown } from '@/utils/markdownUtils'
import { useI18n } from 'vue-i18n'
import IconClose from '@/components/icons/IconClose.vue'

const { t } = useI18n()

const props = defineProps<{
  isOpen: boolean
  categoryId: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'topic-created'): void
}>()

const title = ref('')
const content = ref('')
const isSubmitting = ref(false)
const error = ref<string | null>(null)

watch(
  () => props.isOpen,
  (newVal) => {
    if (!newVal) {
      title.value = ''
      content.value = ''
      error.value = null
      isPreviewMode.value = false
    }
  },
)

const isPreviewMode = ref(false)
const renderedPreview = computed(() => renderMarkdown(content.value))

const closeModal = () => {
  if (!isSubmitting.value) emit('close')
}

const submitTopic = async () => {
  const trimmedTitle = title.value.trim()
  const trimmedContent = content.value.trim()

  if (!trimmedTitle || !trimmedContent) {
    error.value = t('forum.topic.create.error_required')
    return
  }

  if (trimmedTitle.length < 3) {
    error.value = t('forum.topic.create.error_title_length')
    return
  }

  if (trimmedContent.length < 10) {
    error.value = t('forum.topic.create.error_content_length')
    return
  }

  isSubmitting.value = true
  error.value = null

  try {
    await forumApi.createTopic(props.categoryId, {
      title: trimmedTitle,
      content: trimmedContent,
    })
    emit('topic-created')
    emit('close')
  } catch (err) {
    error.value = String(err)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-border-theme/40 backdrop-blur-sm transition-opacity"
        @click.self="closeModal"
      >
        <div
          class="modal-dialog bg-bg-surface border border-border-theme rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
          role="dialog"
        >
          <!-- Header -->
          <div
            class="px-6 py-4 border-b border-border-theme flex items-center justify-between bg-bg-surface-gradient"
          >
            <h2 class="text-xl font-bold text-text-heading">
              {{ t('forum.topic.create.title') }}
            </h2>

            <button
              @click="closeModal"
              :disabled="isSubmitting"
              class="text-text-muted hover:text-text-red transition-colors disabled:opacity-50"
            >
              <IconClose class="w-6 h-6" />
            </button>
          </div>

          <!-- Body -->
          <div class="p-6 overflow-y-auto grow custom-scrollbar">
            <div
              v-if="error"
              class="mb-6 p-4 rounded-lg bg-bg-base border-l-4 border-text-red text-text-red text-sm font-medium"
            >
              {{ error }}
            </div>

            <form @submit.prevent="submitTopic" class="space-y-5">
              <!-- Title -->
              <div>
                <label class="block text-sm font-semibold text-text-heading mb-2">
                  {{ t('forum.topic.create.input_title_label') }}
                </label>

                <input
                  v-model="title"
                  type="text"
                  :placeholder="t('forum.topic.create.input_title_placeholder')"
                  class="w-full bg-bg-base border border-border-theme rounded-lg p-3 text-text-heading placeholder-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  :disabled="isSubmitting"
                />
              </div>

              <!-- Content -->
              <div>
                <div class="flex items-center justify-between mb-2">
                  <label class="block text-sm font-semibold text-text-heading">
                    {{ t('forum.topic.create.input_content_label') }}
                  </label>

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
                      {{ t('forum.topic.create.tab_edit') }}
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
                      {{ t('forum.topic.create.tab_preview') }}
                    </button>
                  </div>
                </div>

                <!-- Edit -->
                <textarea
                  v-if="!isPreviewMode"
                  v-model="content"
                  rows="8"
                  :placeholder="t('forum.topic.create.input_content_placeholder')"
                  class="custom-scrollbar w-full bg-bg-base border border-border-theme rounded-lg p-3 text-text-base placeholder-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-y min-h-37.5"
                  :disabled="isSubmitting"
                ></textarea>

                <!-- Preview -->
                <div
                  v-else
                  class="markdown custom-scrollbar w-full bg-bg-base border border-border-theme rounded-lg p-3 text-text-base overflow-y-auto min-h-37.5 prose prose-invert max-w-none"
                  v-html="renderedPreview"
                ></div>
              </div>
            </form>
          </div>

          <!-- Footer -->
          <div
            class="px-6 py-4 border-t border-border-theme bg-bg-surface-hover flex justify-end gap-3"
          >
            <button
              @click="closeModal"
              :disabled="isSubmitting"
              class="px-5 py-2 rounded-lg font-medium text-text-base border border-border-theme hover:bg-bg-surface transition-colors disabled:opacity-50"
            >
              {{ t('forum.topic.create.cancel') }}
            </button>

            <button
              @click="submitTopic"
              :disabled="isSubmitting || title.trim().length < 3 || content.trim().length < 10"
              class="px-6 py-2 rounded-lg font-semibold bg-primary text-text-heading hover:opacity-90 border border-border-theme transition-opacity flex items-center gap-2 disabled:opacity-50"
            >
              <span
                v-if="isSubmitting"
                class="h-4 w-4 rounded-full border-2 border-text-heading border-t-transparent animate-spin"
              ></span>

              {{
                isSubmitting
                  ? t('forum.topic.create.submit_loading')
                  : t('forum.topic.create.submit_default')
              }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.5s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-dialog,
.modal-leave-active .modal-dialog {
  transition:
    transform 0.5s ease-out,
    opacity 0.5s ease-out;
}

.modal-enter-from .modal-dialog,
.modal-leave-to .modal-dialog {
  opacity: 0;
  transform: translateY(20px) scale(0.98);
}

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
