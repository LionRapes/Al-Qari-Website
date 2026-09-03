<!-- components/common/CopyWidget.vue -->
<script setup lang="ts">
import { useClipboard } from '@/composables/useClipboard'

const props = defineProps<{
  getText: () => Promise<string> | string
}>()

const { isCopied, copyToClipboard } = useClipboard()

const triggerCopy = async (event?: Event) => {
  event?.stopPropagation()

  const textToCopy = await props.getText()

  if (textToCopy) await copyToClipboard(textToCopy)
}
</script>

<template>
  <div class="relative inline-flex items-center">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-1"
    >
      <div
        v-if="isCopied"
        class="absolute -top-7 left-1/2 -translate-x-1/2 z-30 bg-primary text-text-heading text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-md flex items-center gap-1 select-none pointer-events-none whitespace-nowrap"
      >
        <span>{{ $t('common.copied') }}</span>
      </div>
    </Transition>

    <slot :copy="triggerCopy" :is-copied="isCopied">
      <button type="button" @click="triggerCopy">Copy</button>
    </slot>
  </div>
</template>
