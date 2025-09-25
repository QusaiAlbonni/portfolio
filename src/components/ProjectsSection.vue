<template>
  <section id="projects" class="py-20 px-6">
    <div class="max-w-6xl mx-auto space-y-12">
      <header class="text-center">
        <h2 class="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-gray-100">Projects</h2>
        <p class="text-xs md:text-lg text-gray-600 dark:text-gray-400">Click on Details to view more info and app images.</p>
      </header>

      <div class="space-y-16">
        <section v-for="(p, _i) in projects" :key="p.id" :id="p.id" v-reveal.once="{ threshold: 0.12 }"
          class="scroll-mt-20">
          <ProjectCard :project="p" @skillClick="handleSkillClick" />
        </section>
      </div>

      <section id="more" class="pt-12" ref="moreRef" v-reveal.once>
        <div class="backdrop-blur-sm p-8 text-center">
          <h3 class="text-lg font-bold text-gray-900 dark:text-gray-100">...and more</h3>
          <p class="mt-2 text-sm text-gray-700 dark:text-gray-200/90">
            If you want to see more projects, check out my GitHub.
          </p>
          <a :href="githubUrl" target="_blank" rel="noopener noreferrer" class="inline-block mt-4 px-4 py-2 rounded-md
                   text-gray-800 dark:text-gray-100
                   hover:text-yellow-500 dark:hover:text-yellow-400
                   focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300
                   focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900
                   bg-white/60 dark:bg-white/5">
            View on GitHub
          </a>
        </div>
      </section>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Project } from '../types/project'
import { ref, toRefs, onMounted } from 'vue'
import ProjectCard from './ProjectCard.vue'

const props = defineProps<{
  projects: Project[]
  githubUrl?: string
  focusSkill?: string | null
}>()

const emit = defineEmits<{
  (e: 'skillNotFound', skill: string): void,
  (e: 'skillClick', skill: string): void
}>()

const { projects, githubUrl = 'https://github.com/yourname', focusSkill } = toRefs(props)

const moreRef = ref<HTMLElement | null>(null)

function handleSkillClick(skill: string) {
  emit('skillClick', skill)
}

onMounted(() => {
  if (focusSkill?.value && focusSkill.value) {
    setTimeout(() => emit('skillClick', focusSkill.value!))
  }
})
</script>
