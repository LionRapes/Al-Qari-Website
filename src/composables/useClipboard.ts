import { ref } from 'vue'

export function useClipboard(timeoutMs = 2000) {
  const isCopied = ref(false)
  let timeout: ReturnType<typeof setTimeout>

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      isCopied.value = true

      clearTimeout(timeout)
      timeout = setTimeout(() => {
        isCopied.value = false
      }, timeoutMs)

      return true
    } catch (error) {
      console.error('Failed to copy text:', error)
      return false
    }
  }

  return {
    isCopied,
    copyToClipboard,
  }
}
