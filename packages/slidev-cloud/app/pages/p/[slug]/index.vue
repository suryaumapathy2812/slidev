<script setup lang="ts">
import { useFullscreen } from '@vueuse/core'
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

// Fullscreen
const slideContainer = ref<HTMLElement | null>(null)
const { isFullscreen, toggle: toggleFullscreen } = useFullscreen(slideContainer)

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
const currentRenderedSlots = computed(() => renderedSlides.value.get(currentSlide.value - 1) || { default: '' })

// Click navigation (left half = prev, right half = next)
function handleSlideClick(e: MouseEvent) {
  const target = e.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  const clickX = e.clientX - rect.left

  if (clickX < rect.width / 2) {
    prev()
  }
  else {
    next()
  }
}

// Update page title
useHead({
  title: presentation.value?.title || 'Presentation',
})
</script>

<template>
  <div
    ref="slideContainer"
    class="h-screen bg-black flex flex-col cursor-pointer"
    @click="handleSlideClick"
  >
    <PresentationSlideContainer is-main class="flex-1">
      <PresentationSlideWrapper
        v-if="currentParsedSlide"
        :slide="currentParsedSlide"
        :rendered-slots="currentRenderedSlots"
      />
    </PresentationSlideContainer>

    <!-- Navigation Controls -->
    <PresentationNavControls
      :current-slide="currentSlide"
      :total-slides="totalSlides"
      :has-next="hasNext"
      :has-prev="hasPrev"
      :is-fullscreen="isFullscreen"
      @next="next"
      @prev="prev"
      @toggle-fullscreen="toggleFullscreen"
      @click.stop
    />

    <!-- Presenter Mode Link -->
    <NuxtLink
      :to="`/p/${slug}/presenter`"
      class="absolute top-4 right-4 p-2 bg-black/50 rounded-lg text-white opacity-0 hover:opacity-100 transition-opacity"
      title="Presenter Mode"
      @click.stop
    >
      <span class="i-carbon-presenter-mode text-lg" />
    </NuxtLink>
  </div>
</template>
