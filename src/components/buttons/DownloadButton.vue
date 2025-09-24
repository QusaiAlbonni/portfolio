<template>
  <span class="inline-block w-full sm:w-auto" role="presentation">
    <a :href="href" download class="relative overflow-hidden inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold
             bg-vue-green text-slate-900
             shadow-md sm:shadow-lg
             w-full sm:w-auto
             transform transition-all duration-150
             hover:-translate-y-0.5 hover:scale-[1.02]
             focus:outline-none focus-visible:ring-4 focus-visible:ring-vue-green/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white
             dark:focus-visible:ring-offset-[#031024] sweep" :aria-label="ariaLabel" :aria-pressed="downloaded"
      @click.prevent="handleClick" @keydown.enter.prevent="handleClick">
      <span class="relative z-10 flex items-center gap-2">
        <svg v-if="!downloaded" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24"
          fill="currentColor" aria-hidden="true" role="img">
          <path
            d="M12 3a1 1 0 011 1v8.586l2.293-2.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L11 12.586V4a1 1 0 011-1z" />
          <path d="M5 20a1 1 0 011-1h12a1 1 0 110 2H6a1 1 0 01-1-1z" />
        </svg>

        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"
          aria-hidden="true" role="img">
          <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z" />
        </svg>

        <span class="leading-tight z-10">
          <span v-if="!downloaded">{{ text }}</span>
          <span v-else>{{ doneText }}</span>
        </span>
      </span>
    </a>
  </span>
</template>

<script setup lang="ts">
import { ref } from 'vue'


const props = defineProps({
  href: { type: String, default: '/resume.pdf' },
  text: { type: String, default: 'Download CV/Resume' },
  doneText: { type: String, default: 'Downloaded' },
  ariaLabel: { type: String, default: 'Download CV/Resume' },
  autoResetMs: { type: Number, default: 4000 }
})

const downloaded = ref(false)

function triggerNativeDownload(linkHref: string) {
  const a = document.createElement('a')
  a.href = linkHref
  a.setAttribute('download', '')
  document.body.appendChild(a)
  a.click()
  a.remove()
}

function handleClick() {
  if (downloaded.value) {
    return
  }

  triggerNativeDownload(props.href)

  downloaded.value = true

  if (props.autoResetMs && props.autoResetMs > 0) {
    setTimeout(() => {
      downloaded.value = false
    }, props.autoResetMs)
  }
}
</script>

<style scoped>
.bg-vue-green {
  background: linear-gradient(90deg, #42b883 0%, #3fb27f 100%);
}

.sweep::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 5;
  pointer-events: none;

  background: linear-gradient(90deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.18) 45%,
      rgba(255, 255, 255, 0.35) 55%,
      rgba(255, 255, 255, 0) 100%);
  transform: translateX(-120%);
  opacity: 0;
  transition: transform 520ms cubic-bezier(.2, .9, .2, 1), opacity 300ms;
}

.sweep:hover::before,
.sweep:focus-visible::before {
  transform: translateX(120%);
  opacity: 1;
}
</style>
