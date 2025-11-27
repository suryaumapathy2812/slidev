<script setup lang="ts">
import { renderMarkdown } from '~/utils/markdown'

const route = useRoute()
const slug = route.params.slug as string

// Fetch public presentation
const { data: presentation, error } = await useFetch(`/api/public/${slug}`)

if (error.value || !presentation.value) {
  throw createError({ statusCode: 404, message: 'Presentation not found' })
}

// Parse slides
const { parseMarkdown } = useSlideParser()
const parsedSlides = computed(() => parseMarkdown(presentation.value?.content || ''))
const totalSlides = computed(() => parsedSlides.value.length)

// Navigation
const nav = useNavigation(totalSlides)
const { currentSlide, hasNext, hasPrev, next, prev } = nav

// Keyboard shortcuts
useKeyboardShortcuts(nav)

// Render slides
const renderedSlides = ref<Map<number, Record<string, string>>>(new Map())

async function renderAllSlides() {
  const newMap = new Map<number, Record<string, string>>()

  for (const slide of parsedSlides.value) {
    const renderedSlots: Record<string, string> = {}

    for (const [slotName, content] of Object.entries(slide.slots)) {
      renderedSlots[slotName] = await renderMarkdown(content)
    }

    newMap.set(slide.index, renderedSlots)
  }

  renderedSlides.value = newMap
}

onMounted(renderAllSlides)

const currentParsedSlide = computed(() => parsedSlides.value[currentSlide.value - 1])
const nextParsedSlide = computed(() => parsedSlides.value[currentSlide.value])
const currentRenderedSlots = computed(() => renderedSlides.value.get(currentSlide.value - 1) || { default: '' })
const nextRenderedSlots = computed(() => renderedSlides.value.get(currentSlide.value) || { default: '' })

// Timer
const startTime = ref(Date.now())
const elapsed = ref(0)

const elapsedFormatted = computed(() => {
  const totalSeconds = Math.floor(elapsed.value / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

onMounted(() => {
  setInterval(() => {
    elapsed.value = Date.now() - startTime.value
  }, 1000)
})

// Update page title
useHead({
  title: `Presenter - ${presentation.value?.title || 'Presentation'}`,
})
</script>

<template>
  <div class="h-screen bg-gray-900 text-white grid grid-cols-[2fr_1fr] grid-rows-[1fr_1fr_auto]">
    <!-- Current Slide (Large) -->
    <div class="row-span-2 p-4 flex items-center justify-center">
      <PresentationSlideContainer class="w-full h-full">
        <PresentationSlideWrapper
          v-if="currentParsedSlide"
          :slide="currentParsedSlide"
          :rendered-slots="currentRenderedSlots"
        />
      </PresentationSlideContainer>
    </div>

    <!-- Next Slide Preview -->
    <div class="p-4 border-b border-gray-700">
      <div class="text-xs text-gray-400 mb-2 uppercase tracking-wide">
        Next
      </div>
      <PresentationSlideContainer class="w-full aspect-video rounded-lg overflow-hidden">
        <PresentationSlideWrapper
          v-if="nextParsedSlide"
          :slide="nextParsedSlide"
          :rendered-slots="nextRenderedSlots"
        />
        <div v-else class="h-full flex items-center justify-center text-gray-500 bg-gray-800">
          End of presentation
        </div>
      </PresentationSlideContainer>
    </div>

    <!-- Speaker Notes -->
    <div class="p-4 overflow-auto">
      <div class="text-xs text-gray-400 mb-2 uppercase tracking-wide">
        Notes
      </div>
      <div class="prose prose-sm prose-invert max-w-none">
        <PresentationPresenterNotes :note="currentParsedSlide?.note" />
      </div>
    </div>

    <!-- Bottom Navigation -->
    <div class="col-span-2 border-t border-gray-700 p-4 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <button
          :disabled="!hasPrev"
          class="p-3 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          @click="prev"
        >
          <span class="i-carbon-chevron-left text-xl" />
        </button>
        <button
          :disabled="!hasNext"
          class="p-3 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          @click="next"
        >
          <span class="i-carbon-chevron-right text-xl" />
        </button>
      </div>

      <div class="flex items-center gap-8">
        <!-- Timer -->
        <div class="text-2xl font-mono text-gray-400">
          {{ elapsedFormatted }}
        </div>

        <!-- Slide Counter -->
        <div class="text-3xl font-mono">
          <span class="text-white">{{ currentSlide }}</span>
          <span class="text-gray-500"> / {{ totalSlides }}</span>
        </div>
      </div>

      <div class="flex items-center gap-4">
        <!-- View Slide -->
        <NuxtLink
          :to="`/p/${slug}`"
          target="_blank"
          class="p-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition"
          title="Open slide view"
        >
          <span class="i-carbon-launch text-xl" />
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
