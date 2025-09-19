<script setup lang="ts">
import { ref } from 'vue';

defineProps({
  isDark: Boolean
});

const mobileOpen = ref(false);
function toggleMobile() { mobileOpen.value = !mobileOpen.value; }
</script>

<template>
  <nav class="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 py-3 h-14
           bg-white/10 dark:bg-gray-800/10 backdrop-blur-md isolate" role="navigation" aria-label="Main navigation">
    <div class="flex items-center gap-4 min-w-0">
      <a href="#" class="text-md md:text-xl font-bold tracking-tight flex-shrink-0 -mt-0.5">
        <span class="bg-clip-text text-gray-800 dark:text-gray-100 transition-colors duration-200 text-shadow-lg group">
          Portfolio 
        </span>
      </a>
    </div>

    <ul class="hidden md:flex items-center gap-6">
      <li v-for="(label, i) in ['about', 'projects', 'contact']" :key="i">
        <a :href="`#${label}`" class="relative inline-block px-1 py-1
                 text-gray-800 dark:text-gray-100 transition-colors duration-200 text-shadow-lg
                 hover:text-yellow-500 dark:hover:text-yellow-400
                 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900
                 group">
          <span class="uppercase text-sm tracking-wider drop-shadow-sm select-none">
            {{ label }}
          </span>

          <span class="absolute left-0 -bottom-1 w-full h-0.5 bg-yellow-500 dark:bg-yellow-400
                   transform scale-x-0 origin-left transition-transform duration-300
                   group-hover:scale-x-100"></span>
        </a>
      </li>
    </ul>

    <div class="flex items-center gap-4">
      <button
        @click="$emit('toggleTheme')"
        aria-label="Toggle theme"
        class="hidden md:inline-flex relative w-20 h-10 flex items-center rounded-full p-1 transition-all duration-400
               focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-yellow-300 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900
               active:scale-95 flex-shrink-0"
        :class="isDark ? 'bg-gray-950/80 shadow-inner' : 'bg-gradient-to-r from-yellow-300 to-yellow-400 shadow'">
        <div
          class="relative w-8 h-8 rounded-full shadow-md flex items-center justify-center transition-transform duration-500"
          :class="isDark ? 'translate-x-10 bg-slate-800 text-yellow-300' : 'translate-x-0 bg-white text-yellow-500'">
          <span class="absolute transition-emoji pointer-events-none"
            :class="!isDark ? 'scale-large opacity-100' : 'scale-small opacity-0'" aria-hidden="true">☀️</span>
          <span class="absolute transition-emoji pointer-events-none"
            :class="isDark ? 'scale-large opacity-100' : 'scale-small opacity-0'" aria-hidden="true">🌙</span>
        </div>

        <span v-if="isDark" class="absolute -inset-0.5 rounded-full pointer-events-none blur-[6px] opacity-20"
          style="background: linear-gradient(90deg, rgba(255,223,93,0.08), rgba(99,102,241,0.06));"></span>
      </button>

      <button
        @click="$emit('toggleTheme')"
        aria-label="Toggle theme"
        class="inline-flex md:hidden items-center justify-center w-10 h-10 rounded-full transition-all duration-300
               focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-yellow-300 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900
               flex-shrink-0"
        :class="isDark ? 'bg-slate-900 text-yellow-300 shadow' : 'bg-yellow-50 text-yellow-500 shadow'">
        <span class="text-lg">{{isDark ? '🌙' : '☀️'}}</span>
      </button>

      <button
        class="md:hidden inline-flex items-center justify-center p-2 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300"
        :aria-expanded="mobileOpen" aria-controls="mobile-menu" @click="toggleMobile"
        aria-label="Toggle navigation">
        <svg v-if="!mobileOpen" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
          stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
          stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </nav>

  <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0 -translate-y-2"
    enter-to-class="opacity-100 translate-y-0" leave-active-class="transition duration-150 ease-in"
    leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 -translate-y-2">
    <div v-show="mobileOpen" id="mobile-menu" class="md:hidden mt-14 fixed z-10 w-full">
      <div class="px-4 pb-4 bg-white/10 dark:bg-gray-800/10 backdrop-blur-md shadow-sm rounded-b-md ">
        <ul class="flex flex-col gap-2">
          <li v-for="(label, i) in ['about', 'projects', 'contact']" :key="'m-' + i">
            <a @click="mobileOpen = false" :href="`#${label}`"
              class="block px-3 py-2 rounded-md text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-slate-800 transition">
              <span class="uppercase text-sm tracking-wider select-none">{{ label }}</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </Transition>

</template>

<style scoped>
.transition-emoji {
  transition: all 0.45s cubic-bezier(.2, .9, .3, 1);
  will-change: transform, opacity;
  font-size: 1.05rem;
}

.scale-small {
  transform: scale(.55) rotate(-30deg);
  opacity: 0;
}

.scale-large {
  transform: scale(1) rotate(0deg);
  opacity: 1;
}
</style>
