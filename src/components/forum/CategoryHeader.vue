<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps<{
  showCreateButton: boolean
}>()

defineEmits<{
  (e: 'open-create-modal'): void
}>()
</script>

<template>
  <div
    class="flex flex-col sm:flex-row sm:items-center justify-between mb-8 border-b border-border-theme pb-4 gap-4"
  >
    <div>
      <RouterLink
        to="/forum"
        class="text-sm font-medium text-text-muted hover:text-primary transition-colors mb-2 inline-block"
      >
        {{ t('forum.topic.back') }}
      </RouterLink>

      <h1 class="text-3xl font-bold text-text-heading">
        {{ t('forum.topic.title') }}
      </h1>
    </div>

    <button
      v-if="showCreateButton"
      @click="$emit('open-create-modal')"
      class="bg-primary text-text-heading hover:opacity-90 font-semibold py-2 px-4 rounded-lg transition-opacity whitespace-nowrap border border-border-theme"
    >
      {{ t('forum.topic.new_topic') }}
    </button>
  </div>
</template>
