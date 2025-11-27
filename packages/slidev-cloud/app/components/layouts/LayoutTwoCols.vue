<script setup lang="ts">
defineProps<{
  class?: string
}>()
</script>

<template>
  <div class="slidev-layout two-cols w-full grid grid-cols-2">
    <div class="col-left pr-4" :class="$props.class">
      <slot />
    </div>
    <div class="col-right pl-4" :class="$props.class">
      <slot name="right" />
    </div>
  </div>
</template>
