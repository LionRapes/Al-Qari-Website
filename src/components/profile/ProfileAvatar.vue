<script setup lang="ts">
import { ref } from 'vue'
import IconCamera from '@/components/icons/IconCamera.vue'

const props = defineProps<{
  avatarUrl?: string | null
  fallbackLetter: string
  isUploading: boolean
}>()

const emit = defineEmits<{
  (e: 'file-selected', file: File): void
}>()

const fileInput = ref<HTMLInputElement | null>(null)

const triggerUpload = () => {
  if (!props.isUploading) fileInput.value?.click()
}

const onFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    emit('file-selected', file)
  }
  target.value = ''
}
</script>

<template>
  <div class="relative group cursor-pointer shrink-0" @click="triggerUpload">
    <input
      type="file"
      ref="fileInput"
      accept="image/png, image/jpeg, image/webp"
      class="hidden"
      @change="onFileChange"
    />

    <div
      v-if="avatarUrl"
      class="w-20 h-20 rounded-2xl bg-bg-surface overflow-hidden border border-border-theme/50"
    >
      <img :src="avatarUrl" class="w-full h-full object-cover" alt="User avatar" />
    </div>

    <div
      v-else
      class="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center text-3xl font-bold select-none"
    >
      {{ fallbackLetter }}
    </div>

    <div
      class="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white backdrop-blur-sm"
      :class="{ 'opacity-100': isUploading }"
    >
      <span
        v-if="isUploading"
        class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"
      ></span>
      <IconCamera v-else class="w-6 h-6" />
    </div>
  </div>
</template>
