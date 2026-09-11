<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  isOpen: boolean
  username?: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'confirm', reason: string): void
}>()

const reason = ref('')

watch(
  () => props.isOpen,
  (newVal) => {
    if (!newVal) {
      reason.value = ''
    }
  },
)

const handleClose = () => {
  emit('close')
}

const handleConfirm = () => {
  if (reason.value.trim()) {
    emit('confirm', reason.value.trim())
  }
}
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
        class="fixed inset-0 z-100 flex items-center justify-center bg-bg-base/60 backdrop-blur-sm px-4"
        @click.self="handleClose"
      >
        <Transition
          enter-active-class="transition duration-200 ease-out delay-75"
          enter-from-class="opacity-0 scale-95 translate-y-4"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100 scale-100 translate-y-0"
          leave-to-class="opacity-0 scale-95 translate-y-4"
          appear
        >
          <div
            v-if="isOpen"
            class="w-full max-w-md bg-bg-surface border border-border-theme rounded-2xl shadow-2xl overflow-hidden"
          >
            <div class="px-6 py-4 border-b border-border-theme">
              <h3 class="text-lg font-semibold text-text-heading">
                {{ $t('moderation.ban.title', 'Блокировка пользователя') }}
                <span v-if="username" class="text-primary ml-1">{{ username }}</span>
              </h3>
            </div>

            <div class="px-6 py-5">
              <label class="block text-sm font-medium text-text-base mb-2">
                {{ $t('moderation.ban.reasonLabel', 'Укажите причину') }}
              </label>
              <textarea
                v-model="reason"
                rows="4"
                class="w-full bg-bg-base border border-border-theme rounded-xl px-4 py-3 text-text-base placeholder-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
                :placeholder="
                  $t('moderation.ban.reasonPlaceholder', 'Например: Спам, нарушение правил...')
                "
              ></textarea>
            </div>

            <div class="px-6 py-4 bg-bg-base border-t border-border-theme flex justify-end gap-3">
              <button
                @click="handleClose"
                class="px-5 py-2.5 rounded-xl text-text-base hover:bg-bg-surface border border-transparent hover:border-border-theme transition-all"
              >
                {{ $t('common.cancel', 'Отмена') }}
              </button>
              <button
                @click="handleConfirm"
                :disabled="!reason.trim()"
                class="px-5 py-2.5 rounded-xl bg-text-red/90 text-text-heading hover:bg-text-red disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
              >
                {{ $t('moderation.ban.confirm', 'Забанить') }}
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
