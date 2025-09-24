<template>
  <section id="about" class="py-10 px-6 backdrop-blur-lg">
    <div
      v-reveal="{ threshold: 0.12, transition: 'transition-all duration-[1s] ease-out' }"
      class="max-w-4xl mx-auto p-8 "
    >
      <header class="text-center mb-6">
        <h2 class="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-gray-100">
          About me
        </h2>
        <p class="mt-2 text-sm md:text-base text-gray-600 dark:text-gray-200/90">
          {{ subtitle }}
        </p>
      </header>

      <div class="prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-gray-200 mb-6 text-center">
        <p>{{ bio }}</p>
      </div>

      <div class="prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-gray-200 mb-6 text-center">
        <p>click a skill to jump to projects.</p>
      </div>

      <div class="flex flex-wrap gap-3 justify-center">
        <button
          v-for="(s, _i) in skills"
          :key="s"
          type="button"
          @click="onSkillClick(s)"
          class="relative inline-flex items-center gap-2 px-3 py-1.5 rounded-md
                 text-gray-800 dark:text-gray-100
                 transition-colors duration-200
                 text-shadow-lg
                 hover:text-yellow-500 dark:hover:text-yellow-400
                 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300
                 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900
                 group bg-white/60 dark:bg-white/5"
        >
          <img :src="skillIconUrl(s)" :alt="s" class="w-5 h-5" loading="lazy" />
          <span class="text-sm font-medium">{{ s }}</span>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps({
  bio: { type: String, default: "Backend developer experienced in building scalable web applications with NestJS, TypeScript, and Django. Skilled in database design, high-performance APIs, asynchronous workflows, and real-time communication. Proficient in Python and JavaScript/TypeScript, with a focus on clean, modular architectures. Hands-on with Docker, CI/CD, and cloud platforms (Fly.io, Render, Railway, AWS). Passionate about delivering impactful, user-focused solutions in collaborative teams." },
  subtitle: { type: String, default: 'Backend / Fullstack • NodeJS + VueJS' },
  skills: {
    type: Array as () => string[],
    default: [
      'nestjs','nodejs','redis','django','python','aws','postgres','mysql','laravel', 'express',
      'cpp','java','html','css','js','ts','threejs','git','github','vscode','postman','unity','cs', 'vuejs'
    ]
  }
})

const emit = defineEmits<{
  (e: 'skillClick', skill: string): void
}>()

function onSkillClick(skill: string) {
  emit('skillClick', skill)
}

function skillIconUrl(skill: string) {
  const safe = encodeURIComponent(skill.trim())
  return `https://skillicons.dev/icons?i=${safe}`
}
</script>

<style>
.prose a {
  color: inherit;
}
</style>
