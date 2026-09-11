import { ref } from 'vue'
import defaultUserApi from '@/services/userApi'
import type { ApiUserProfile, IUserApi } from '@/types/user.types'
import { cropAndCompressImage } from '@/utils/imageUtils'
import { getAuthToken } from '@/utils/authUtils'

export function useUserProfile(apiService: IUserApi = defaultUserApi) {
  const user = ref<ApiUserProfile | null>(null)
  const isAuthenticated = ref(false)

  const isLoading = ref(true)
  const isSaving = ref(false)
  const isUploadingAvatar = ref(false)

  const loadProfile = async (id: string) => {
    isLoading.value = true

    if (!getAuthToken() || !id) {
      isAuthenticated.value = false
      isLoading.value = false
      return
    }

    try {
      user.value = await apiService.getUserProfile(id)
      isAuthenticated.value = true
    } catch {
      isAuthenticated.value = false
      user.value = null
    } finally {
      isLoading.value = false
    }
  }

  const updateNickname = async (newNickname: string): Promise<void> => {
    if (!user.value || newNickname === user.value.username) return

    isSaving.value = true
    try {
      await apiService.updateUserProfile(newNickname)
      user.value.username = newNickname
    } finally {
      isSaving.value = false
    }
  }

  const updateAvatar = async (file: File): Promise<void> => {
    if (!user.value) return

    isUploadingAvatar.value = true
    try {
      const optimizedFile = await cropAndCompressImage(file)
      const response = await apiService.uploadAvatar(optimizedFile)
      user.value.avatar_url = response.avatar_url
    } finally {
      isUploadingAvatar.value = false
    }
  }

  const logout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('user_id')
    window.location.href = '/'
  }

  return {
    user,
    isAuthenticated,
    isLoading,
    isSaving,
    isUploadingAvatar,
    loadProfile,
    updateNickname,
    updateAvatar,
    logout,
  }
}
