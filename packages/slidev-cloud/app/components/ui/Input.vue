<script setup lang="ts">
interface Props {
  modelValue: string
  type?: string
  placeholder?: string
  label?: string
  error?: string
  disabled?: boolean
}

const {
  type = 'text',
  modelValue,
  placeholder,
  label,
  error,
  disabled = false,
} = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const inputId = computed(() => `input-${Math.random().toString(36).slice(2)}`)
</script>

<template>
  <div class="space-y-1">
    <label
      v-if="label"
      :for="inputId"
      class="block text-sm font-medium text-gray-700 dark:text-gray-300"
    >
      {{ label }}
    </label>
    <input
      :id="inputId"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      class="input w-full"
      :class="{ 'border-red-500 focus:ring-red-500': error }"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    >
    <p v-if="error" class="text-sm text-red-500">
      {{ error }}
    </p>
  </div>
</template>
