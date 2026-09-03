<script setup lang="ts"></script>

<template>
  <div class="bg-bg-surface border border-border-theme/30 rounded-3xl p-10 text-center shadow-sm">
    <p class="text-text-base/70 mb-6">{{ $t('profile.auth.notLoggedIn') }}</p>
    <router-link
      to="/login"
      class="inline-flex px-6 py-3 bg-primary text-text-base font-medium rounded-xl hover:opacity-90 active:scale-[0.98] transition-all"
    >
      {{ $t('profile.auth.goToLogin') }}
    </router-link>
  </div>
</template>
