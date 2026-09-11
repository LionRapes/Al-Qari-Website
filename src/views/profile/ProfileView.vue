<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUserProfile } from '@/composables/useUserProfile'
import ProfileUserCard from '@/components/profile/ProfileUserCard.vue'
import ProfileGuestBanner from '@/components/profile/ProfileGuestBanner.vue'
import IconExit from '@/components/icons/IconExit.vue'
import { useRoute } from 'vue-router'
import { getUserId, isModerator } from '@/utils/authUtils'
import BanModal from '@/components/BanModal.vue'
import userApi from '@/services/userApi'

const { t } = useI18n()

const route = useRoute()
const isBanModalOpen = ref(false)
const apiError = ref('')

const isOwnProfile = computed(() => {
  return getUserId() === (route.params.id as string)
})

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

const avatarLetter = computed(() => {
  const source = user.value?.username || user.value?.email || 'U'
  return source.trim().charAt(0).toUpperCase()
})

onMounted(() => {
  loadProfile(route.params.id as string)
})

const onSaveNickname = async (newNickname: string, closeEditor: () => void) => {
  apiError.value = ''
  try {
    await updateNickname(newNickname)
    closeEditor()
  } catch (e) {
    apiError.value = String(e) || t('profile.errors.usernameTaken', 'Имя уже занято')
  }
}

const onFileSelected = async (file: File) => {
  try {
    await updateAvatar(file)
  } catch (error) {
    console.error('Avatar upload failed', error)
  }
}

const handleBanConfirm = async (reason: string) => {
  try {
    if (user.value) {
      await userApi.banUser(user.value.id, reason)
      user.value.is_banned = true
    }
    isBanModalOpen.value = false
  } catch (error) {
    console.error('Ошибка при бане:', error)
  }
}

const handleUnban = async () => {
  try {
    if (user.value) {
      await userApi.unbanUser(user.value.id)
      user.value.is_banned = false
    }
  } catch (error) {
    console.error('Ошибка при разбане:', error)
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
      <div
        v-if="user.is_banned"
        class="bg-text-red/10 border border-text-red/30 rounded-2xl p-4 flex items-center justify-center text-text-red font-medium"
      >
        {{ $t('profile.status.banned') }}
      </div>

      <div
        :class="{
          'opacity-70 grayscale transition-all duration-500 pointer-events-none': user.is_banned,
        }"
      >
        <ProfileUserCard
          :user="user"
          :avatar-letter="avatarLetter"
          :is-uploading-avatar="isUploadingAvatar"
          :is-saving="isSaving"
          :api-error="apiError"
          @file-selected="onFileSelected"
          @save-nickname="onSaveNickname"
          :is-own-profile="isOwnProfile"
        />
      </div>

      <div class="flex justify-end pt-2 gap-4">
        <button
          v-if="isModerator() && !isOwnProfile && user.is_banned"
          type="button"
          @click="handleUnban"
          class="px-6 py-3 rounded-xl bg-text-green/10 border border-text-green/30 text-text-green hover:bg-text-green/20 active:scale-[0.98] transition-all text-sm font-medium flex items-center gap-2 cursor-pointer"
        >
          <span>{{ $t('profile.actions.unban', 'Разблокировать') }}</span>
        </button>

        <button
          v-if="isModerator() && !isOwnProfile && !user.is_banned"
          type="button"
          @click="isBanModalOpen = true"
          class="px-6 py-3 rounded-xl bg-text-red/10 border border-text-red/30 text-text-red hover:bg-text-red/20 active:scale-[0.98] transition-all text-sm font-medium flex items-center gap-2 cursor-pointer"
        >
          <span>{{ $t('profile.actions.ban', 'Забанить пользователя') }}</span>
        </button>

        <button
          v-if="isOwnProfile"
          type="button"
          @click="logout"
          class="px-6 py-3 rounded-xl border border-text-red/30 text-text-red hover:bg-text-red/10 active:scale-[0.98] transition-all text-sm font-medium flex items-center gap-2 cursor-pointer"
        >
          <IconExit />
          <span>{{ $t('profile.auth.logout') }}</span>
        </button>
      </div>
    </div>
    <ProfileGuestBanner v-else />

    <BanModal
      :is-open="isBanModalOpen"
      :username="user?.username"
      @close="isBanModalOpen = false"
      @confirm="handleBanConfirm"
    />
  </main>
</template>
