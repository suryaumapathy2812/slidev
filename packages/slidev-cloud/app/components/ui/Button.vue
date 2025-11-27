<script setup lang="ts">
interface Props {
  variant?: 'default' | 'primary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'md',
  disabled: false,
  loading: false,
})

const classes = computed(() => {
  const base = 'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    default: 'btn',
    primary: 'btn-primary',
    ghost: 'hover:bg-gray-100 dark:hover:bg-gray-800',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm rounded-md',
    md: 'px-4 py-2 text-sm rounded-lg',
    lg: 'px-6 py-3 text-base rounded-lg',
  }

  return [base, variants[props.variant], sizes[props.size]]
})
</script>

<template>
  <button
    :class="classes"
    :disabled="disabled || loading"
  >
    <span v-if="loading" class="i-carbon-loading animate-spin mr-2" />
    <slot />
  </button>
</template>
