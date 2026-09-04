import { ref } from 'vue'
import defaultUserApi from '@/services/userApi'
import type { IUserApi } from '@/types/user.types'
import { useI18n } from 'vue-i18n'

export function useMagicLinkAuth(userApi: IUserApi = defaultUserApi) {
  const isLoading = ref(false)
  const isSuccess = ref(false)
  const networkError = ref(false)
  const { locale } = useI18n()

  const send = async (email: string): Promise<boolean> => {
    isLoading.value = true
    networkError.value = false

    try {
      await userApi.requestMagicLink(email.trim(), locale.value)
      isSuccess.value = true
      return true
    } catch {
      networkError.value = true
      return false
    } finally {
      isLoading.value = false
    }
  }

  const reset = () => {
    isLoading.value = false
    isSuccess.value = false
    networkError.value = false
  }

  return {
    isLoading,
    isSuccess,
    networkError,
    send,
    reset,
  }
}
