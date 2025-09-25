<template>
  <section id="hero" class="min-h-screen flex items-center justify-center py-12 sm:py-20 md:py-32" aria-label="Hero">
    <div v-reveal.once="{ threshold: 0.15 }" class="relative w-full max-w-3xl text-center px-4 sm:px-6 md:px-8 py-10 sm:py-12
             bg-white/28 dark:bg-[#041028]/36
             backdrop-blur-md sm:backdrop-blur-md
             border border-white/16 dark:border-slate-800/28
             rounded-2xl
             shadow-lg sm:shadow-2xl
             overflow-visible" role="region" aria-labelledby="hero-heading">
      <svg class="pointer-events-none absolute -top-16 sm:-top-20 left-1/2 -translate-x-1/2
               w-64 h-64 sm:w-96 sm:h-96 md:w-[480px] md:h-[480px]
               opacity-20 dark:opacity-10 -z-10" viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true">
        <defs>
          <linearGradient id="g1" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stop-color="#ffd166" />
            <stop offset="1" stop-color="#ff9a9e" stop-opacity="0.6" />
          </linearGradient>
        </defs>
        <path
          d="M120,-150C156,-121,183,-83,188,-41C193,1,176,48,152,88C128,128,96,160,58,175C19,190,-27,187,-66,169C-105,151,-137,118,-160,78C-183,37,-197,-11,-177,-55C-158,-99,-106,-138,-58,-158C-10,-179,34,-181,74,-173C114,-165,84,-179,120,-150Z"
          transform="translate(300,300)" fill="url(#g1)" />
      </svg>

      <div class="flex justify-center -mt-16 sm:-mt-24">
        <div class="relative rounded-full overflow-hidden
                 w-28 h-28 sm:w-40 sm:h-40 md:w-72 md:h-72
                 shadow-md sm:shadow-xl" aria-hidden="false">
          <div class="absolute -inset-[1px] sm:-inset-[2px] md:-inset-[6px] rounded-full p-[1px]
                   bg-gradient-to-tr from-yellow-400 via-pink-400 to-violet-500" aria-hidden="true"></div>

          <div class="relative rounded-full overflow-hidden w-full h-full bg-slate-100 dark:bg-slate-900">
            <img :src="imgSrc" :alt="name" class="w-full h-full object-cover transform transition-transform duration-500 ease-out
                     hover:scale-105" loading="lazy" decoding="async" />
            <div class="absolute inset-0 bg-gradient-to-b from-transparent to-black/6 dark:to-black/20"></div>
          </div>
        </div>
      </div>

      <h1 id="hero-heading"
        class="mt-4 text-2xl sm:text-3xl md:text-5xl font-extrabold leading-tight text-gray-900 dark:text-gray-100">
        {{ name }}
      </h1>

      <p class="mt-1 text-sm sm:text-base md:text-lg font-medium text-gray-600 dark:text-gray-300">
        {{ role }}
      </p>

      <p
        class="mt-3 sm:mt-4 max-w-prose mx-auto text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-200/90 italic">
        {{ quote }}
      </p>
      <DownloadButton class="my-3"></DownloadButton>

      <div class=" sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
        <a href="#projects"
          class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold
                 bg-gradient-to-r from-yellow-400 to-orange-500 text-slate-900
                 shadow-md sm:shadow-lg
                 transform transition-all duration-150
                 hover:-translate-y-0.5 hover:scale-[1.02]
                 focus:outline-none focus-visible:ring-4 focus-visible:ring-yellow-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#031024]"
          aria-label="See my work">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"
            aria-hidden="true">
            <path fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11V5a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0V9h2a1 1 0 100-2h-2z"
              clip-rule="evenodd" />
          </svg>
          See my work
        </a>

        <a href="#contact"
          class="w-full sm:w-auto px-4 py-2 rounded-md text-sm font-medium
                 bg-white/60 dark:bg-slate-800/72
                 hover:text-yellow-500 dark:hover:text-yellow-400
                 text-gray-800 dark:text-gray-100
                 hover:brightness-95 transition
                 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#031024]"
          aria-label="Contact">
          Contact
        </a>

        <button @click="$emit('toggleTheme')" class="w-full sm:w-auto px-4 py-2 rounded-md text-sm
                 bg-white/50 dark:bg-slate-800/60
                 text-gray-800 dark:text-gray-100
                 hover:brightness-95 transition" aria-pressed="false">
          {{ isDark ? '☀️ Light' : '🌙 Dark' }}
        </button>
      </div>
      <p class="mt-3 sm:mt-4 max-w-prose mx-auto text-xs sm:text-xs md:text-xs text-gray-600 dark:text-gray-200/90 italic underline hover:cursor-pointer hover:text-yellow-500"
        @click="$emit('activate-game')">
        Idk, I just wanna play a game.
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import DownloadButton from './buttons/DownloadButton.vue';

defineProps({
  name: { type: String, default: 'Your Name' },
  role: { type: String, default: 'Frontend Developer' },
  quote: { type: String, default: 'A small word of wisdom or a personal tagline.' },
  imgSrc: { type: String, default: '/avatar.jpg' },
  isDark: { type: Boolean, default: false },
})
defineEmits<{
  (e: 'activate-game'): void,
  (e: 'toggleTheme'): void
}>();
</script>

<style>
@media (prefers-reduced-motion: reduce) {
  .hover\:scale-105 {
    transform: none !important;
  }

  .hover\:-translate-y-0\.5,
  .hover\:scale-\[1\.02\],
  .transition-all,
  .transition-transform {
    transition: none !important;
  }
}

.pointer-events-none {
  pointer-events: none;
}

.text-shadow-lg {
  text-shadow: 0 6px 18px rgba(2, 6, 23, 0.06);
}
</style>
