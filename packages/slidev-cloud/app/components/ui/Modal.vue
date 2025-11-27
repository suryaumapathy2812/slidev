<script setup lang="ts">
interface Props {
  open: boolean
  title?: string
}

defineProps<Props>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

function handleBackdropClick(event: MouseEvent) {
  if (event.target === event.currentTarget) {
    emit('close')
  }
}

// Close on escape key
onKeyStroke('Escape', () => emit('close'))
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-200"
      leave-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div
        v-if="open"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
        @click="handleBackdropClick"
      >
        <div class="card max-w-md w-full mx-4 p-6">
          <div v-if="title" class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold">
              {{ title }}
            </h2>
            <button
              class="btn-icon"
              @click="emit('close')"
            >
              <span class="i-carbon-close" />
            </button>
          </div>
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
