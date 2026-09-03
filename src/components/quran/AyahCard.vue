<script setup lang="ts">
import { ref } from 'vue'
import IconInfo from '../icons/IconInfo.vue'
import IconCopy from '../icons/IconCopy.vue'
import IconPlay from '../icons/IconPlay.vue'
import IconBook from '../icons/IconBook.vue'
import CopyWidget from '../CopyWidget.vue'

defineProps<{
  ayahNumber: number
  arabicText: string
  transcriptionText?: string
  translationText: string
  tafsirText: string
  isPlaying?: boolean
}>()

defineEmits<{
  (e: 'play', ayahNumber: number): void
  (e: 'copy', text: string): void
}>()

const isTafsirOpen = ref(false)
</script>

<template>
  <div
    class="group flex flex-col gap-6 p-6 border-b border-border-theme/50 hover:bg-bg-surface-hover transition-colors last:border-0"
  >
    <!-- Top Action Bar & Verse Number -->
    <div class="flex items-center justify-between">
      <div
        class="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm shrink-0"
      >
        {{ ayahNumber }}
      </div>

      <!-- Interactive Controls -->
      <div
        class="flex items-center gap-1 md:gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
      >
        <!-- Tafsir Toggle -->
        <button
          @click="isTafsirOpen = !isTafsirOpen"
          title="Read Tafsir"
          class="p-2 transition-colors"
          :class="isTafsirOpen ? 'text-primary' : 'text-text-muted hover:text-primary'"
        >
          <IconInfo class="w-5 h-5" />
        </button>

        <!-- Delegated Copy Action -->
        <CopyWidget
          :get-text="
            async () => {
              return arabicText
            }
          "
        >
          <template #default="{ copy }">
            <button
              type="button"
              @click="copy"
              class="p-1.5 rounded-lg bg-bg-surface-hover text-text-muted hover:text-primary transition-colors"
            >
              <IconCopy class="w-3.5 h-3.5" />
            </button>
          </template>
        </CopyWidget>

        <!-- Delegated Play Action -->
        <button
          @click="$emit('play', ayahNumber)"
          title="Play Audio"
          class="p-2 text-primary hover:scale-110 transition-transform"
        >
          <IconPlay :is-playing="isPlaying" class="w-6 h-6" />
        </button>
      </div>
    </div>

    <!-- Arabic Text -->
    <div class="text-right">
      <p class="text-4xl text-text-heading leading-14 font-serif" dir="rtl">
        {{ arabicText }}
      </p>
    </div>

    <!-- Transcription & Translation Container -->
    <div class="text-left max-w-3xl flex flex-col gap-2">
      <p
        v-if="transcriptionText"
        class="text-text-muted/80 font-medium text-[15px] italic leading-relaxed"
      >
        {{ transcriptionText }}
      </p>
      <p class="text-text-base text-[15px] leading-relaxed">
        {{ translationText }}
      </p>
    </div>

    <!-- Tafsir Expansion Area -->
    <div v-show="isTafsirOpen" class="mt-2 p-5 bg-bg-base rounded-xl border border-border-theme">
      <div class="flex items-center gap-2 mb-3">
        <IconBook class="w-4 h-4 text-primary" />
        <span class="text-xs font-semibold text-primary uppercase tracking-wider">{{
          $t('quran.tafsir')
        }}</span>
      </div>
      <p class="text-text-muted text-sm leading-relaxed whitespace-pre-line">{{ tafsirText }}</p>
    </div>
  </div>
</template>
