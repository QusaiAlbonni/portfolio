<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'

const props = defineProps<{
  gallery: string[]
  title?: string
  startIndex?: number
  hideThumbnails?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:index', index: number): void
  (e: 'image-click', index: number): void
}>()

function onImageClick(index: number) {
  emit('image-click', index)
  goTo(index) // optional: still scroll to clicked image
}


const carousel = ref<HTMLElement | null>(null)
const slides = ref<HTMLElement[]>([])
const currentIndex = ref(props.startIndex ?? 0)

const total = computed(() => props.gallery?.length ?? 0)
const isFirst = computed(() => currentIndex.value <= 0)
const isLast = computed(() => currentIndex.value >= Math.max(0, total.value - 1))

let io: IntersectionObserver | null = null

function createObserver() {
  if (!carousel.value) return
  const opts: IntersectionObserverInit = {
    root: carousel.value,
    threshold: [0.55]
  }
  io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const idx = slides.value.indexOf(entry.target as HTMLElement)
        if (idx !== -1 && currentIndex.value !== idx) {
          currentIndex.value = idx
          emit('update:index', idx)
        }
      }
    })
  }, opts)

  slides.value.forEach((s) => io?.observe(s))
}

function disconnectObserver() {
  if (!io) return
  io.disconnect()
  io = null
}

function scrollToIndex(i: number) {
  if (!carousel.value) return
  const node = slides.value[i]
  if (!node) return
  node.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
}

function goTo(i: number) {
  const idx = Math.max(0, Math.min(total.value - 1, i))
  scrollToIndex(idx)
}

function prev() {
  if (isFirst.value) return
  goTo(currentIndex.value - 1)
}
function next() {
  if (isLast.value) return
  goTo(currentIndex.value + 1)
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowLeft') {
    e.preventDefault()
    prev()
  } else if (e.key === 'ArrowRight') {
    e.preventDefault()
    next()
  }
}

async function refreshSlides() {
  await nextTick()
  if (!carousel.value) return
  slides.value = Array.from(carousel.value.querySelectorAll<HTMLElement>('figure'))
  disconnectObserver()
  createObserver()
}

onMounted(() => {
  refreshSlides()
  window.addEventListener('resize', refreshSlides, { passive: true })
  if (carousel.value && !carousel.value.hasAttribute('tabindex')) {
    carousel.value.setAttribute('tabindex', '0')
  }
})

onBeforeUnmount(() => {
  disconnectObserver()
  window.removeEventListener('resize', refreshSlides)
})

watch(() => props.gallery, () => {
  refreshSlides()
})

watch(currentIndex, (n) => {
  emit('update:index', n)
})

defineExpose({ next, prev, goTo, currentIndex })

</script>

<template>
  <div class="gallery-carousel">
    <div class="relative">
      <button @click="prev" :disabled="isFirst" aria-label="Previous image"
        class="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/80 dark:bg-slate-800/80 shadow hover:scale-105 disabled:opacity-40">
        ‹
      </button>

      <button @click="next" :disabled="isLast" aria-label="Next image"
        class="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/80 dark:bg-slate-800/80 shadow hover:scale-105 disabled:opacity-40">
        ›
      </button>

      <div ref="carousel"
        class="carousel-viewport overflow-x-auto scroll-smooth snap-x snap-mandatory touch-pan-x -mx-4 px-4 py-6"
        @keydown="onKeydown" role="region" :aria-label="title ? `Image gallery for ${title}` : 'Image gallery'">
        <div class="flex gap-4">
          <figure v-for="(src, i) in gallery" :key="src + '-' + i"
            class="snap-center flex-shrink-0 w-[min(80vw,900px)] max-w-full rounded-lg overflow-hidden shadow-md bg-gray-100 dark:bg-slate-800"
            style="scroll-snap-align:center" aria-hidden="false">
            <img :src="src" :alt="title ? `${title} — image ${i + 1}` : `Image ${i + 1}`"
              class="w-full h-[60vh] object-contain cursor-zoom-in" loading="lazy" @click="onImageClick(i)" />
          </figure>
        </div>
      </div>
    </div>

    <div v-if="gallery && gallery.length > 1" class="mt-4 flex items-center gap-2 overflow-x-auto py-2">
      <button v-for="(src, i) in gallery" :key="src + '-thumb-' + i" @click="goTo(i)" :aria-pressed="currentIndex === i"
        class="flex-none w-20 h-12 rounded-md overflow-hidden border-2 focus:outline-none"
        :class="currentIndex === i ? 'border-sky-500' : 'border-transparent'">
        <img :src="src" :alt="`Thumbnail ${i + 1}`" class="w-full h-full object-cover" loading="lazy" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.carousel-viewport {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.carousel-viewport::-webkit-scrollbar {
  display: none;
}

@media (max-width: 640px) {
  .carousel-viewport figure img {
    height: 48vw;
  }
}
</style>
