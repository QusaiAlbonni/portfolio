<script setup lang="ts">
import { ref, onMounted, watch, type Ref } from 'vue'

const props = defineProps({
  isDark: { type: Boolean, default: false }
})

const items: Ref<any> = ref([])
let idCounter = 0

const largeCloudDur1 = ref(60)
const largeCloudDur2 = ref(90)

function rand(min: number, max: number) { return Math.random() * (max - min) + min }

function makeItem(isDark: boolean) {
  idCounter += 1
  const left = rand(-6, 106)
  const top = rand(-8, 108)

  let type, cssClass
  const pick = Math.random()
  if (!isDark) {
    if (pick < 0.5) { type = 'cloud'; cssClass = 'motif-cloud' }
    else { type = 'spark'; cssClass = 'motif-spark' }
  } else {
    if (pick < 0.42) { type = 'crescent'; cssClass = 'motif-crescent' }
    else { type = 'star'; cssClass = 'motif-star' }
  }

  let size, opacity
  if (type === 'cloud') { size = Math.round(rand(48, 128)); opacity = rand(isDark ? 0.08 : 0.5, isDark ? 0.22 : 0.95) }
  else if (type === 'spark') { size = Math.round(rand(14, 36)); opacity = rand(0.6, 1) }
  else if (type === 'crescent') { size = Math.round(rand(28, 72)); opacity = rand(0.15, 0.95) }
  else { size = Math.round(rand(6, 26)); opacity = rand(isDark ? 0.45 : 0.85, 1) }

  const horizAmp = Math.round(rand(8, 48))
  const vertAmp = Math.round(rand(4, 18))
  const rotateAmp = Math.round(rand(-12, 12))
  const duration = +(rand(10, 38)).toFixed(2)
  const delay = +(rand(-24, 6)).toFixed(2)
  const twinkleSpeed = +(rand(2.4, 6.6)).toFixed(2)
  const pulseSpeed = +(rand(4.6, 12)).toFixed(2)

  return {
    id: idCounter,
    left, top, size, opacity,
    type, cssClass,
    horizAmp, vertAmp, rotateAmp, duration, delay, twinkleSpeed, pulseSpeed
  }
}

function generateItems(isDark: boolean) {
  const count = isDark ? 30 : 30
  items.value = []
  for (let i = 0; i < count; i++) items.value.push(makeItem(isDark))
}

function generateLargeCloudDurations(isDark: boolean) {
  largeCloudDur1.value = Math.round(rand(isDark ? 80 : 48, isDark ? 140 : 86))
  largeCloudDur2.value = Math.round(rand(isDark ? 110 : 72, isDark ? 200 : 130))
}

function itemStyle(item: any) {
  return {
    left: item.left + '%',
    top: item.top + '%',
    width: item.size + 'px',
    height: item.size + 'px',
    opacity: item.opacity,
    '--h-amp': item.horizAmp + 'px',
    '--v-amp': item.vertAmp + 'px',
    '--rot-amp': item.rotateAmp + 'deg',
    '--motion-dur': item.duration + 's',
    '--motion-delay': item.delay + 's',
    '--twinkle-dur': item.twinkleSpeed + 's',
    '--pulse-dur': item.pulseSpeed + 's'
  }
}

onMounted(() => {
  generateLargeCloudDurations(props.isDark)
  generateItems(props.isDark)
})

watch(() => props.isDark, (v) => {
  generateLargeCloudDurations(v)
  generateItems(v)
})
</script>

<template>
  <div aria-hidden="true" class="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
    <div :class="[
      'absolute inset-0',
      isDark ? 'bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-800' :
        'bg-gradient-to-b from-sky-50 via-white to-sky-100'
    ]"></div>

    <div class="absolute inset-0">
      <template v-for="item in items" :key="item.id">
        <div class="absolute transform -translate-x-1/2 -translate-y-1/2 will-change-transform will-change-opacity"
          :class="item.cssClass" :style="itemStyle(item)">
          <!-- LIGHT: cloud + sun motif -->
          <svg v-if="item.type === 'cloud'" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"
            class="w-full h-full">
            <defs>
              <radialGradient id="sunGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#FFD166" stop-opacity="0.8" />
                <stop offset="100%" stop-color="#FFD166" stop-opacity="0" />
              </radialGradient>
            </defs>

            <!-- sun behind cloud -->
            <g transform="translate(65,25) scale(0.6)" class="drop-shadow-[0_0_4px_rgba(255,255,0,0.6)]">
              <!-- glow -->
              <circle cx="0" cy="0" r="26" fill="url(#sunGradient)" opacity="0.7" />
              <!-- core -->
              <circle cx="0" cy="0" r="18" fill="#FFD166" stroke="#FDB813" stroke-width="2" />
              <!-- rays -->
              <g stroke="#FFD166" stroke-width="2">
                <!-- vertical -->
                <line x1="0" y1="-22" x2="0" y2="-28" />
                <line x1="0" y1="22" x2="0" y2="28" />
                <!-- horizontal -->
                <line x1="-22" y1="0" x2="-28" y2="0" />
                <line x1="22" y1="0" x2="28" y2="0" />
                <!-- diagonals -->
                <line x1="-16" y1="-16" x2="-22" y2="-22" />
                <line x1="16" y1="-16" x2="22" y2="-22" />
                <line x1="-16" y1="16" x2="-22" y2="22" />
                <line x1="16" y1="16" x2="22" y2="22" />
              </g>

            </g>

            <!-- cloud in front -->
            <g transform="translate(30,15) scale(0.7)" fill="#fff">
              <!-- biggest puff -->
              <ellipse cx="50" cy="50" rx="32" ry="20" />
              <!-- left puff -->
              <ellipse cx="30" cy="54" rx="18" ry="14" />
              <!-- right puff -->
              <ellipse cx="72" cy="52" rx="22" ry="16" />
              <!-- small top puff -->
              <ellipse cx="44" cy="38" rx="14" ry="10" />
              <!-- flatten bottom -->
              <rect x="18" y="52" width="70" height="18" rx="9" />
            </g>

          </svg>

          <!-- LIGHT: small bright spark -->
          <svg v-else-if="item.type === 'spark'" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
            class="w-full h-full drop-shadow-[0_0_4px_rgba(255,255,0,0.6)]">
            <defs>
              <radialGradient id="sparkGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#FFF7D6" stop-opacity="1" />
                <stop offset="100%" stop-color="#FFF7D6" stop-opacity="0" />
              </radialGradient>
            </defs>
            <!-- glow halo -->
            <circle cx="12" cy="12" r="10" fill="url(#sparkGlow)" />
            <!-- core -->
            <circle cx="12" cy="12" r="4" fill="#FFF7D6" />
          </svg>

          <!-- DARK: crescent + tiny accent star -->
          <svg v-else-if="item.type === 'crescent'" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"
            class="w-full h-full drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
            <path d="
            M42,17.5
            A21,21 0 1,0 42,52.5
            A10.5,14 0 1,1 42,17.5
            Z
            " fill="#F8FAFC" />

            <g transform="translate(7,7)" fill="#FFFFFF" opacity="0.95">
              <path d="M5.6 0 L7 4.2 L11.2 5.6 L7 7 L5.6 11.2 L4.2 7 L0 5.6 L4.2 4.2 Z" />
            </g>
          </svg>


          <!-- DARK: small star -->
          <svg v-else viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="w-full h-full drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
            <path d="M12 2l2.6 6.6L21 11l-5 3.3L17.2 21 12 17.7 6.8 21 8 14.3 3 11l6.4-2.4z" fill="white" />
          </svg>
        </div>
      </template>
    </div>
  </div>
</template>



<style scoped>
.will-change-transform {
  will-change: transform, opacity;
}

@keyframes large-drift-1 {
  0% {
    transform: translate3d(-6%, 0, 0);
  }

  50% {
    transform: translate3d(6%, -6px, 0);
  }

  100% {
    transform: translate3d(-6%, 0, 0);
  }
}

@keyframes large-drift-2 {
  0% {
    transform: translate3d(6%, 0, 0);
  }

  50% {
    transform: translate3d(-8%, 8px, 0);
  }

  100% {
    transform: translate3d(6%, 0, 0);
  }
}

.large-cloud.cloud-1 {
  animation-name: large-drift-1;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
}

.large-cloud.cloud-2 {
  animation-name: large-drift-2;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
}

@keyframes glide {
  0% {
    transform: translate3d(calc(-1 * var(--h-amp)), 0, 0) rotate(calc(-0.5 * var(--rot-amp)));
  }

  50% {
    transform: translate3d(var(--h-amp), calc(-1 * var(--v-amp)), 0) rotate(calc(0.6 * var(--rot-amp)));
  }

  100% {
    transform: translate3d(calc(-1 * var(--h-amp)), 0, 0) rotate(calc(-0.5 * var(--rot-amp)));
  }
}

@keyframes bob {
  0% {
    transform: translateY(0) scale(1);
  }

  50% {
    transform: translateY(calc(-1 * var(--v-amp))) scale(1.01);
  }

  100% {
    transform: translateY(0) scale(1);
  }
}

@keyframes twinkle {
  0% {
    opacity: 0.6;
    transform: scale(0.92);
    filter: blur(0);
  }

  35% {
    opacity: 1;
    transform: scale(1.06);
    filter: blur(0.2px);
  }

  70% {
    opacity: 0.72;
    transform: scale(0.96);
    filter: blur(0);
  }

  100% {
    opacity: 0.6;
    transform: scale(0.92);
    filter: blur(0);
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
    filter: drop-shadow(0 0 0px rgba(255, 180, 0, 0));
  }

  50% {
    transform: scale(1.03);
    filter: drop-shadow(0 0 8px rgba(255, 180, 0, 0.12));
  }

  100% {
    transform: scale(1);
    filter: drop-shadow(0 0 0px rgba(255, 180, 0, 0));
  }
}

@keyframes slow-rotate {
  from {
    transform: rotate(-0.8deg);
  }

  to {
    transform: rotate(0.8deg);
  }
}


.motif-cloud {
  animation: glide var(--motion-dur) ease-in-out infinite;
  animation-delay: var(--motion-delay);
  transform-origin: center;
}

.motif-spark {
  animation: glide calc(var(--motion-dur) * 0.9) ease-in-out infinite;
  animation-delay: var(--motion-delay);
}

.motif-spark svg {
  filter: drop-shadow(0 0 2px rgba(255, 255, 200, 0.18));
}

.motif-crescent {
  animation: glide var(--motion-dur) ease-in-out infinite, slow-rotate calc(var(--motion-dur) * 0.6) linear infinite;
  animation-delay: var(--motion-delay), var(--motion-delay);
  transform-origin: 50% 50%;
}

.motif-star {
  animation: twinkle var(--twinkle-dur) ease-in-out infinite, glide var(--motion-dur) linear infinite;
  animation-delay: var(--motion-delay), var(--motion-delay);
  transform-origin: center;
  will-change: opacity, transform;
}

svg {
  display: block;
  width: 100%;
  height: 100%;
}

[aria-hidden="true"] * {
  pointer-events: none;
  user-select: none;
}
</style>
