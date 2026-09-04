<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import userApi from '@/services/userApi'
import HeaderLogo from './HeaderLogo.vue'
import DesktopNav from './DesktopNav.vue'
import MobileNav from './MobileNav.vue'
import UserProfile from './UserProfile.vue'
import { useI18n } from 'vue-i18n'
import { offEvent, onEvent } from '@/utils/eventUtils.ts'

defineProps<{
  navigation: { name: string; path: string }[]
}>()

const isMobileMenuOpen = ref(false)
const isLoggedIn = ref(false)
const userName = ref('')
const avatarUrl = ref('')
const userTier = ref('')

const { t } = useI18n()

const loadProfile = async () => {
  const userId = localStorage.getItem('user_id')
  const token = localStorage.getItem('access_token')

  if (userId && token) {
    try {
      const profile = await userApi.getUserProfile(userId)

      isLoggedIn.value = true
      userName.value = profile.username
      avatarUrl.value = profile.avatar_url
      userTier.value = t(`userTier.default`)
    } catch {
      isLoggedIn.value = false
    }
  }
}

onMounted(() => {
  loadProfile()
  onEvent('USER_PROFILE_UPDATED', loadProfile)
})

onUnmounted(() => {
  offEvent('USER_PROFILE_UPDATED', loadProfile)
})

// [[HEADER-toggleMenu|Close/Open mobile nav menu]]
const toggleMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}
</script>

<template>
  <header class="sticky top-0 max-w-350 mx-auto px-8 py-8 flex items-center justify-between z-50">
    <div
      class="absolute inset-0 w-full h-[120%] -z-10 pointer-events-none bg-bg-surface/20 backdrop-blur-md mask-[linear-gradient(to_bottom,black_50%,transparent)] [-webkit-mask-image:linear-gradient(to_bottom,black_50%,transparent)]"
    ></div>

    <div class="flex items-center gap-16">
      <HeaderLogo :is-mobile-menu-open="isMobileMenuOpen" @toggle="toggleMenu" />

      <DesktopNav :items="navigation" />
    </div>

    <UserProfile
      :is-logged-in="isLoggedIn"
      :name="userName"
      :tier="userTier"
      :avatar-url="avatarUrl"
    />

    <MobileNav :is-open="isMobileMenuOpen" :items="navigation" @close="isMobileMenuOpen = false" />
  </header>
</template>
