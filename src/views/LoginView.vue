<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import IconError from '@/components/icons/IconError.vue'
import { validateEmail, type EmailValidationError } from '@/utils/validators'
import { useMagicLinkAuth } from '@/composables/useMagicLinkAuth'

const { t } = useI18n()
const { isLoading, isSuccess, networkError, send } = useMagicLinkAuth()

const email = ref('')
const validationCode = ref<EmailValidationError>(null)

const emailErrorMessage = computed(() => {
  if (validationCode.value === 'required') return t('validation.required')
  if (validationCode.value === 'invalid') return t('validation.emailInvalid')
  return ''
})

const handleInput = () => {
  if (validationCode.value) validationCode.value = null
}

const handleSubmit = async () => {
  validationCode.value = validateEmail(email.value)
  if (validationCode.value !== null) return

  await send(email.value)
}
</script>

<template>
  <div class="min-h-[70vh] flex items-center justify-center px-4">
    <div
      class="max-w-md w-full bg-bg-surface border border-border-theme/30 rounded-2xl shadow-sm p-8 text-center"
    >
      <h2 class="text-2xl font-bold text-text-base mb-2">{{ $t('login.title') }}</h2>
      <p class="text-sm text-text-base/60 mb-8">{{ $t('login.subtitle') }}</p>

      <div
        v-if="isSuccess"
        class="bg-bg-surface text-text-base border border-text-muted/20 rounded-xl p-4"
      >
        <p class="font-medium">{{ $t('login.successMessage') }}</p>
        <p class="text-xs mt-2 opacity-80">{{ $t('login.closeTab') }}</p>
      </div>

      <form v-else @submit.prevent="handleSubmit" class="space-y-4" novalidate>
        <div class="text-left relative">
          <label for="email" class="sr-only">{{ $t('login.emailLabel') }}</label>

          <input
            id="email"
            type="email"
            v-model="email"
            placeholder="name@example.com"
            @input="handleInput"
            class="w-full px-4 py-3 bg-transparent border rounded-xl focus:outline-none transition-colors text-text-base"
            :class="
              emailErrorMessage
                ? 'border-text-red ring-1 ring-text-red'
                : 'border-border-theme/50 focus:border-primary focus:ring-1 focus:ring-primary'
            "
            :disabled="isLoading"
          />

          <transition name="fade">
            <div
              v-if="emailErrorMessage"
              class="mt-1.5 text-text-red text-xs flex items-center gap-1.5 px-1"
            >
              <IconError class="w-4 h-4 shrink-0" />
              <span>{{ emailErrorMessage }}</span>
            </div>
          </transition>
        </div>

        <div v-if="networkError" class="text-text-red text-sm text-left px-1">
          {{ $t('login.networkError') }}
        </div>

        <button
          type="submit"
          :disabled="isLoading"
          class="w-full py-3 px-4 bg-primary text-text-base font-medium rounded-xl hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex justify-center items-center gap-2 cursor-pointer"
        >
          <span
            v-if="isLoading"
            class="w-5 h-5 border-2 border-bg-surface/30 border-t-text-heading rounded-full animate-spin"
          ></span>
          <span>{{ isLoading ? $t('login.sending') : $t('login.getLink') }}</span>
        </button>
      </form>
    </div>
  </div>
</template>
