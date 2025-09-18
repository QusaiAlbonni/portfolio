<template>
  <div
    v-reveal.once="{
      initial,
      enter,
      transition,
      threshold
    }"
    :class="containerClass"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">

const props = defineProps({
  initial: { type: String, default: 'opacity-0 translate-y-6' },
  enter: { type: String, default: 'opacity-100 translate-y-0' },
  transition: { type: String, default: 'transition-all duration-700 ease-out' },
  threshold: { type: Number, default: 0.15 },
  containerClass: { type: String, default: '' }
})
</script>
