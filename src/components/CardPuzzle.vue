<script lang="ts" setup>
import { ref, type Ref } from 'vue';
import type { Card } from '../types/card';
import { shuffle } from '../utils';
import Timer from './Timer.vue';

type GameState = 'idle' | 'playing' | 'won' | 'lost' | 'suspended';

const props = defineProps<{ cards: Card[] }>();

const gameState: Ref<GameState> = ref('idle');
const timerControl: Ref<boolean> = ref(true);
const resetTimer: Ref<number> = ref(0);

const timeouts: Ref<number[]> = ref([]);

const lastCardOpened: Ref<Card | null> = ref(null);

const cards = ref(duplicateAndShuffle(props.cards));

const gameSize = props.cards.length;
let winCounter = 0;

if (cards.value.length % 2 !== 0)
  throw new Error("you need to define an even number of cards");

function duplicateAndShuffle(cards: Card[]): Card[] {
  const duplicated = cards.flatMap((card) => [
    { ...card, id: card.id },
    { ...card, id: card.id + cards.length }
  ]);

  return shuffle(duplicated);
}

function getCardById(id: number): Card {
  return cards.value.find((card) => card.id === id)!;
}

function play(id: number) {
  if (['won', 'lost', 'suspended'].includes(gameState.value)) return;
  const card = getCardById(id);
  if (card.revealed) return;
  if (gameState.value === 'idle')
    playFirstCard(card);
  else
    playSecondCard(card);
}

function playFirstCard(card: Card) {
  card.revealed = true;
  gameState.value = 'playing';
  lastCardOpened.value = card;
}

function playSecondCard(card: Card) {
  card.revealed = true;
  if (lastCardOpened.value?.key === card.key) {
    gameState.value = 'idle';
    winCounter++;
    if (winCounter === gameSize) {
      gameState.value = 'won';
      timerControl.value = false;
    }
    return;
  }
  gameState.value = 'suspended';
  timeouts.value.push(setTimeout(() => {
    hideCards([card, lastCardOpened.value!]);
    unsuspendGame();
  }, 1000));
}

function hideCards(cards: Card[]) {
  cards.forEach(element => {
    element.revealed = false;
  });
}

function unsuspendGame() {
  gameState.value = 'idle';
  lastCardOpened.value = null;
}

function lose() {
  gameState.value = 'lost';
  timeouts.value.forEach(t => clearTimeout(t));
}

function retry() {
  resetTimer.value++;
  timerControl.value = true
  winCounter = 0;
  hideCards(cards.value);
  gameState.value = 'idle';
}

function reShuffle() {
  cards.value = shuffle(cards.value);
  retry();
}

</script>

<template>
  <div class="relative">
    <div class="max-w-3xl mx-auto bg-transparent backdrop-blur-lg p-2 rounded-2xl shadow-lg">
      <div>
        <Timer :duration="60" :running="timerControl" @finished="lose" :resetKey="resetTimer">
          <template #display="{ remaining }">
            <div class="w-full h-48 flex items-center justify-center">
              <div :class="[
                'font-mono font-extrabold text-5xl sm:text-6xl md:text-7xl',
                remaining.sec > 0 && remaining.sec <= 11 ? 'blink-last-5' :
                  (remaining.sec === 0 ? 'text-red-500' : 'text-emerald-500')
              ]" aria-live="polite">
                {{ remaining.formatted }}
              </div>
            </div>
          </template>
        </Timer>
      </div>
      <div class="grid grid-cols-3 md:grid-cols-4 gap-4 mx-8 md:mx-20">
        <div v-for="card of cards" :key="card.id" class="card h-33 md:h-50 mx-auto" @click="play(card.id)"
          :class="card.revealed ? 'flipped' : ''">
          <div class="card-inner">
            <div class="card-face card-back-face h-full">
              <div class="back-design">?</div>
            </div>
            <div class="card-face card-front-face">
              <img class="rounded face-image" :src="card.image" alt="card image" loading="eager" />
            </div>
          </div>
        </div>
      </div>

    </div>
    <div v-if="['lost', 'won'].includes(gameState)" class="absolute inset-0 z-[9999] grid place-items-center w-full">
      <div ref="backdrop" class="inset-0 w-full h-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
        <div class="w-full h-full flex flex-col items-center justify-center gap-4">
          <h1 class="game-result-title">
            {{ gameState === 'lost' ? '😔 Game Over' : '🎉 Victory!' }}
          </h1>
          <p class="game-result-subtitle">
            {{ gameState === 'lost' ? 'Time ran out! Better luck next time.' : 'Excellent memory skills!' }}
          </p>
          <div class="flex flex-col sm:flex-row gap-3">
            <button class="game-btn btn-retry" @click="retry">
              <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Try Again
            </button>
            <button class="game-btn btn-shuffle" @click="reShuffle">
              <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
              New Shuffle
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  aspect-ratio: 2.5/4;
  perspective: 1000px;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border-radius: 8px;
}

.card:not(.flipped):hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 12px 24px -6px rgba(0, 0, 0, 0.25);
}

.card:not(.flipped):active {
  transform: translateY(-4px) scale(1.01);
  transition: transform 0.1s ease;
}

.card-inner {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.6s;
}

.card.flipped .card-inner {
  transform: rotateY(180deg);
}

.card-face {
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  backface-visibility: hidden;
  border: 1px solid #ccc;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.card-back-face {
  transform: rotateY(0deg);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: 2px solid rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
}

.card-back-face::before {
  content: '';
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(45deg,
      transparent,
      transparent 10px,
      rgba(255, 255, 255, 0.05) 10px,
      rgba(255, 255, 255, 0.05) 20px);
}

.card-back-face::after {
  content: '';
  position: absolute;
  inset: -50%;
  background: radial-gradient(circle at center, transparent 30%, rgba(255, 255, 255, 0.4));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.card:not(.flipped):hover .card-back-face::after {
  opacity: 1;
  animation: shimmer 1.5s ease infinite;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%) translateY(-100%) rotate(45deg);
  }

  100% {
    transform: translateX(100%) translateY(100%) rotate(45deg);
  }
}

.card-front-face {
  transform: rotateY(180deg);
  background: #fff;
  border: 2px solid #e5e7eb;
}

.face-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.blink-last-5 {
  color: #10B981;
  animation: blink-color 1s steps(1, end) infinite;
  text-shadow: 0 0 20px currentColor;
}

@media (prefers-reduced-motion: reduce) {
  .blink-last-5 {
    animation: none;
    color: #EF4444;
  }

  .card:not(.flipped):hover {
    transform: none;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }

  .card:not(.flipped):hover .card-back-face::after {
    animation: none;
  }
}

@keyframes blink-color {
  0% {
    color: #10B981;
  }

  49% {
    color: #10B981;
  }

  50% {
    color: #EF4444;
  }

  100% {
    color: #EF4444;
  }
}

.back-design {
  font-size: 3rem;
  font-weight: bold;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  z-index: 1;
  position: relative;
}

.game-result-title {
  font-size: 2.5rem;
  font-weight: bold;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-align: center;
  margin-bottom: 0.5rem;
}

.game-result-subtitle {
  font-size: 1.125rem;
  color: #6b7280;
  text-align: center;
  margin-bottom: 1.5rem;
}

.game-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  position: relative;
  overflow: hidden;
  min-width: 140px;
}

.game-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transform: translateX(-100%);
  transition: transform 0.2s ease;
}

.game-btn:hover::before {
  transform: translateX(100%);
}

.btn-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.btn-retry {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  box-shadow: 0 4px 14px 0 rgba(59, 130, 246, 0.4);
}

.btn-retry:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px 0 rgba(59, 130, 246, 0.5);
}

.btn-retry:active {
  transform: translateY(0);
}

.btn-shuffle {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  box-shadow: 0 4px 14px 0 rgba(16, 185, 129, 0.4);
}

.btn-shuffle:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px 0 rgba(16, 185, 129, 0.5);
}

.btn-shuffle:active {
  transform: translateY(0);
}

@media (prefers-color-scheme: dark) {
  .card-face {
    border-color: #374151;
  }

  .card-front-face {
    background: #1f2937;
    border-color: #374151;
  }

  .game-result-subtitle {
    color: #9ca3af;
  }
}
</style>