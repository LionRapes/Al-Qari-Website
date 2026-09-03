<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import IconError from '@/components/icons/IconError.vue'
import { validateNickname } from '@/utils/validators'

const props = defineProps<{
  currentNickname: string
  isSaving: boolean
  externalError?: string
}>()

const emit = defineEmits<{
  (e: 'save', newNickname: string): void
}>()

const { t } = useI18n()
const isEditing = ref(false)
const draftNickname = ref('')
const localError = ref('')

watch(
  () => props.externalError,
  (newVal) => {
    if (newVal) localError.value = newVal
  },
)

const startEdit = () => {
  draftNickname.value = props.currentNickname
  localError.value = ''
  isEditing.value = true
}

const cancelEdit = () => {
  isEditing.value = false
  localError.value = ''
}

const handleSave = () => {
  const trimmed = draftNickname.value.trim()
  if (!trimmed) return

  if (!validateNickname(trimmed)) {
    localError.value = t('profile.errors.onlyLatin')
    return
  }

  localError.value = ''
  emit('save', trimmed)
}

defineExpose({
  closeEditor: () => {
    isEditing.value = false
  },
})
</script>

<template>
  <div>
    <span class="text-xs uppercase tracking-wider text-text-base/50 font-semibold">
      {{ $t('profile.editor.nickname') }}
    </span>

    <div v-if="!isEditing" class="flex items-center justify-center sm:justify-start gap-2.5 mt-0.5">
      <span class="text-lg font-medium text-text-base">{{ currentNickname }}</span>
      <button
        type="button"
        @click="startEdit"
        class="text-xs text-primary hover:underline font-medium cursor-pointer"
      >
        {{ $t('profile.editor.edit') }}
      </button>
    </div>

    <form
      v-else
      @submit.prevent="handleSave"
      class="flex flex-col sm:items-start items-center gap-2 mt-1.5"
    >
      <div class="flex flex-wrap justify-center sm:justify-start items-center gap-2">
        <input
          type="text"
          v-model="draftNickname"
          @input="draftNickname = draftNickname.replace(/[^a-zA-Z0-9_-]/g, '')"
          :placeholder="$t('profile.editor.placeholder')"
          maxlength="24"
          class="px-3 py-1.5 text-sm bg-transparent border border-border-theme/60 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-text-base"
          :disabled="isSaving"
          autofocus
        />
        <button
          type="submit"
          :disabled="isSaving"
          class="px-3 py-1.5 text-xs bg-primary text-text-base font-semibold rounded-xl hover:opacity-90 active:scale-95 disabled:opacity-50 transition-all flex items-center gap-1 cursor-pointer"
        >
          <span
            v-if="isSaving"
            class="w-3 h-3 border-2 border-text-base/30 border-t-text-base rounded-full animate-spin"
          ></span>
          <span>{{ $t('profile.editor.save') }}</span>
        </button>
        <button
          type="button"
          @click="cancelEdit"
          :disabled="isSaving"
          class="px-3 py-1.5 text-xs bg-bg-surface-hover border border-border-theme text-text-base/70 rounded-xl hover:text-text-base active:scale-95 transition-all cursor-pointer"
        >
          {{ $t('profile.editor.cancel') }}
        </button>
      </div>

      <div v-if="localError" class="text-text-red text-xs flex items-center gap-1 mt-1">
        <IconError class="w-3.5 h-3.5 shrink-0" />
        <span>{{ localError }}</span>
      </div>
    </form>
  </div>
</template>
