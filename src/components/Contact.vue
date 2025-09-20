<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { SocialLinks } from '../types/social-links';
import type { Email } from '../types/email';

const props = defineProps<{
  socialLinks?: SocialLinks
  email?: string
  sendEmail?: (payload: Email) => Promise<void>
}>()

const emit = defineEmits<{
  (e: 'sent'): void
  (e: 'error', err: unknown): void
  (e: 'openMailClient'): void
}>()

const socialLinks = props.socialLinks ?? {
  linkedin: 'https://linkedin.com',
  twitter: 'https://twitter.com',
  instagram: 'https://instagram.com'
}
const email = props.email ?? 'you@example.com'

const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: '',
  honeypot: ''
})

const sending = ref(false)
const statusMessage = ref('')

function skillIconUrl(name: string) {
  return `https://skillicons.dev/icons?i=${encodeURIComponent(name)}`
}

function validate() {
  if (form.honeypot && form.honeypot.trim() !== '') return { ok: false, reason: 'spam' }
  if (!form.name.trim()) return { ok: false, reason: 'missing name' }
  if (!form.email.trim()) return { ok: false, reason: 'missing email' }
  if (!/^\S+@\S+\.\S+$/.test(form.email)) return { ok: false, reason: 'invalid email' }
  if (!form.message.trim()) return { ok: false, reason: 'missing message' }
  return { ok: true }
}

function openMailClient() {
  const subject = encodeURIComponent(form.subject || `Hello from portfolio`)
  const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`)
  const mailto = `mailto:${email}?subject=${subject}&body=${body}`
  emit('openMailClient')
  window.location.href = mailto
}

async function onSubmit() {
  statusMessage.value = ''
  const v = validate()
  if (!v.ok) {
    statusMessage.value = `Can't send: ${v.reason}`
    return
  }

  if (props.sendEmail) {
    sending.value = true
    try {
      await props.sendEmail({
        name: form.name.trim(),
        email: form.email.trim(),
        subject: form.subject.trim(),
        message: form.message.trim()
      })
      sending.value = false
      statusMessage.value = 'Message sent. Thanks!'
      emit('sent')
      form.name = form.email = form.subject = form.message = ''
    } catch (err) {
      sending.value = false
      statusMessage.value = 'Failed to send — try again or open mail client.'
      emit('error', err)
    }
    return
  }

  openMailClient()
}
</script>

<style>
.text-shadow-lg {
  text-shadow: 0 6px 18px rgba(2, 6, 23, 0.08);
}
</style>


<template>
  <section id="contact" class="py-20 px-6">
    <div v-reveal.once="{ threshold: 0.12 }"
      class="max-w-3xl mx-auto bg-white/60 dark:bg-[#041028]/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg">
      <header class="text-center mb-6">
        <h2 class="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-gray-100">
          Contact
        </h2>
        <p class="mt-2 text-sm md:text-base text-gray-600 dark:text-gray-200/90">
          Want to work together or ask a question? Say hi — I reply within a few days.
        </p>
      </header>

      <div class="flex flex-wrap gap-3 justify-center mb-6">
        <a v-for="(url, key) in socialLinks" :key="key" :href="url" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm
                 text-gray-800 dark:text-gray-100 transition-colors duration-200
                 hover:text-yellow-500 dark:hover:text-yellow-400
                 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300
                 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900
                 group bg-white/50 dark:bg-white/5">
          <img :src="skillIconUrl(key)" :alt="key" class="w-5 h-5" />
          <span class="font-medium">{{ key }}</span>
        </a>
      </div>

      <div class="border-t border-gray-200 dark:border-slate-700 my-6"></div>

      <form @submit.prevent="onSubmit" novalidate class="space-y-4" aria-label="Contact form">
        <input v-model="form.honeypot" type="text" class="hidden" tabindex="-1" autocomplete="off" />

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label class="block">
            <span class="sr-only">Name</span>
            <input v-model="form.name" type="text" name="name" placeholder="Your name" required
              class="w-full px-3 py-2 rounded-md border border-gray-200 dark:border-slate-700 bg-white/60 dark:bg-white/3 text-gray-800 dark:text-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300" />
          </label>

          <label class="block">
            <span class="sr-only">Email</span>
            <input v-model="form.email" type="email" name="email" placeholder="you@example.com" required
              class="w-full px-3 py-2 rounded-md border border-gray-200 dark:border-slate-700 bg-white/60 dark:bg-white/3 text-gray-800 dark:text-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300" />
          </label>
        </div>

        <label class="block">
          <input v-model="form.subject" type="text" name="subject" placeholder="Subject"
            class="w-full px-3 py-2 rounded-md border border-gray-200 dark:border-slate-700 bg-white/60 dark:bg-white/3 text-gray-800 dark:text-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300" />
        </label>

        <label class="block">
          <textarea v-model="form.message" name="message" rows="6" placeholder="Write your message..." required
            class="w-full px-3 py-2 rounded-md border border-gray-200 dark:border-slate-700 bg-white/60 dark:bg-white/3 text-gray-800 dark:text-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300"></textarea>
        </label>

        <div class="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          <button :disabled="sending" type="submit" class="w-full md:w-auto inline-flex justify-center items-center gap-2 px-4 py-3 md:py-2 rounded-md text-sm
           text-gray-800 dark:text-gray-100 transition-colors duration-200
           hover:text-yellow-500 dark:hover:text-yellow-400
           bg-white/60 dark:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300">
            <svg v-if="!sending" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 md:w-4 md:h-4" viewBox="0 0 24 24"
              fill="none" stroke="currentColor">
              <path d="M22 2L11 13" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
              <path d="M22 2L15 22l-4-9-9-4 20-7z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"
              stroke="currentColor">
              <circle cx="12" cy="12" r="10" stroke-width="4" stroke-linecap="round" />
            </svg>
            <span>{{ sending ? 'Sending...' : 'Send message' }}</span>
          </button>

          <button type="button" @click="openMailClient" class="w-full md:w-auto inline-flex justify-center items-center gap-2 px-4 py-3 md:py-2 rounded-md text-sm
           text-gray-800 dark:text-gray-100 transition-colors duration-200
           hover:text-yellow-500 dark:hover:text-yellow-400
           bg-white/50 dark:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300">
            ✉️ Open mail client
          </button>

          <div v-if="statusMessage"
            class="mt-2 md:mt-0 md:ml-auto text-sm text-gray-700 dark:text-gray-200 text-center md:text-left">
            {{ statusMessage }}
          </div>
        </div>

      </form>
    </div>
  </section>
</template>