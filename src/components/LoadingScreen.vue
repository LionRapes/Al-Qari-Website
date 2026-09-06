<script setup lang="ts">
import quranApi from '@/services/quranApi'
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const emit = defineEmits<{
  (e: 'ready'): void
}>()

const { t } = useI18n()

const isError = ref(false)
const statusKey = ref('loading.establishing')

const checkServer = async () => {
  isError.value = false
  statusKey.value = 'loading.establishing'

  try {
    const response = await quranApi.getMetadata()

    if (response.tafsirs) {
      statusKey.value = 'loading.success'
      isError.value = false
      setTimeout(() => {
        emit('ready')
      }, 500)
    } else {
      isError.value = true
      statusKey.value = 'loading.unavailable'
    }
  } catch {
    isError.value = true
    statusKey.value = 'loading.network_error'
    setTimeout(checkServer, 5000)
  }
}

onMounted(() => {
  checkServer()
})
</script>

<template>
  <div class="loading-wrapper">
    <div class="svg-container">
      <svg class="islamic-star" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <g class="star-group">
          <rect
            x="25"
            y="25"
            width="50"
            height="50"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
          />
          <rect
            x="25"
            y="25"
            width="50"
            height="50"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            transform="rotate(45 50 50)"
          />
          <circle cx="50" cy="50" r="16" fill="none" stroke="currentColor" stroke-width="1.5" />
          <circle cx="50" cy="50" r="5" fill="currentColor" class="pulse-circle" />
        </g>
      </svg>
    </div>

    <div class="text-container">
      <h1 class="title" data-text="Al-Qari">Al-Qari</h1>
      <p class="subtitle" :class="{ 'error-text': isError }">{{ t(statusKey) }}</p>
    </div>
  </div>
</template>

<style scoped>
.loading-wrapper {
  position: fixed;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: var(--bg-base-gradient);
  z-index: 9999;
}

.svg-container {
  width: 90px;
  height: 90px;
  margin-bottom: 40px;
  color: var(--primary);
}

.islamic-star {
  width: 100%;
  height: 100%;
  animation: rotateSlow 12s linear infinite;
}

.star-group rect,
.star-group circle {
  stroke-linecap: round;
  stroke-linejoin: round;
  animation: drawLines 3s ease-in-out infinite alternate;
}

.pulse-circle {
  transform-origin: 50px 50px;
  animation: pulseInner 2s ease-in-out infinite alternate;
}

@keyframes rotateSlow {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes drawLines {
  0% {
    stroke-opacity: 0.2;
  }
  100% {
    stroke-opacity: 1;
  }
}

@keyframes pulseInner {
  0% {
    transform: scale(0.6);
    opacity: 0.5;
  }
  100% {
    transform: scale(1.3);
    opacity: 1;
  }
}

.text-container {
  text-align: center;
  animation: fadeInUp 0.8s ease-out forwards;
}

.title {
  position: relative;
  font-size: 2.75rem;
  margin: 0;
  letter-spacing: 5px;
  font-weight: 600;
  text-transform: uppercase;

  color: transparent;
  -webkit-text-stroke: 1.5px var(--primary);
}

.title::before,
.title::after {
  content: attr(data-text);
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  color: var(--primary);
  -webkit-text-stroke: 0px transparent;
  pointer-events: none;
  animation: liquidWave 3s linear infinite;
}

.title::after {
  opacity: 0.4;
  animation-delay: -1.5s;
}

@keyframes liquidWave {
  0% {
    clip-path: polygon(
      0% 50%,
      16% 40%,
      33% 50%,
      50% 60%,
      66% 50%,
      83% 40%,
      100% 50%,
      100% 100%,
      0% 100%
    );
  }
  25% {
    clip-path: polygon(
      0% 60%,
      16% 50%,
      33% 40%,
      50% 50%,
      66% 60%,
      83% 50%,
      100% 40%,
      100% 100%,
      0% 100%
    );
  }
  50% {
    clip-path: polygon(
      0% 50%,
      16% 60%,
      33% 50%,
      50% 40%,
      66% 50%,
      83% 60%,
      100% 50%,
      100% 100%,
      0% 100%
    );
  }
  75% {
    clip-path: polygon(
      0% 40%,
      16% 50%,
      33% 60%,
      50% 50%,
      66% 40%,
      83% 50%,
      100% 60%,
      100% 100%,
      0% 100%
    );
  }
  100% {
    clip-path: polygon(
      0% 50%,
      16% 40%,
      33% 50%,
      50% 60%,
      66% 50%,
      83% 40%,
      100% 50%,
      100% 100%,
      0% 100%
    );
  }
}

.subtitle {
  font-size: 1.1rem;
  color: var(--text-muted);
  margin-top: 16px;
  font-weight: 400;
  letter-spacing: 1px;
  min-height: 24px;
  transition: color 0.3s;
  animation: pulseText 2.5s ease-in-out infinite;
}

@keyframes pulseText {
  0%,
  100% {
    opacity: 0.5;
    text-shadow: 0 0 0 transparent;
  }
  50% {
    opacity: 1;
    text-shadow: 0 0 10px rgba(156, 163, 175, 0.4);
  }
}

.error-text {
  color: var(--text-red) !important;
  opacity: 1;
  animation:
    errorShake 0.4s ease-in-out forwards,
    errorPulse 2s ease-in-out infinite alternate !important;
}

@keyframes errorShake {
  0%,
  100% {
    transform: translateX(0);
  }
  20% {
    transform: translateX(-4px);
  }
  40% {
    transform: translateX(4px);
  }
  60% {
    transform: translateX(-2px);
  }
  80% {
    transform: translateX(2px);
  }
}

@keyframes errorPulse {
  0% {
    text-shadow: 0 0 8px rgba(255, 51, 51, 0.3);
  }
  100% {
    text-shadow:
      0 0 16px rgba(255, 51, 51, 0.7),
      0 0 4px rgba(255, 51, 51, 0.5);
  }
}

@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(15px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
