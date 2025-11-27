<script setup lang="ts">
interface Presentation {
  id: string
  title: string
  slug: string
  isPublished: boolean
  slideCount: number
  createdAt: string
  updatedAt: string
}

const props = defineProps<{
  presentation: Presentation
}>()

const emit = defineEmits<{
  (e: 'delete', id: string): void
  (e: 'publish', id: string): void
}>()

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

const config = useRuntimeConfig()
const publicUrl = computed(() => {
  return `${config.public.appUrl}/p/${props.presentation.slug}`
})

async function copyLink() {
  await navigator.clipboard.writeText(publicUrl.value)
}
</script>

<template>
  <div class="card p-4 hover:shadow-md transition-shadow">
    <div class="flex items-start justify-between mb-3">
      <div class="flex-1 min-w-0">
        <NuxtLink
          :to="`/edit/${presentation.id}`"
          class="text-lg font-semibold hover:text-blue-500 truncate block"
        >
          {{ presentation.title }}
        </NuxtLink>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {{ presentation.slideCount }} slide{{ presentation.slideCount === 1 ? '' : 's' }}
        </p>
      </div>
      <span
        v-if="presentation.isPublished"
        class="px-2 py-1 text-xs bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 rounded-full"
      >
        Published
      </span>
    </div>

    <p class="text-xs text-gray-400 mb-4">
      Updated {{ formatDate(presentation.updatedAt) }}
    </p>

    <div class="flex items-center gap-2">
      <NuxtLink
        :to="`/edit/${presentation.id}`"
        class="btn text-sm flex-1 text-center"
      >
        <span class="i-carbon-edit mr-1" />
        Edit
      </NuxtLink>

      <button
        v-if="presentation.isPublished"
        class="btn text-sm"
        title="Copy link"
        @click="copyLink"
      >
        <span class="i-carbon-link" />
      </button>

      <button
        class="btn text-sm"
        :title="presentation.isPublished ? 'Unpublish' : 'Publish'"
        @click="emit('publish', presentation.id)"
      >
        <span :class="presentation.isPublished ? 'i-carbon-view-off' : 'i-carbon-share'" />
      </button>

      <button
        class="btn text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
        title="Delete"
        @click="emit('delete', presentation.id)"
      >
        <span class="i-carbon-trash-can" />
      </button>
    </div>
  </div>
</template>
