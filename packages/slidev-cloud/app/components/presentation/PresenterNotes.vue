<script setup lang="ts">
const props = defineProps<{
  note?: string
}>()

const hasNote = computed(() => !!props.note?.trim())
</script>

<template>
  <div class="presenter-notes h-full overflow-auto">
    <div v-if="hasNote" class="prose prose-sm dark:prose-invert max-w-none">
      <div v-html="note" />
    </div>
    <div v-else class="text-gray-400 dark:text-gray-500 text-sm italic">
      No speaker notes for this slide
    </div>
  </div>
</template>
