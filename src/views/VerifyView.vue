<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import userApi from '@/services/userApi'
import IconError from '@/components/icons/IconError.vue'

const { t } = useI18n()
const route = useRoute()

const isLoading = ref(true)
const errorMessage = ref('')

onMounted(async () => {
  const token = route.query.token as string

  if (!token) {
    errorMessage.value = t('verify.tokenMissing')
    isLoading.value = false
    return
  }

  try {
    const data = await userApi.verifyMagicLink(token)

    localStorage.setItem('access_token', data.access_token)
    localStorage.setItem('user_id', data.user_id)

    window.location.href = '/'
  } catch {
    errorMessage.value = t('verify.linkInvalid')
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="min-h-[70vh] flex items-center justify-center px-4">
    <div
      class="max-w-md w-full bg-bg-surface border border-border-theme/30 rounded-2xl shadow-sm p-8 text-center"
    >
      <div v-if="isLoading" class="flex flex-col items-center py-4">
        <div
          class="w-10 h-10 border-3 border-primary/20 border-t-primary rounded-full animate-spin mb-5"
        ></div>
        <h2 class="text-xl font-bold text-text-base mb-2">{{ $t('verify.verifying') }}</h2>
        <p class="text-sm text-text-base/60">{{ $t('verify.loadingDesc') }}</p>
      </div>

      <div v-else-if="errorMessage" class="flex flex-col items-center py-2">
        <div
          class="w-12 h-12 rounded-full bg-text-red/10 text-text-red flex items-center justify-center mb-4"
        >
          <IconError class="w-6 h-6" />
        </div>

        <h2 class="text-xl font-bold text-text-base mb-2">{{ $t('verify.errorTitle') }}</h2>
        <p class="text-sm text-text-base/70 mb-6">{{ errorMessage }}</p>

        <router-link
          to="/login"
          class="w-full py-3 px-4 bg-primary text-text-base font-medium rounded-xl hover:opacity-90 active:scale-[0.98] transition-all inline-block"
        >
          {{ $t('verify.tryAgain') }}
        </router-link>
      </div>
    </div>
  </div>
</template>
