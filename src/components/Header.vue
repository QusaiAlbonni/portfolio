<script setup lang="ts">
defineProps({
  isDark: Boolean
})
</script>

<template>
  <nav class="fixed top-0 left-0 w-full z-50
         flex items-center justify-between px-6 py-3
         bg-white/10 dark:bg-gray-800/10
         backdrop-blur-md
         isolate
        ">
    <div class="text-xl font-bold tracking-tight">
      <a href="#" class="inline-block -mt-0.5">
        <span class="bg-clip-text text-gray-800 dark:text-gray-100
                 transition-colors duration-200
                 text-shadow-lg
                 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900
                 group">
          Name
        </span>
      </a>
    </div>

    <ul class="flex items-center gap-6">
      <li v-for="(label, i) in ['about', 'projects', 'contact']" :key="i">
        <a :href="`#${label}`" class="relative inline-block px-1 py-1
                 text-gray-800 dark:text-gray-100
                 transition-colors duration-200
                 text-shadow-lg
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

      <li>
        <button @click="$emit('toggleTheme')" aria-label="Toggle theme" class="relative w-20 h-10 flex items-center rounded-full p-1 transition-all duration-400
                 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                 focus-visible:ring-yellow-300 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900
                 active:scale-95"
          :class="isDark ? 'bg-gray-800/80 shadow-inner' : 'bg-gradient-to-r from-yellow-300 to-yellow-400 shadow'">
          <div class="relative w-8 h-8 rounded-full shadow-md flex items-center justify-center
                   transition-transform duration-500"
            :class="isDark ? 'translate-x-10 bg-slate-800 text-yellow-300' : 'translate-x-0 bg-white text-yellow-500'">
            <!-- sun -->
            <span class="absolute transition-emoji pointer-events-none"
              :class="!isDark ? 'scale-large opacity-100' : 'scale-small opacity-0'" aria-hidden="true">☀️</span>

            <!-- moon -->
            <span class="absolute transition-emoji pointer-events-none"
              :class="isDark ? 'scale-large opacity-100' : 'scale-small opacity-0'" aria-hidden="true">🌙</span>
          </div>

          <span v-if="isDark" class="absolute -inset-0.5 rounded-full pointer-events-none blur-[6px] opacity-20"
            style="background: linear-gradient(90deg, rgba(255,223,93,0.08), rgba(99,102,241,0.06));"></span>
        </button>
      </li>
    </ul>
  </nav>
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
