<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router' // 1. Импортируем роутер
import IconUser from './icons/IconUser.vue'

// 2. Сохраняем пропсы в переменную, чтобы обращаться к ним в скрипте, и добавляем userId
const props = defineProps<{
  avatarUrl?: string | null
  userId: string // Обязательный пропс для перехода
}>()

const emit = defineEmits<{
  (e: 'action', action: string): void
}>()

const router = useRouter() // 3. Инициализируем роутер

const isMenuOpen = ref(false)
const menuX = ref(0)
const menuY = ref(0)
const menuRef = ref<HTMLElement | null>(null)

const openContextMenu = (event: MouseEvent) => {
  isMenuOpen.value = true
  menuX.value = event.clientX
  menuY.value = event.clientY
}

const closeMenu = () => {
  isMenuOpen.value = false
}

const handleClickOutside = (event: MouseEvent) => {
  if (isMenuOpen.value && menuRef.value && !menuRef.value.contains(event.target as Node)) {
    closeMenu()
  }
}

const handleAction = (action: string) => {
  emit('action', action)

  // 4. Реализуем переход
  if (action === 'profile') {
    router.push(`/profile/${props.userId}`)
  } else if (action === 'report') {
    console.log('Открытие модалки жалобы')
  }

  closeMenu()
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('contextmenu', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('contextmenu', handleClickOutside)
})
</script>

<template>
  <div class="w-full h-full">
    <!-- Сам аватар, цвет заглушки заменен на bg-bg-surface -->
    <div
      class="w-full h-full relative rounded-full overflow-hidden bg-bg-surface flex items-center justify-center cursor-context-menu"
      @contextmenu.prevent.stop="openContextMenu"
    >
      <img v-if="avatarUrl" :src="avatarUrl" class="w-full h-full object-cover" alt="User avatar" />
      <IconUser v-else class="w-6 h-6 text-primary" />
    </div>

    <!-- Контекстное меню с анимацией -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-200 ease-out origin-top-left"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-150 ease-in origin-top-left"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
      >
        <div
          v-if="isMenuOpen"
          ref="menuRef"
          class="fixed z-50 bg-bg-surface border border-border-theme shadow-xl rounded-md py-1 min-w-37.5 text-sm text-text-base"
          :style="{ top: `${menuY}px`, left: `${menuX}px` }"
        >
          <!-- Слот позволяет передавать любые кнопки из родителя -->
          <slot name="menu">
            <button
              class="w-full text-left px-4 py-2 hover:bg-bg-surface-hover hover:text-text-heading transition-colors"
              @click="handleAction('profile')"
            >
              {{ $t('nav.profile') }}
            </button>
          </slot>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
