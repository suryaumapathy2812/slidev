<script setup lang="ts">
const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const editorRef = ref<HTMLTextAreaElement | null>(null)

// Handle tab key for indentation
function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Tab') {
    e.preventDefault()
    const target = e.target as HTMLTextAreaElement
    const start = target.selectionStart
    const end = target.selectionEnd

    const newValue = `${props.modelValue.substring(0, start)}  ${props.modelValue.substring(end)}`
    emit('update:modelValue', newValue)

    // Restore cursor position
    nextTick(() => {
      target.selectionStart = target.selectionEnd = start + 2
    })
  }
}
</script>

<template>
  <div class="h-full flex flex-col bg-gray-900">
    <div class="px-4 py-2 border-b border-gray-700 text-sm text-gray-400">
      Markdown
    </div>
    <textarea
      ref="editorRef"
      :value="modelValue"
      class="flex-1 w-full p-4 bg-gray-900 text-gray-100 font-mono text-sm resize-none focus:outline-none leading-relaxed"
      placeholder="Start writing your slides..."
      spellcheck="false"
      @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
      @keydown="handleKeydown"
    />
  </div>
</template>
