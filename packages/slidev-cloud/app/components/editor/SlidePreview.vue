<script setup lang="ts">
import type { ParsedSlide } from '~/composables/useSlideParser'
import { renderMarkdown } from '~/utils/markdown'

const props = defineProps<{
  slides: ParsedSlide[]
  currentSlide: number
}>()

const emit = defineEmits<{
  (e: 'update:currentSlide', value: number): void
}>()

// Render all slots for all slides
const renderedSlides = ref<Map<number, Record<string, string>>>(new Map())

async function renderAllSlides() {
  const newMap = new Map<number, Record<string, string>>()

  for (const slide of props.slides) {
    const renderedSlots: Record<string, string> = {}

    for (const [slotName, content] of Object.entries(slide.slots)) {
      renderedSlots[slotName] = await renderMarkdown(content)
    }

    newMap.set(slide.index, renderedSlots)
  }

  renderedSlides.value = newMap
}

// Re-render when slides change
watch(() => props.slides, renderAllSlides, { immediate: true, deep: true })

const currentParsedSlide = computed(() => props.slides[props.currentSlide])
const currentRenderedSlots = computed(() => renderedSlides.value.get(props.currentSlide) || { default: '' })
</script>

<template>
  <div class="h-full flex flex-col bg-gray-100 dark:bg-gray-800">
    <div class="px-4 py-2 border-b border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400 flex items-center justify-between">
      <span>Preview</span>
      <span class="text-xs">
        Slide {{ currentSlide + 1 }} of {{ slides.length }}
      </span>
    </div>

    <!-- Slide Preview -->
    <div class="flex-1 p-4 flex items-center justify-center overflow-hidden">
      <PresentationSlideContainer class="w-full h-full max-w-3xl">
        <PresentationSlideWrapper
          v-if="currentParsedSlide"
          :slide="currentParsedSlide"
          :rendered-slots="currentRenderedSlots"
        />
        <div v-else class="h-full flex items-center justify-center text-gray-400">
          No slides yet
        </div>
      </PresentationSlideContainer>
    </div>

    <!-- Slide Thumbnails -->
    <div class="border-t border-gray-200 dark:border-gray-700 p-2 overflow-x-auto">
      <div class="flex gap-2">
        <button
          v-for="(slide, i) in slides"
          :key="i"
          class="flex-shrink-0 w-20 h-12 rounded border-2 transition-colors overflow-hidden"
          :class="i === currentSlide
            ? 'border-blue-500'
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'"
          @click="emit('update:currentSlide', i)"
        >
          <div class="w-full h-full bg-white dark:bg-gray-900 flex items-center justify-center text-xs text-gray-500">
            {{ i + 1 }}
          </div>
        </button>
      </div>
    </div>
  </div>
</template>
