<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUserProfile } from '@/composables/useUserProfile'
import ProfileAvatar from '@/components/profile/ProfileAvatar.vue'
import ProfileNicknameEditor from '@/components/profile/ProfileNicknameEditor.vue'

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

const editorRef = ref<InstanceType<typeof ProfileNicknameEditor> | null>(null)
const apiError = ref('')

const avatarLetter = computed(() => {
  const source = user.value?.username || user.value?.email || 'U'
  return source.trim().charAt(0).toUpperCase()
})

onMounted(() => {
  loadProfile()
})

const onSaveNickname = async (newNickname: string) => {
  apiError.value = ''
  try {
    await updateNickname(newNickname)
    editorRef.value?.closeEditor()
  } catch {
    apiError.value = t('profile.usernameTaken', 'Имя уже занято')
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
      <h1 class="text-2xl lg:text-3xl font-bold text-text-base mb-1">{{ $t('profile.title') }}</h1>
      <p class="text-sm text-text-base/60">{{ $t('profile.subtitle') }}</p>
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
      <div
        class="bg-bg-surface border border-border-theme rounded-3xl p-6 lg:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 shadow-sm"
      >
        <ProfileAvatar
          :avatar-url="user.avatar_url"
          :fallback-letter="avatarLetter"
          :is-uploading="isUploadingAvatar"
          @file-selected="onFileSelected"
        />

        <div class="flex-1 text-center sm:text-left space-y-4 w-full">
          <ProfileNicknameEditor
            ref="editorRef"
            :current-nickname="user.username"
            :is-saving="isSaving"
            :external-error="apiError"
            @save="onSaveNickname"
          />

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <span class="text-xs uppercase tracking-wider text-text-base/50 font-semibold">{{
                $t('profile.email')
              }}</span>
              <p class="text-sm text-text-base/80 mt-0.5 truncate">{{ user.email }}</p>
            </div>
            <div>
              <span class="text-xs uppercase tracking-wider text-text-base/50 font-semibold">{{
                $t('profile.userId')
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
              {{ $t('userTier.default', 'Default Plan') }}
            </div>
          </div>
        </div>
      </div>

      <div class="flex justify-end pt-2">
        <button
          type="button"
          @click="logout"
          class="px-6 py-3 rounded-xl border border-error/30 text-error hover:bg-error/10 active:scale-[0.98] transition-all text-sm font-medium flex items-center gap-2 cursor-pointer"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          <span>{{ $t('profile.logout') }}</span>
        </button>
      </div>
    </div>

    <div
      v-else
      class="bg-bg-surface border border-border-theme/30 rounded-3xl p-10 text-center shadow-sm"
    >
      <p class="text-text-base/70 mb-6">{{ $t('profile.notLoggedIn') }}</p>
      <router-link
        to="/login"
        class="inline-flex px-6 py-3 bg-primary text-text-base font-medium rounded-xl hover:opacity-90 active:scale-[0.98] transition-all"
      >
        {{ $t('profile.goToLogin') }}
      </router-link>
    </div>
  </main>
</template>
