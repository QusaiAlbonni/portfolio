<template>
  <section id="hero" class="min-h-screen flex items-center justify-center">
    <div
      v-reveal.once="{ threshold: 0.15 }"
      class="w-full text-center py-12
             bg-white/60 dark:bg-[#041028]/80
             shadow-lg"
    >
      <div class="flex justify-center -mt-16">
        <div
          class="relative rounded-full ring-4 ring-white dark:ring-slate-900
                 overflow-hidden w-40 h-40 md:w-68 md:h-68 shadow-xl"
        >
          <img :src="imgSrc" :alt="name" class="w-full h-full object-cover" loading="lazy" />
        </div>
      </div>

      <h1 class="mt-6 text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-gray-100">
        {{ name }}
      </h1>

      <p class="mt-2 text-lg md:text-xl font-medium text-gray-700 dark:text-gray-300">
        {{ role }}
      </p>

      <p class="mt-4 max-w-prose mx-auto text-sm md:text-base text-gray-600 dark:text-gray-200/90 italic">
        {{ quote }}
      </p>

      <div class="mt-6 flex items-center justify-center gap-4">
        <a
          href="#projects"
          class="relative inline-block px-3 py-2
                 text-gray-800 dark:text-gray-100
                 transition-colors duration-200
                 text-shadow-lg
                 hover:text-yellow-500 dark:hover:text-yellow-400
                 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300
                 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900
                 group rounded-md"
        >
          See my work
        </a>

        <button
          @click="$emit('toggleTheme')"
          class="px-3 py-2 rounded-md text-sm
                 bg-gray-100 dark:bg-gray-800/70
                 text-gray-800 dark:text-gray-100
                 hover:brightness-95 transition"
        >
          {{ isDark ? '☀️ Light' : '🌙 Dark' }}
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">

 defineProps({
  name: { type: String, default: 'Your Name' },
  role: { type: String, default: 'Frontend Developer' },
  quote: { type: String, default: 'A small word of wisdom or a personal tagline.' },
  imgSrc: { type: String, default: '/avatar.jpg' },
  isDark: { type: Boolean, default: false }
})

</script>

<style>
.text-shadow-lg {
  text-shadow: 0 6px 18px rgba(2,6,23,0.08);
}
</style>
