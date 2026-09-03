<script setup lang="ts">
import { ref } from 'vue'
import ProfileAvatar from '@/components/profile/ProfileAvatar.vue'
import ProfileNicknameEditor from '@/components/profile/ProfileNicknameEditor.vue'
import type { ApiUserProfile } from '@/types/user.types'

defineProps<{
  user: ApiUserProfile
  avatarLetter: string
  isUploadingAvatar: boolean
  isSaving: boolean
  apiError: string
}>()

const emit = defineEmits<{
  (e: 'file-selected', file: File): void
  (e: 'save-nickname', nickname: string, closeEditor: () => void): void
}>()

const editorRef = ref<InstanceType<typeof ProfileNicknameEditor> | null>(null)

const handleSave = (nickname: string) => {
  emit('save-nickname', nickname, () => editorRef.value?.closeEditor())
}
</script>

<template>
  <div
    class="bg-bg-surface border border-border-theme rounded-3xl p-6 lg:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 shadow-sm"
  >
    <ProfileAvatar
      :avatar-url="user.avatar_url"
      :fallback-letter="avatarLetter"
      :is-uploading="isUploadingAvatar"
      @file-selected="$emit('file-selected', $event)"
    />

    <div class="flex-1 text-center sm:text-left space-y-4 w-full">
      <ProfileNicknameEditor
        ref="editorRef"
        :current-nickname="user.username"
        :is-saving="isSaving"
        :external-error="apiError"
        @save="handleSave"
      />

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        <div>
          <span class="text-xs uppercase tracking-wider text-text-base/50 font-semibold">{{
            $t('profile.details.email')
          }}</span>
          <p class="text-sm text-text-base/80 mt-0.5 truncate">{{ user.email }}</p>
        </div>
        <div>
          <span class="text-xs uppercase tracking-wider text-text-base/50 font-semibold">{{
            $t('profile.details.userId')
          }}</span>
          <p class="text-sm font-mono text-text-base/60 mt-0.5 truncate">{{ user.id }}</p>
        </div>
      </div>

      <div
        class="flex flex-wrap gap-3 justify-center sm:justify-start pt-2 border-t border-border-theme/40"
      >
        <div
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/15 text-primary border border-primary/25 text-xs font-semibold"
        >
          <span class="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
          {{ $t('userTier.default') }}
        </div>
      </div>
    </div>
  </div>
</template>
