<script setup lang="ts">
import Header from './components/Header.vue';
import Hero from './components/Hero.vue'
import { ref, onMounted, watch } from 'vue'

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

function updateBodyClass() {
  const html = document.documentElement
  if (isDark.value) html.classList.add('dark')
  else html.classList.remove('dark')
}
</script>

<template>
  <div>
    <Header :isDark="isDark" @toggleTheme="toggleTheme" />
    <Hero
      :name="name"
      :role="role"
      :quote="quote"
      :imgSrc="imgSrc"
      :isDark="isDark"
      @toggleTheme="toggleTheme"
    />
    <main class="min-h-screen space-y-32 pt-24">
      <section id= "about"
        class="h-screen bg-gradient-to-b from-pink-200 via-purple-200 to-blue-200 flex items-center justify-center">
        <h1 class="text-5xl font-bold text-gray-800 dark:text-gray-100">Hero Section</h1>
      </section>

      <section id= "projects"
        class="h-screen bg-gradient-to-r from-yellow-200 via-green-200 to-teal-200 flex items-center justify-center">
        <p class="text-xl text-gray-700 dark:text-gray-200">Scroll to see the navbar effect</p>
      </section>

      <section
        class="h-screen bg-gradient-to-tr from-indigo-200 via-sky-200 to-cyan-200 flex items-center justify-center">
        <button class="px-6 py-3 rounded-lg bg-indigo-600 text-white shadow-lg hover:bg-indigo-500">
          Call to Action
        </button>
      </section>
    </main>

  </div>
</template>
