<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'

definePageMeta({
  middleware: 'auth',
})

const route = useRoute()
const id = route.params.id as string

// Fetch presentation
const { data: presentation, error } = await useFetch(`/api/presentations/${id}`)

if (error.value) {
  throw createError({ statusCode: 404, message: 'Presentation not found' })
}

const content = ref(presentation.value?.content || '')
const title = ref(presentation.value?.title || '')
const saving = ref(false)
const lastSaved = ref<Date | null>(null)

// Parse slides
const { parseMarkdown } = useSlideParser()
const parsedSlides = computed(() => parseMarkdown(content.value))

// Current slide index for preview
const currentSlide = ref(0)

// Watch for slide count changes and reset if needed
watch(parsedSlides, (slides) => {
  if (currentSlide.value >= slides.length) {
    currentSlide.value = Math.max(0, slides.length - 1)
  }
})

// Debounced auto-save
const debouncedSave = useDebounceFn(async () => {
  if (!content.value)
    return

  saving.value = true
  try {
    await $fetch(`/api/presentations/${id}`, {
      method: 'PUT',
      body: {
        title: title.value,
        content: content.value,
      },
    })
    lastSaved.value = new Date()
  }
  catch (error) {
    console.error('Failed to save:', error)
  }
  finally {
    saving.value = false
  }
}, 2000)

// Auto-save on content change
watch([content, title], () => {
  debouncedSave()
})

// Toggle publish
async function togglePublish() {
  try {
    const updated = await $fetch(`/api/presentations/${id}/publish`, {
      method: 'POST',
    })
    if (presentation.value) {
      presentation.value.isPublished = updated.isPublished
    }
  }
  catch (error) {
    console.error('Failed to toggle publish:', error)
  }
}

// Format last saved time
const lastSavedText = computed(() => {
  if (!lastSaved.value)
    return ''
  const diff = Date.now() - lastSaved.value.getTime()
  if (diff < 60000)
    return 'Saved just now'
  return `Saved ${Math.floor(diff / 60000)}m ago`
})

const config = useRuntimeConfig()
const publicUrl = computed(() => {
  return `${config.public.appUrl}/p/${presentation.value?.slug}`
})

async function copyLink() {
  await navigator.clipboard.writeText(publicUrl.value)
}
</script>

<template>
  <div class="h-screen flex flex-col bg-white dark:bg-gray-900">
    <!-- Toolbar -->
    <header class="h-14 border-b border-gray-200 dark:border-gray-700 flex items-center px-4 justify-between bg-white dark:bg-gray-800">
      <div class="flex items-center gap-4">
        <NuxtLink
          to="/dashboard"
          class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
        >
          <span class="i-carbon-arrow-left text-lg" />
        </NuxtLink>

        <input
          v-model="title"
          class="text-lg font-medium bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
          placeholder="Presentation Title"
        >
      </div>

      <div class="flex items-center gap-3">
        <!-- Save Status -->
        <span class="text-xs text-gray-500">
          <template v-if="saving">
            <span class="i-carbon-loading animate-spin mr-1" />
            Saving...
          </template>
          <template v-else-if="lastSavedText">
            {{ lastSavedText }}
          </template>
        </span>

        <!-- Slide Count -->
        <span class="text-sm text-gray-500 px-2">
          {{ parsedSlides.length }} slide{{ parsedSlides.length === 1 ? '' : 's' }}
        </span>

        <!-- Preview Link -->
        <NuxtLink
          v-if="presentation?.isPublished"
          :to="`/p/${presentation.slug}`"
          target="_blank"
          class="btn text-sm"
        >
          <span class="i-carbon-view mr-1" />
          View
        </NuxtLink>

        <!-- Copy Link -->
        <button
          v-if="presentation?.isPublished"
          class="btn text-sm"
          title="Copy link"
          @click="copyLink"
        >
          <span class="i-carbon-link" />
        </button>

        <!-- Publish Button -->
        <UiButton
          :variant="presentation?.isPublished ? 'default' : 'primary'"
          size="sm"
          @click="togglePublish"
        >
          <span :class="presentation?.isPublished ? 'i-carbon-view-off' : 'i-carbon-share'" class="mr-1" />
          {{ presentation?.isPublished ? 'Unpublish' : 'Publish' }}
        </UiButton>
      </div>
    </header>

    <!-- Split Editor -->
    <div class="flex-1 flex overflow-hidden">
      <!-- Markdown Editor -->
      <div class="w-1/2 border-r border-gray-200 dark:border-gray-700">
        <EditorMarkdownEditor v-model="content" />
      </div>

      <!-- Live Preview -->
      <div class="w-1/2">
        <EditorSlidePreview
          v-model:current-slide="currentSlide"
          :slides="parsedSlides"
        />
      </div>
    </div>
  </div>
</template>
