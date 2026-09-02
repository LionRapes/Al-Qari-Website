import { ref } from 'vue'
import defaultUserApi from '@/services/userApi'
import type { IUserApi } from '@/types/index'

export function useMagicLinkAuth(userApi: IUserApi = defaultUserApi) {
  const isLoading = ref(false)
  const isSuccess = ref(false)
  const networkError = ref(false)

  const send = async (email: string): Promise<boolean> => {
    isLoading.value = true
    networkError.value = false

    try {
      await userApi.requestMagicLink(email.trim())
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
