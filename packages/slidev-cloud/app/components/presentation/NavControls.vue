<script setup lang="ts">
defineProps<{
  currentSlide: number
  totalSlides: number
  hasNext: boolean
  hasPrev: boolean
  isFullscreen?: boolean
  showAlways?: boolean
}>()

const emit = defineEmits<{
  (e: 'next'): void
  (e: 'prev'): void
  (e: 'toggleFullscreen'): void
}>()
</script>

<template>
  <nav
    class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 px-4 py-2 bg-black/50 backdrop-blur-sm rounded-full transition-opacity"
    :class="showAlways ? 'opacity-100' : 'opacity-0 hover:opacity-100'"
  >
    <button
      :disabled="!hasPrev"
      class="p-2 rounded-full hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white transition"
      @click="emit('prev')"
    >
      <span class="i-carbon-chevron-left text-lg" />
    </button>

    <span class="px-4 text-sm text-white font-mono">
      {{ currentSlide }} / {{ totalSlides }}
    </span>

    <button
      :disabled="!hasNext"
      class="p-2 rounded-full hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white transition"
      @click="emit('next')"
    >
      <span class="i-carbon-chevron-right text-lg" />
    </button>

    <div class="w-px h-6 bg-white/30 mx-2" />

    <button
      v-if="isFullscreen !== undefined"
      class="p-2 rounded-full hover:bg-white/20 text-white transition"
      @click="emit('toggleFullscreen')"
    >
      <span :class="isFullscreen ? 'i-carbon-minimize' : 'i-carbon-maximize'" class="text-lg" />
    </button>
  </nav>
</template>
