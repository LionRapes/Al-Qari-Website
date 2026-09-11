<script setup lang="ts">
import { ref } from 'vue'
import type { ApiPost } from '@/types/forum.types'
import { formatDate, translateOrOriginal } from '@/utils/commonUtils'
import { useI18n } from 'vue-i18n'
import { renderMarkdown } from '@/utils/markdownUtils'
import { forumApi } from '@/services/forumApi'
import { isModerator } from '@/utils/authUtils'
import DeletePostModal from './DeletePostModal.vue'
import IconDelete from '@/components/icons/IconDelete.vue'
import IconEdit from '@/components/icons/IconEdit.vue'
import UserAvatar from '@/components/UserAvatar.vue'

const props = defineProps<{
  post: ApiPost
  isMainPost: boolean
  isTopicAuthor: boolean
  currentUserId?: string
}>()

const emit = defineEmits<{
  (e: 'post-edited'): void
  (e: 'post-deleted'): void
}>()

const { t, te } = useI18n()

// --- Edit State ---
const isEditing = ref(false)
const editContent = ref('')
const isSaving = ref(false)
const editError = ref<string | null>(null)
const isDeleteModalOpen = ref(false)

const startEditing = () => {
  editContent.value = props.post.content_markdown
  isEditing.value = true
  editError.value = null
}

const cancelEditing = () => {
  isEditing.value = false
}

const saveEdit = async () => {
  if (!editContent.value.trim() || editContent.value === props.post.content_markdown) {
    cancelEditing()
    return
  }

  isSaving.value = true
  editError.value = null

  try {
    await forumApi.editPost(props.post.id, { content: editContent.value })
    isEditing.value = false
    emit('post-edited')
  } catch (err) {
    editError.value = String(err) || t('forum.post.edit.error')
  } finally {
    isSaving.value = false
  }
}

const handleDeleted = () => {
  isDeleteModalOpen.value = false
  emit('post-deleted')
}
</script>

<template>
  <div
    class="rounded-xl overflow-hidden bg-bg-surface relative"
    :class="isMainPost ? 'border-2 border-primary shadow-lg mb-12' : 'border border-border-theme'"
  >
    <!-- Post Header -->
    <div
      class="px-6 py-3 border-b flex items-center justify-between"
      :class="
        isMainPost ? 'bg-bg-base border-primary/50' : 'bg-bg-surface-hover border-border-theme'
      "
    >
      <div class="flex items-center gap-3">
        <div
          v-if="post.owner"
          class="h-8 w-8 rounded-full bg-border-theme text-text-heading shrink-0"
          :class="isMainPost ? 'ring-2 ring-primary ring-offset-2 ring-offset-bg-base' : ''"
        >
          <UserAvatar :avatar-url="post.owner.avatar_url" :user-id="post.owner.id" />
        </div>

        <div class="flex items-center gap-2">
          <span class="font-semibold text-text-heading">
            {{ post.owner?.username || t('forum.post.unknown_user') }}
          </span>
          <span
            v-if="isTopicAuthor"
            class="bg-primary text-text-heading px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
          >
            {{ t('forum.post.author_badge') }}
          </span>
        </div>
      </div>

      <div class="flex items-center gap-4">
        <span class="text-xs text-text-muted font-medium">
          {{ formatDate(post.created_at, 'full') }}
          <span v-if="post.edited_at && post.edited_at !== post.created_at" class="italic ml-1">{{
            t('forum.post.edited')
          }}</span>
        </span>

        <!-- Action Buttons -->
        <div class="flex items-center gap-3">
          <!-- Edit Button (Owner only) -->
          <button
            v-if="currentUserId === post.owner?.id && !isEditing"
            @click="startEditing"
            class="text-xs font-semibold text-text-muted hover:text-primary transition-colors"
          >
            <IconEdit class="w-5 h-5" />
            <!-- {{ t('forum.post.edit.button', 'Edit') }} -->
          </button>

          <!-- Delete Button (Moderators only) -->
          <button
            v-if="isModerator() && !isMainPost"
            @click="isDeleteModalOpen = true"
            class="text-xs font-semibold text-text-red hover:opacity-80 transition-opacity"
          >
            <IconDelete class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>

    <!-- Post Body (View Mode) -->
    <div
      v-if="!isEditing"
      class="px-6 py-5 whitespace-pre-wrap leading-relaxed"
      :class="isMainPost ? 'markdown text-lg text-text-heading' : 'text-base text-text-base'"
      v-html="
        isMainPost
          ? renderMarkdown(translateOrOriginal(post.content_markdown, t, te))
          : post.content_markdown
      "
    ></div>

    <!-- Post Body (Edit Mode) -->
    <div v-else class="p-6 bg-bg-base">
      <div
        v-if="editError"
        class="mb-3 text-sm text-text-red bg-bg-surface p-3 rounded border border-border-theme"
      >
        {{ editError }}
      </div>

      <textarea
        v-model="editContent"
        rows="5"
        class="custom-scrollbar w-full bg-bg-surface border border-border-theme rounded-lg p-3 text-text-base focus:outline-none focus:border-primary transition-colors resize-y"
        :disabled="isSaving"
      ></textarea>

      <div class="flex justify-end gap-3 mt-4">
        <button
          @click="cancelEditing"
          :disabled="isSaving"
          class="px-4 py-1.5 rounded-lg text-sm font-medium text-text-base border border-border-theme hover:bg-bg-surface-hover transition-colors disabled:opacity-50"
        >
          {{ t('forum.post.edit.cancel', 'Cancel') }}
        </button>
        <button
          @click="saveEdit"
          :disabled="isSaving || !editContent.trim()"
          class="px-4 py-1.5 rounded-lg text-sm font-semibold bg-primary text-text-heading hover:opacity-90 border border-border-theme transition-opacity disabled:opacity-50 flex items-center gap-2"
        >
          <span
            v-if="isSaving"
            class="h-3 w-3 rounded-full border-2 border-text-heading border-t-transparent animate-spin"
          ></span>
          {{
            isSaving
              ? t('forum.post.edit.saving', 'Saving...')
              : t('forum.post.edit.save', 'Save Changes')
          }}
        </button>
      </div>
    </div>
    <DeletePostModal
      :is-open="isDeleteModalOpen"
      :post-id="post.id"
      @close="isDeleteModalOpen = false"
      @deleted="handleDeleted"
    />
  </div>
</template>

<style scoped>
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: var(--border-theme) transparent;
}
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: var(--border-theme);
  border-radius: 8px;
}
</style>
