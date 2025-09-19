<template>
  <article
    class="bg-white/60 dark:bg-[#041028]/80 backdrop-blur-sm p-6 rounded-2xl shadow-md mx-auto"
    :aria-labelledby="`title-${project.id}`"
  >
    <header class="flex flex-col md:flex-row gap-6">
      <div class="w-full md:w-1/3 flex items-center justify-center">
        <img
          :src="project.img"
          :alt="project.title"
          class="w-full h-48 object-cover rounded-md"
          loading="lazy"
        />
      </div>

      <div class="flex-1">
        <h3 :id="`title-${project.id}`" class="text-xl font-bold text-gray-900 dark:text-gray-100">
          {{ project.title }}
        </h3>
        <p class="mt-2 text-sm text-gray-700 dark:text-gray-200/90">{{ project.description }}</p>

        <div class="mt-4 flex flex-wrap gap-2">
          <button
            v-for="skill in project.skills"
            :key="skill"
            type="button"
            class="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm
                   text-gray-800 dark:text-gray-100 transition-colors duration-200
                   hover:text-yellow-500 dark:hover:text-yellow-400
                   bg-white/50 dark:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300
                   focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900"
            @click="onSkillClick(skill)"
          >
            <img :src="skillIconUrl(skill)" class="w-4 h-4" :alt="skill" loading="lazy" />
            <span>{{ skill }}</span>
          </button>
        </div>
      </div>
    </header>
  </article>
</template>

<script setup lang="ts">
import type { Project } from '../types/project'
import { defineProps, defineEmits } from 'vue'

const props = defineProps<{ project: Project }>()

const emit = defineEmits<{
  (e: 'skillClick', skill: string): void
}>()

function onSkillClick(skill: string) {
  emit('skillClick', skill)
}

function skillIconUrl(skill: string) {
  return `https://skillicons.dev/icons?i=${encodeURIComponent(skill)}`
}
</script>
