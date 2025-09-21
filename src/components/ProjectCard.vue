<script setup lang="ts">
import GalleryCarousel from './GalleryCarousel.vue';
import { ref, onMounted, onBeforeUnmount, computed, watch, nextTick } from 'vue'
import type { Project } from '../types/project'
import Lightbox from './Lightbox.vue'

const props = defineProps<{ project: Project }>()
const emit = defineEmits<{ (e: 'skillClick', skill: string): void }>()
const root = ref<HTMLElement | null>(null)
const isVisible = ref(false)
const showDetails = ref(false)
const imgStyle = ref<Record<string, string>>({})
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

function onSkillClick(skill: string) {
  emit('skillClick', skill)
}

function openDetails() { showDetails.value = true }
function closeDetails() { showDetails.value = false }

function skillIconUrl(skill: string) {
  return `https://skillicons.dev/icons?i=${encodeURIComponent(skill)}`
}

function hashToColor(str: string) {
  let h = 0
  for (let i = 0; i < str.length; i++) h = (h << 5) - h + str.charCodeAt(i)
  const hue = Math.abs(h) % 360
  return `hsl(${hue} 70% 60% / .18)`
}
function chipBg(skill: string) {
  return hashToColor(skill)
}


const truncatedDescription = computed(() =>
  props.project.description.length > 120
    ? props.project.description.slice(0, 120) + '…'
    : props.project.description
)

let observer: IntersectionObserver | null = null
onMounted(() => {
  if (!root.value) return
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          isVisible.value = true
          if (observer && root.value) observer.unobserve(root.value)
        }
      })
    },
    { threshold: 0.15 }
  )
  observer.observe(root.value)
})
onBeforeUnmount(() => {
  if (observer && root.value) observer.unobserve(root.value)
})

function onPointerMove(e: PointerEvent) {
  if (prefersReducedMotion) return
  const el = (e.currentTarget as HTMLElement)
  const rect = el.getBoundingClientRect()
  const rx = ((e.clientX - rect.left) / rect.width - 0.5) * 8
  const ry = ((e.clientY - rect.top) / rect.height - 0.5) * -8
  imgStyle.value = {
    transform: `rotateX(${ry}deg) rotateY(${rx}deg) scale(1.03)`
  }
}
function onPointerLeave() {
  imgStyle.value = { transform: 'none' }
}
const dialog = ref<HTMLElement | null>(null)
const backdrop = ref<HTMLElement | null>(null)
const closeBtn = ref<HTMLElement | null>(null)
let previouslyFocused: Element | null = null

watch(showDetails, async (open) => {
  if (open) {
    previouslyFocused = document.activeElement
    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'

    await nextTick()
    if (closeBtn.value) {
      closeBtn.value.focus()
    } else if (dialog.value) {
      dialog.value.focus()
    }

    window.addEventListener('keydown', onWindowKeydown)
  } else {
    document.documentElement.style.overflow = ''
    document.body.style.overflow = ''
    if (previouslyFocused && (previouslyFocused as HTMLElement).focus) {
      (previouslyFocused as HTMLElement).focus()
    }
    window.removeEventListener('keydown', onWindowKeydown)
  }
})

onBeforeUnmount(() => {
  document.documentElement.style.overflow = ''
  document.body.style.overflow = ''
  window.removeEventListener('keydown', onWindowKeydown)
})

function onWindowKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    e.preventDefault()
    closeDetails()
  }
}

function onDialogKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    e.preventDefault()
    closeDetails()
    return
  }

  if (e.key === 'Tab') {
    const rootEl = dialog.value as HTMLElement | null
    if (!rootEl) return

    const focusable = Array.from(
      rootEl.querySelectorAll<HTMLElement>(
        'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable]'
      )
    ).filter((el) => el.offsetParent !== null) // visible

    if (focusable.length === 0) {
      e.preventDefault()
      return
    }

    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    const active = document.activeElement as HTMLElement | null

    if (!e.shiftKey && active === last) {
      e.preventDefault()
      first.focus()
    } else if (e.shiftKey && active === first) {
      e.preventDefault()
      last.focus()
    }
  }
}

const lightboxOpen = ref(false)
const lightboxStartIndex = ref(0)

function onGalleryImageClick(index: number) {
  lightboxStartIndex.value = index
  lightboxOpen.value = true
}

</script>

<template>
  <article :aria-labelledby="`title-${project.id}`" class="mx-auto p-6 rounded-2xl shadow-md bg-white/60 dark:bg-[#041028]/80 backdrop-blur-sm transition-transform duration-300 transform will-change-transform
           focus-within:scale-101 hover:scale-101" :class="{
            'opacity-0 translate-y-6': !isVisible,
            'opacity-100 translate-y-0': isVisible
          }" ref="root" role="article">
    <header class="flex flex-col md:flex-row gap-6">
      <div class="w-full md:w-1/3 flex items-center justify-center">
        <div class="w-full h-48 rounded-md overflow-hidden bg-gray-100 dark:bg-slate-800 relative"
          :style="{ perspective: prefersReducedMotion ? 'none' : '1000px' }">
          <img :src="project.img" :alt="project.title"
            class="w-full h-full object-cover transition-transform duration-400 transform will-change-transform group-hover:scale-105"
            loading="lazy" @pointermove="onPointerMove" @pointerleave="onPointerLeave" :style="imgStyle" />
        </div>
      </div>

      <div class="flex-1">
        <h3 :id="`title-${project.id}`" class="text-xl font-bold text-gray-900 dark:text-gray-100">
          {{ project.title }}
        </h3>

        <p class="mt-2 text-sm text-gray-700 dark:text-gray-200/90">
          {{ truncatedDescription }}
          <button v-if="project.description.length > 120" @click="openDetails"
            class="ml-2 underline text-sm text-sky-600 dark:text-sky-400" aria-label="Read more about project">
            more
          </button>
        </p>

        <div class="mt-4 flex flex-wrap items-center gap-2">
          <button v-for="skill in project.skills" :key="skill" type="button" @click="onSkillClick(skill)" :title="skill"
            class="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium shadow-sm
                   focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300 focus-visible:ring-offset-2"
            :style="{ background: chipBg(skill) }">
            <img :src="skillIconUrl(skill)" :alt="skill" class="w-4 h-4" loading="lazy" />
            <span>{{ skill }}</span>
          </button>
        </div>

        <div class="mt-4 flex flex-col sm:flex-row gap-3">
          <a v-if="project.demoUrl" :href="project.demoUrl" target="_blank" rel="noopener noreferrer"
            class="w-full sm:w-auto px-4 py-3 rounded-md text-base font-medium bg-yellow-300 text-slate-900 hover:bg-yellow-400 transition">Live
            Demo</a>

          <a v-if="project.repoUrl" :href="project.repoUrl" target="_blank" rel="noopener noreferrer"
            class="w-full sm:w-auto px-4 py-3 rounded-md text-base font-medium border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-900 transition">Source</a>

          <button @click="openDetails"
            class="w-full sm:w-auto px-4 py-3 rounded-md text-base font-medium text-sky-700 dark:text-sky-300">
            Details
          </button>
        </div>

      </div>
    </header>

    <teleport to="body">
      <div v-if="showDetails" class="fixed inset-0 z-[9999] grid place-items-center p-4">
        <div ref="backdrop" @click.self="closeDetails" class="absolute inset-0 bg-transparent backdrop-blur-md"
          aria-hidden="true"></div>

        <section ref="dialog" role="dialog" aria-modal="true" :aria-labelledby="`title-${project.id}`" class="relative z-[10000] w-[min(90vw,1100px)] h-[min(85vh,900px)] max-w-full max-h-[95vh]
             bg-white/80 dark:bg-slate-900/80 rounded-xl p-6 shadow-xl overflow-auto backdrop-blur-xl
             border border-white/20 dark:border-slate-700 focus:outline-none" tabindex="-1" @keydown="onDialogKeydown">
          <header class="flex items-start justify-between gap-4">
            <h4 :id="`title-${project.id}`" class="text-lg font-semibold">{{ project.title }}</h4>
            <button ref="closeBtn" @click="closeDetails" class="text-sm text-slate-600 dark:text-slate-300">
              Close
            </button>
          </header>

          <div class="mt-4 text-sm text-slate-700 dark:text-slate-200">
            <p>{{ project.description }}</p>

            <div class="mt-4">
              <h5 class="font-medium mb-2">Skills</h5>
              <div class="flex flex-wrap gap-2">
                <span v-for="s in project.skills" :key="s + '-md'"
                  class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium"
                  :style="{ background: chipBg(s) }">
                  <img :src="skillIconUrl(s)" :alt="s" class="w-4 h-4" />
                  {{ s }}
                </span>
              </div>
            </div>

            <div v-if="project.longNotes" class="mt-4">
              <h5 class="font-medium mb-2">Notes</h5>
              <p class="text-sm">{{ project.longNotes }}</p>
            </div>
          </div>
          <GalleryCarousel ref="galleryRef" :gallery="project.gallery ?? []" @image-click="onGalleryImageClick" />

        </section>
      </div>
      <Lightbox :images="project.gallery ?? []" v-model="lightboxOpen" :startIndex="lightboxStartIndex"
        :overlay="true" />
    </teleport>
  </article>
</template>

<style scoped>
@media (prefers-reduced-motion: reduce) {
  .transition-transform {
    transition: none !important;
  }
}
</style>
