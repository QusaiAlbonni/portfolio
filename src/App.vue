<script setup lang="ts">
import Header from './components/Header.vue';
import Hero from './components/Hero.vue'
import About from './components/About.vue';
import ProjectsSection from './components/ProjectsSection.vue';
import { ref, onMounted, watch } from 'vue'
import { projects } from './data/projects';

const isDark = ref(false)

const name = 'Qusay Albonni'
const role = 'Backend dev'
const quote = 'Ship fast. Learn faster.'
const imgSrc = '/pfp.jpg'

onMounted(() => {
  const saved = localStorage.getItem('theme')
  if (saved) {
    isDark.value = saved === 'dark'
    updateBodyClass()
  }
})

watch(isDark, () => {
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
  updateBodyClass()
})

function toggleTheme() {
  isDark.value = !isDark.value
}

function findNearestProjectBySkill(skill: string) {
  window.location.hash = '';
  const projectId: string | null = projects.find(project => project.skills.includes(skill))?.id ?? null;
  if (!projectId) {
    window.location.hash = "more"
    return
  }
  window.location.hash = projectId;
}

function updateBodyClass() {
  const html = document.documentElement
  if (isDark.value) html.classList.add('dark')
  else html.classList.remove('dark')
}
</script>

<template>
  <div>
    <Header :isDark="isDark" @toggleTheme="toggleTheme" />
    <Hero :name="name" :role="role" :quote="quote" :imgSrc="imgSrc" :isDark="isDark" @toggleTheme="toggleTheme" />
    <main class="">
      <About @skillClick="findNearestProjectBySkill"/>
      <ProjectsSection :projects="projects" @skillClick="findNearestProjectBySkill" githubUrl="https://github.com/QusaiAlbonni"></ProjectsSection>
      <section
        class="h-screen bg-gradient-to-tr from-indigo-200 via-sky-200 to-cyan-200 flex items-center justify-center">
        <button class="px-6 py-3 rounded-lg bg-indigo-600 text-white shadow-lg hover:bg-indigo-500">
          Call to Action
        </button>
      </section>
    </main>

  </div>
</template>
