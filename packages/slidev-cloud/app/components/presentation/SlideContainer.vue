<script setup lang="ts">
import { useElementSize } from '@vueuse/core'

const props = defineProps<{
  width?: number
  isMain?: boolean
}>()

const container = ref<HTMLElement | null>(null)
const containerSize = useElementSize(container)

// Standard slide dimensions (16:9 aspect ratio)
const slideWidth = 980
const slideHeight = 552
const slideAspect = slideWidth / slideHeight

const width = computed(() => props.width ?? containerSize.width.value)
const height = computed(() => props.width ? props.width / slideAspect : containerSize.height.value)

const scale = computed(() => {
  if (width.value === 0 || height.value === 0)
    return 1
  return Math.min(width.value / slideWidth, height.value / slideHeight)
})

const contentStyle = computed(() => ({
  'height': `${slideHeight}px`,
  'width': `${slideWidth}px`,
  '--slidev-slide-scale': scale.value,
}))
</script>

<template>
  <div
    ref="container"
    class="slidev-slide-container relative w-full h-full overflow-hidden"
  >
    <div
      class="slidev-slide-content absolute left-1/2 top-1/2 overflow-hidden bg-white dark:bg-gray-900 shadow-2xl"
      :style="contentStyle"
      style="transform: translate(-50%, -50%) scale(var(--slidev-slide-scale));"
    >
      <slot />
    </div>
    <slot name="controls" />
  </div>
</template>
