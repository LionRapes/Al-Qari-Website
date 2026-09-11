<script setup lang="ts">
import { ref, watch } from 'vue'
import { forumApi } from '@/services/forumApi'
import { useI18n } from 'vue-i18n'
import IconClose from '@/components/icons/IconClose.vue'

const props = defineProps<{
  isOpen: boolean
  postId: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'deleted'): void
}>()

const { t } = useI18n()
const reason = ref('')
const isSubmitting = ref(false)
const error = ref<string | null>(null)

watch(
  () => props.isOpen,
  (newVal) => {
    if (!newVal) {
      reason.value = ''
      error.value = null
    }
  },
)

const closeModal = () => {
  if (!isSubmitting.value) emit('close')
}

const submitDelete = async () => {
  if (!reason.value.trim()) {
    error.value = t('forum.post.delete.reason_required', 'A reason is required.')
    return
  }

  isSubmitting.value = true
  error.value = null

  try {
    await forumApi.deletePost(props.postId, reason.value.trim())
    emit('deleted')
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
          class="modal-dialog bg-bg-surface border border-border-theme rounded-xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden"
          role="dialog"
        >
          <!-- Header -->
          <div
            class="px-6 py-4 border-b border-border-theme flex items-center justify-between bg-bg-surface-gradient"
          >
            <h2 class="text-xl font-bold text-text-red">
              {{ t('forum.post.delete.title', 'Delete Post') }}
            </h2>
            <button
              @click="closeModal"
              :disabled="isSubmitting"
              class="text-text-muted hover:text-text-red transition-colors disabled:opacity-50"
            >
              <IconClose class="w-5 h-5" />
            </button>
          </div>

          <!-- Body -->
          <div class="p-6">
            <p class="text-text-base mb-4">
              {{
                t(
                  'forum.post.delete.warning',
                  'Are you sure you want to delete this post? Please provide a moderation reason.',
                )
              }}
            </p>

            <div
              v-if="error"
              class="mb-4 p-3 rounded bg-bg-base border-l-4 border-text-red text-text-red text-sm font-medium"
            >
              {{ error }}
            </div>

            <textarea
              v-model="reason"
              rows="3"
              :placeholder="
                t('forum.post.delete.reason_placeholder', 'Enter reason for deletion...')
              "
              class="custom-scrollbar w-full bg-bg-base border border-border-theme rounded-lg p-3 text-text-base focus:outline-none focus:border-text-red transition-colors resize-y"
              :disabled="isSubmitting"
              required
            ></textarea>
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
              {{ t('forum.post.delete.cancel', 'Cancel') }}
            </button>
            <button
              @click="submitDelete"
              :disabled="isSubmitting || !reason.trim()"
              class="px-6 py-2 rounded-lg font-semibold bg-text-red text-white hover:opacity-90 border border-text-red transition-opacity flex items-center gap-2 disabled:opacity-50"
            >
              <span
                v-if="isSubmitting"
                class="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"
              ></span>
              {{
                isSubmitting
                  ? t('forum.post.delete.deleting', 'Deleting...')
                  : t('forum.post.delete.confirm', 'Delete Post')
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
  transition: opacity 0.3s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-active .modal-dialog,
.modal-leave-active .modal-dialog {
  transition:
    transform 0.3s ease-out,
    opacity 0.3s ease-out;
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
</style>
