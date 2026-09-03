<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUserProfile } from '@/composables/useUserProfile'
import ProfileUserCard from '@/components/profile/ProfileUserCard.vue'
import ProfileGuestBanner from '@/components/profile/ProfileGuestBanner.vue'
import IconExit from '@/components/icons/IconExit.vue'

const { t } = useI18n()

const {
  user,
  isAuthenticated,
  isLoading,
  isSaving,
  isUploadingAvatar,
  loadProfile,
  updateNickname,
  updateAvatar,
  logout,
} = useUserProfile()

const apiError = ref('')

const avatarLetter = computed(() => {
  const source = user.value?.username || user.value?.email || 'U'
  return source.trim().charAt(0).toUpperCase()
})

onMounted(() => {
  loadProfile()
})

const onSaveNickname = async (newNickname: string, closeEditor: () => void) => {
  apiError.value = ''
  try {
    await updateNickname(newNickname)
    closeEditor()
  } catch {
    apiError.value = t('profile.errors.usernameTaken', 'Имя уже занято')
  }
}

const onFileSelected = async (file: File) => {
  try {
    await updateAvatar(file)
  } catch (error) {
    console.error('Avatar upload failed', error)
  }
}
</script>

<template>
  <main class="max-w-3xl mx-auto px-6 mt-8 pb-12">
    <div class="mb-8">
      <h1 class="text-2xl lg:text-3xl font-bold text-text-base mb-1">
        {{ $t('profile.header.title') }}
      </h1>
      <p class="text-sm text-text-base/60">{{ $t('profile.header.subtitle') }}</p>
    </div>

    <div
      v-if="isLoading"
      class="bg-bg-surface border border-border-theme/30 rounded-3xl p-10 flex justify-center items-center"
    >
      <div
        class="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin"
      ></div>
    </div>

    <div v-else-if="isAuthenticated && user" class="space-y-6">
      <ProfileUserCard
        :user="user"
        :avatar-letter="avatarLetter"
        :is-uploading-avatar="isUploadingAvatar"
        :is-saving="isSaving"
        :api-error="apiError"
        @file-selected="onFileSelected"
        @save-nickname="onSaveNickname"
      />

      <div class="flex justify-end pt-2">
        <button
          type="button"
          @click="logout"
          class="px-6 py-3 rounded-xl border border-error/30 text-error hover:bg-error/10 active:scale-[0.98] transition-all text-sm font-medium flex items-center gap-2 cursor-pointer"
        >
          <IconExit />
          <span>{{ $t('profile.auth.logout') }}</span>
        </button>
      </div>
    </div>

    <ProfileGuestBanner v-else />
  </main>
</template>
