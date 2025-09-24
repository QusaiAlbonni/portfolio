<template>
  <div class="countdown-timer">
    <slot name="display" :remaining="displayRemaining" :raw="remaining">
      <span>{{ formatted }}</span>
    </slot>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount, defineProps, defineEmits, toRefs, getCurrentInstance, type WritableComputedRef } from 'vue'

const props = defineProps({
  duration: { type: Number, required: true }, // seconds
  autoStart: { type: Boolean, default: false },
  running: { type: Boolean, default: undefined },
  resetKey: { type: [Number, String], default: 0 },
  tickInterval: { type: Number, default: 250 } // ms
})

const emit = defineEmits(['tick', 'finished', 'started', 'paused', 'reset', 'update:running'])

const { duration, autoStart, running, resetKey, tickInterval } = toRefs(props)

const remaining = ref(Math.max(0, Number(duration.value) * 1000))
const isRunningInternal = ref(Boolean(autoStart.value))
const isControlled = computed(() => running?.value !== undefined)
const isActive: WritableComputedRef<boolean> = computed({
  get() {
    return isControlled.value ? Boolean(running?.value) : isRunningInternal.value
  },
  set(val) {
    if (isControlled.value) {
      emit('update:running', val)
    } else {
      isRunningInternal.value = val
    }
  }
})

let rafId: number | null = null
let endTime: number | null = null
let lastTickEmit = 0
let fallbackIntervalId: number | null = null

function scheduleLoopIfNeeded() {
  if (rafId == null && typeof requestAnimationFrame === 'function') {
    rafId = requestAnimationFrame(loop)
  }

  if (fallbackIntervalId == null) {
    fallbackIntervalId = window.setInterval(() => {
      if (endTime != null) {
        const now = performance.now()
        remaining.value = Math.max(0, endTime - now)
        maybeEmitTick(now)
        if (remaining.value <= 0) {
          finish()
        }
      }
    }, Math.max(16, Number(tickInterval.value)))
  }
}

function clearLoop() {
  if (rafId != null) {
    cancelAnimationFrame(rafId)
    rafId = null
  }
  if (fallbackIntervalId != null) {
    clearInterval(fallbackIntervalId)
    fallbackIntervalId = null
  }
}

function start() {
  remaining.value = Math.max(0, Number(remaining.value))
  endTime = performance.now() + Math.max(0, remaining.value)
  lastTickEmit = performance.now() - Number(tickInterval.value)
  isActive.value = true
  emit('started')
  scheduleLoopIfNeeded()
}

function pause() {
  clearLoop()
  const now = performance.now()
  if (endTime != null) {
    remaining.value = Math.max(0, endTime - now)
  }
  endTime = null
  isActive.value = false
  emit('paused')
}

function reset(newDurationSec: number | null = null) {
  clearLoop()
  const d = newDurationSec != null ? Number(newDurationSec) : Number(duration.value)
  remaining.value = Math.max(0, d * 1000)
  endTime = null
  isActive.value = Boolean(autoStart.value)
  emit('reset', { remaining: remaining.value / 1000 })
  if (isActive.value) {
    start()
  }
}

function finish() {
  clearLoop()
  remaining.value = 0
  endTime = null
  isActive.value = false
  emit('finished')
}

function maybeEmitTick(nowPerf: number) {
  if (nowPerf - lastTickEmit >= tickInterval.value) {
    lastTickEmit = nowPerf
    emit('tick', Math.ceil(remaining.value / 1000))
  }
}

function loop(timestamp?: number) {
  const now = typeof timestamp === 'number' ? timestamp : performance.now()
  if (!endTime) {
    endTime = now + Math.max(0, remaining.value)
  }
  remaining.value = Math.max(0, endTime - now)
  maybeEmitTick(now)

  if (remaining.value <= 0) {
    finish()
    return
  }

  rafId = requestAnimationFrame(loop)
}

onMounted(() => {
  remaining.value = Math.max(0, Number(duration.value) * 1000)
  if (isControlled.value) {
    if (running!.value) start()
  } else {
    if (autoStart.value) start()
  }
})

onBeforeUnmount(() => {
  clearLoop()
})

watch(duration, (newD) => {
  const newMs = Math.max(0, Number(newD) * 1000)
  if (isActive.value && endTime != null) {
    remaining.value = newMs
    endTime = performance.now() + remaining.value
  } else {
    remaining.value = newMs
    endTime = null
  }
})

watch(() => running?.value, (newRunning) => {
  if (!isControlled.value) return
  console.log("running", isControlled.value);
  console.log(newRunning);
  if (newRunning) start()
  else pause()
})

watch(resetKey, () => {
  reset()
})

const instance: any = getCurrentInstance()
if (instance) {
  instance.proxy.$start = start
  instance.proxy.$pause = pause
  instance.proxy.$reset = reset
}

const secondsRemaining = computed(() => Math.ceil(remaining.value / 1000))

const formatted = computed(() => {
  const totalSec = Math.max(0, Math.floor(remaining.value / 1000))
  const minutes = Math.floor(totalSec / 60)
  const seconds = totalSec % 60
  const mm = String(minutes).padStart(2, '0')
  const ss = String(seconds).padStart(2, '0')
  return `${mm}:${ss}`
})

const displayRemaining = computed(() => ({
  ms: remaining.value,
  sec: secondsRemaining.value,
  formatted: formatted.value
}))
</script>
