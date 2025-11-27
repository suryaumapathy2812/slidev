<script setup lang="ts">
import type { ParsedSlide } from '~/composables/useSlideParser'

const props = defineProps<{
  slide: ParsedSlide
  renderedSlots: Record<string, string>
}>()

// Map layout names to components
const layoutMap: Record<string, any> = {
  'default': resolveComponent('LayoutsLayoutDefault'),
  'cover': resolveComponent('LayoutsLayoutCover'),
  'center': resolveComponent('LayoutsLayoutCenter'),
  'two-cols': resolveComponent('LayoutsLayoutTwoCols'),
  'section': resolveComponent('LayoutsLayoutSection'),
}

const currentLayout = computed(() => {
  return layoutMap[props.slide.layout] || layoutMap.default
})

const hasRightSlot = computed(() => {
  return props.slide.layout === 'two-cols' && props.renderedSlots.right
})
</script>

<template>
  <component
    :is="currentLayout"
    v-bind="slide.frontmatter"
    class="h-full"
  >
    <!-- Default slot content -->
    <div v-html="renderedSlots.default" />

    <!-- Right slot for two-cols layout -->
    <template v-if="hasRightSlot" #right>
      <div v-html="renderedSlots.right" />
    </template>
  </component>
</template>
