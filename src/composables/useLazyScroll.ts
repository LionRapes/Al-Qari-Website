import { onMounted, onUnmounted, ref } from 'vue'

export function useLazyScroll(callback: () => void, options = { rootMargin: '300px' }) {
  const triggerRef = ref<HTMLElement | null>(null)
  const containerRef = ref<HTMLElement | null>(null)
  let observer: IntersectionObserver | null = null

  onMounted(() => {
    observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) callback()
      },
      {
        root: containerRef.value,
        ...options,
      },
    )

    if (triggerRef.value) observer.observe(triggerRef.value)
  })

  onUnmounted(() => {
    if (observer) observer.disconnect()
  })

  return { triggerRef, containerRef }
}
