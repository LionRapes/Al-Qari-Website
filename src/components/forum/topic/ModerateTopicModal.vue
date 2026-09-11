<script setup lang="ts">
import { ref, watch } from 'vue'
import { forumApi } from '@/services/forumApi'
import type { ApiTopic } from '@/types/forum.types'
import { useI18n } from 'vue-i18n'
import IconClose from '@/components/icons/IconClose.vue'

const props = defineProps<{
  isOpen: boolean
  topic: ApiTopic
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'moderated'): void
  (e: 'deleted'): void
}>()

const { t } = useI18n()

// Standard Moderation State
const isPinned = ref(props.topic.is_pinned)
const isLocked = ref(props.topic.is_locked)
const isSubmitting = ref(false)
const error = ref<string | null>(null)

// Deletion State
const isConfirmingDelete = ref(false)
const deleteReason = ref('')

// Sync local state when modal opens
watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal) {
      isPinned.value = props.topic.is_pinned
      isLocked.value = props.topic.is_locked
      isConfirmingDelete.value = false
      deleteReason.value = ''
      error.value = null
    }
  },
)

const closeModal = () => {
  if (!isSubmitting.value) emit('close')
}

const submitModeration = async () => {
  isSubmitting.value = true
  error.value = null

  try {
    await forumApi.moderateTopic(props.topic.id, {
      is_pinned: isPinned.value,
      is_locked: isLocked.value,
    })
    emit('moderated')
    emit('close')
  } catch (err) {
    error.value = String(err)
  } finally {
    isSubmitting.value = false
  }
}

const submitDelete = async () => {
  if (!deleteReason.value.trim()) {
    error.value = t('forum.topic.delete.reason_required', 'A reason is required to delete.')
    return
  }

  isSubmitting.value = true
  error.value = null

  try {
    await forumApi.deleteTopic(props.topic.id, deleteReason.value.trim())
    emit('moderated')
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
          class="modal-dialog bg-bg-surface border border-border-theme rounded-xl shadow-2xl w-full max-w-sm flex flex-col overflow-hidden"
          role="dialog"
        >
          <div
            class="px-6 py-4 border-b border-border-theme flex items-center justify-between bg-bg-surface-gradient"
          >
            <h2
              class="text-xl font-bold"
              :class="isConfirmingDelete ? 'text-text-red' : 'text-text-heading'"
            >
              {{
                isConfirmingDelete
                  ? t('forum.topic.delete.title', 'Delete Topic')
                  : t('forum.topic.moderate.title', 'Moderate Topic')
              }}
            </h2>
            <button
              @click="closeModal"
              :disabled="isSubmitting"
              class="text-text-muted hover:text-text-red transition-colors"
            >
              <IconClose class="w-5 h-5" />
            </button>
          </div>

          <div class="p-6 space-y-4">
            <div
              v-if="error"
              class="p-3 rounded bg-bg-base border-l-4 border-text-red text-text-red text-sm font-medium"
            >
              {{ error }}
            </div>

            <!-- View 1: Standard Moderation (Pin/Lock) -->
            <div v-if="!isConfirmingDelete" class="space-y-4">
              <label class="flex items-center justify-between cursor-pointer">
                <span class="text-text-base font-medium">{{
                  t('forum.topic.moderate.pin', 'Pin Topic')
                }}</span>
                <input
                  type="checkbox"
                  v-model="isPinned"
                  :disabled="isSubmitting"
                  class="w-5 h-5 accent-primary bg-bg-base border-border-theme rounded"
                />
              </label>

              <label class="flex items-center justify-between cursor-pointer">
                <span class="text-text-base font-medium">{{
                  t('forum.topic.moderate.lock', 'Lock Topic')
                }}</span>
                <input
                  type="checkbox"
                  v-model="isLocked"
                  :disabled="isSubmitting"
                  class="w-5 h-5 accent-primary bg-bg-base border-border-theme rounded"
                />
              </label>
            </div>

            <!-- View 2: Deletion Confirmation & Reason -->
            <div v-else class="space-y-3">
              <p class="text-text-base text-sm font-medium">
                {{
                  t(
                    'forum.topic.delete.warning',
                    'Are you sure? Provide a moderation reason below:',
                  )
                }}
              </p>
              <textarea
                v-model="deleteReason"
                rows="3"
                :placeholder="
                  t('forum.topic.delete.reason_placeholder', 'Enter deletion reason...')
                "
                class="custom-scrollbar w-full bg-bg-base border border-border-theme rounded-lg p-3 text-text-base focus:outline-none focus:border-text-red transition-colors resize-y"
                :disabled="isSubmitting"
                required
              ></textarea>
            </div>
          </div>

          <!-- Footer 1: Standard Moderation Actions -->
          <div
            v-if="!isConfirmingDelete"
            class="px-6 py-4 border-t border-border-theme bg-bg-surface-hover flex items-center justify-between"
          >
            <button
              @click="isConfirmingDelete = true"
              :disabled="isSubmitting"
              class="text-sm font-semibold text-text-red hover:opacity-80 transition-opacity disabled:opacity-50"
            >
              {{ t('forum.topic.delete.button', 'Delete Topic') }}
            </button>
            <div class="flex gap-3">
              <button
                @click="closeModal"
                :disabled="isSubmitting"
                class="px-4 py-2 rounded-lg font-medium text-text-base border border-border-theme hover:bg-bg-surface transition-colors disabled:opacity-50"
              >
                {{ t('forum.topic.moderate.cancel', 'Cancel') }}
              </button>
              <button
                @click="submitModeration"
                :disabled="isSubmitting"
                class="px-5 py-2 rounded-lg font-semibold bg-primary text-text-heading hover:opacity-90 border border-border-theme transition-opacity disabled:opacity-50"
              >
                {{
                  isSubmitting
                    ? t('forum.topic.moderate.saving', 'Saving...')
                    : t('forum.topic.moderate.save', 'Save')
                }}
              </button>
            </div>
          </div>

          <!-- Footer 2: Deletion Actions -->
          <div
            v-else
            class="px-6 py-4 border-t border-border-theme bg-bg-surface-hover flex justify-end gap-3"
          >
            <button
              @click="((isConfirmingDelete = false), (error = null))"
              :disabled="isSubmitting"
              class="px-5 py-2 rounded-lg font-medium text-text-base border border-border-theme hover:bg-bg-surface transition-colors disabled:opacity-50"
            >
              {{ t('forum.topic.moderate.cancel', 'Cancel') }}
            </button>
            <button
              @click="submitDelete"
              :disabled="isSubmitting || !deleteReason.trim()"
              class="px-5 py-2 rounded-lg font-semibold bg-bg-surface border border-text-red text-text-red hover:bg-bg-surface-hover transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <span
                v-if="isSubmitting"
                class="h-4 w-4 rounded-full border-2 border-text-red border-t-transparent animate-spin"
              ></span>
              {{
                isSubmitting
                  ? t('forum.topic.delete.deleting', 'Deleting...')
                  : t('forum.topic.delete.confirm', 'Confirm Delete')
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
