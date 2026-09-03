<script setup lang="ts"></script>

<template>
  <div class="animate-pulse">
    <div class="h-10 bg-bg-surface-hover rounded-xl w-2/3 mb-4"></div>
    <div class="flex items-center gap-3 mb-8">
      <div class="w-8 h-8 bg-bg-surface-hover rounded-full"></div>
      <div class="h-4 bg-bg-surface-hover rounded-md w-32"></div>
    </div>
    <div class="space-y-4">
      <div v-for="i in 4" :key="i" class="h-32 bg-bg-surface-hover rounded-2xl w-full"></div>
    </div>
  </div>
</template>
