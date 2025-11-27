<script setup lang="ts">
const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'create', title: string): void
}>()

const title = ref('')
const loading = ref(false)

function handleSubmit() {
  if (!title.value.trim())
    return
  loading.value = true
  emit('create', title.value.trim())
}

// Reset form when modal opens
watch(() => props.open, (isOpen) => {
  if (isOpen) {
    title.value = ''
    loading.value = false
  }
})
</script>

<template>
  <UiModal :open="open" title="New Presentation" @close="emit('close')">
    <form class="space-y-4" @submit.prevent="handleSubmit">
      <UiInput
        v-model="title"
        label="Title"
        placeholder="My Awesome Presentation"
        :disabled="loading"
      />

      <div class="flex justify-end gap-2 pt-2">
        <UiButton
          type="button"
          variant="ghost"
          :disabled="loading"
          @click="emit('close')"
        >
          Cancel
        </UiButton>
        <UiButton
          type="submit"
          variant="primary"
          :loading="loading"
          :disabled="!title.trim()"
        >
          Create
        </UiButton>
      </div>
    </form>
  </UiModal>
</template>
