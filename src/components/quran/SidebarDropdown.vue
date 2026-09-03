<script setup lang="ts">
import { ref } from 'vue'
import IconChevron from '../icons/IconChevron.vue'
import type { DropdownOption } from '@/types/ui.types.ts'

defineProps<{
  title: string
  options: DropdownOption[]
  modelValue: DropdownOption | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: DropdownOption): void
}>()

const isOpen = ref(false)

const selectOption = (option: DropdownOption) => {
  emit('update:modelValue', option)
  isOpen.value = false
}
</script>

<template>
  <div
    class="bg-bg-surface border border-border-theme rounded-2xl overflow-hidden mb-4 transition-colors hover:border-primary/30"
  >
    <!-- Dropdown Header (Clickable) -->
    <button
      @click="isOpen = !isOpen"
      class="w-full px-5 py-4 flex items-center justify-between text-left cursor-pointer"
    >
      <div class="flex items-center gap-3">
        <div
          class="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0"
        >
          <slot name="icon"></slot>
        </div>

        <div>
          <h3 class="text-sm font-semibold text-text-base">{{ title }}</h3>
          <p v-if="modelValue" class="text-xs text-text-muted mt-0.5">{{ modelValue.label }}</p>
        </div>
      </div>

      <IconChevron
        class="w-5 h-5 text-text-muted transition-transform duration-300"
        :isOpen="isOpen"
      />
    </button>

    <!-- Dropdown Content -->
    <transition
      enter-active-class="transition-[max-height,opacity] duration-300 ease-in-out"
      enter-from-class="max-h-0 opacity-0"
      enter-to-class="max-h-64 opacity-100"
      leave-active-class="transition-[max-height,opacity] duration-200 ease-in-out"
      leave-from-class="max-h-64 opacity-100"
      leave-to-class="max-h-0 opacity-0"
    >
      <div v-show="isOpen" class="border-t border-border-theme bg-surface-gradient">
        <ul class="max-h-56 overflow-y-auto py-2 custom-scrollbar">
          <li v-for="option in options" :key="option.id">
            <button
              @click="selectOption(option)"
              class="w-full text-left px-5 py-2.5 text-sm transition-colors"
              :class="
                modelValue?.id === option.id
                  ? 'text-primary bg-primary/5 font-medium'
                  : 'text-text-muted hover:text-text-base hover:bg-bg-surface-hover'
              "
            >
              {{ option.label }}
            </button>
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: var(--border-theme);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: var(--primary);
}
</style>
