<script setup lang="ts">
import Header from './components/Header.vue';
import Hero from './components/Hero.vue'
import About from './components/About.vue';
import Contact from './components/Contact.vue';
import ProjectsSection from './components/ProjectsSection.vue';
import Sky from './components/Sky.vue';
import CardPuzzle from './components/CardPuzzle.vue';
import { ref, onMounted, watch } from 'vue'
import { projects } from './data/projects';
import { socialLinks } from './data/social-links';
import { contact } from './api/contact';
import { dummyCards } from './data/cards';

const isDark = ref(false)

const playGame = ref(false);

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

function startGame() {
  playGame.value = true;
  window.location.hash = '';
  window.location.hash = 'game';
}
</script>

<template>
  <div>
    <Sky :isDark="isDark" />
    <Header :isDark="isDark" @toggleTheme="toggleTheme" />
    <Hero :name="name" :role="role" :quote="quote" :imgSrc="imgSrc" :isDark="isDark" @toggleTheme="toggleTheme"
      @activate-game="startGame" />
    <main>
      <About @skillClick="findNearestProjectBySkill" />
      <ProjectsSection :projects="projects" @skillClick="findNearestProjectBySkill"
        githubUrl="https://github.com/QusaiAlbonni"></ProjectsSection>
      <Contact :socialLinks="socialLinks" email="albonniqusai@gmail.com" :sendEmail="contact" />
      <section id="game">
        <CardPuzzle v-if="playGame" :cards="dummyCards" />
      </section>
    </main>
  </div>
</template>
