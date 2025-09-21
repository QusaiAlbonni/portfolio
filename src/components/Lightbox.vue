<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  images: string[]
  modelValue: boolean
  startIndex?: number
  overlay?: boolean
  blurBackground?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const currentIndex = ref(props.startIndex ?? 0)

watch(() => props.startIndex, (val) => {
  if (val !== undefined) currentIndex.value = val
})

function close() {
  emit('update:modelValue', false)
}

function prev() {
  if (currentIndex.value > 0) currentIndex.value--
}
function next() {
  if (currentIndex.value < props.images.length - 1) currentIndex.value++
}
</script>

<template>
  <transition name="lightbox-fade" appear>
    <div v-if="modelValue" :class="overlay ? 'fixed inset-0 z-[9999]' : ''">

      <div v-if="overlay"
        :class="blurBackground ? 'absolute inset-0 bg-black/60 backdrop-blur-md' : 'absolute inset-0 bg-black/40'"
        @click="close">
      </div>

      <div class="relative z-10 grid place-items-center h-full w-full">

        <transition name="lightbox-slide" mode="out-in">
          <img :key="currentIndex" :src="images[currentIndex]"
            class="max-w-[90vw] max-h-[90vh] object-contain rounded-md shadow-lg" />
        </transition>

        <button @click.stop="prev" :disabled="currentIndex === 0"
          class="absolute left-4 top-1/2 -translate-y-1/2 text-white text-4xl select-none">
          ‹
        </button>

        <button @click.stop="next" :disabled="currentIndex === images.length - 1"
          class="absolute right-4 top-1/2 -translate-y-1/2 text-white text-4xl select-none">
          ›
        </button>

        <button @click="close" class="absolute top-4 right-4 text-white text-2xl bg-black/40 rounded-full px-2 py-1">
          ✕
        </button>

      </div>

    </div>
  </transition>
</template>

<style scoped>
.lightbox-slide-enter-active,
.lightbox-slide-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.lightbox-slide-enter-from {
  opacity: 0;
  transform: translateX(20px);
}
.lightbox-slide-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>
