<script setup lang="ts">
import IconWarning from './icons/IconWarning.vue'

defineProps<{
  isOpen: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  isLoading?: boolean
}>()

defineEmits<{
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-border-theme/40 backdrop-blur-sm"
        @click="$emit('cancel')"
      >
        <Transition
          enter-active-class="transition duration-200 ease-out delay-75"
          enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          enter-to-class="opacity-100 translate-y-0 sm:scale-100"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100 translate-y-0 sm:scale-100"
          leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          appear
        >
          <div
            v-if="isOpen"
            @click.stop
            class="bg-bg-surface border border-border-theme rounded-3xl p-6 w-full max-w-sm shadow-2xl flex flex-col gap-4"
          >
            <div class="flex items-center gap-4">
              <div
                class="w-20 h-20 rounded-3xl bg-text-red/5 flex items-center justify-center text-text-red/80 shrink-0"
              >
                <IconWarning />
              </div>
              <div>
                <h3 class="text-lg font-bold text-text-base">{{ title }}</h3>
                <p class="text-sm text-text-muted mt-1">{{ message }}</p>
              </div>
            </div>

            <div class="flex gap-3 mt-4">
              <button
                @click="$emit('cancel')"
                :disabled="isLoading"
                class="flex-1 py-2.5 px-4 rounded-xl border border-border-theme bg-bg-surface hover:bg-bg-surface-hover text-sm font-bold text-text-base transition-colors disabled:opacity-50"
              >
                {{ cancelText || 'Cancel' }}
              </button>
              <button
                @click="$emit('confirm')"
                :disabled="isLoading"
                class="flex-1 py-2.5 px-4 rounded-xl bg-text-red hover:bg-text-red/60 text-text-heading text-sm font-bold transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
              >
                <div
                  v-if="isLoading"
                  class="w-4 h-4 border-2 border-text-muted/30 border-t-text-heading rounded-full animate-spin"
                ></div>
                {{ confirmText || 'Delete' }}
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
