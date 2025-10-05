<template>
  <div :class="bgClass" class="min-h-screen transition-all duration-1000">
    <div class="absolute inset-0 pointer-events-none overflow-hidden">
      
      <!-- Sunny -->
      <div v-if="store.weatherCondition === 'sunny'">
        <div class="sun" />
        <div v-for="c in clouds" :key="c.id" class="cloud" :style="cloudStyle(c)" />
      </div>

      <!-- Rainy -->
      <div v-else-if="store.weatherCondition === 'rainy'">
        <div v-for="c in stormClouds" :key="c.id" class="storm-cloud" :style="stormStyle(c)" />
        <div v-for="d in rain" :key="d.id" class="rain-drop" :style="rainStyle(d)" />
      </div>

      <!-- Cloudy -->
      <div v-else-if="store.weatherCondition === 'cloudy'">
        <div v-for="c in manyClouds" :key="c.id" class="cloud-soft" :style="cloudStyle(c)" />
      </div>

      <!-- Night -->
      <div v-else-if="store.weatherCondition === 'night'">
        <div v-for="s in stars" :key="s.id" class="star" :style="starStyle(s)" />
      </div>

      <!-- Sunrise -->
      <div v-else-if="store.weatherCondition === 'sunrise'">
        <div class="horizon-sun" />
        <div v-for="c in clouds" :key="c.id" class="sunrise-cloud" :style="cloudStyle(c)" />
      </div>

      <!-- Sunset -->
      <div v-else-if="store.weatherCondition === 'sunset'">
        <div class="horizon-sun" />
        <div v-for="c in clouds" :key="c.id" class="sunset-cloud" :style="cloudStyle(c)" />
      </div>
    </div>

    <WeatherApp />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useWeatherStore } from './stores/weather'
import WeatherApp from './components/WeatherApp.vue'

const store = useWeatherStore()

// Tipos TypeScript para mejor seguridad
interface Cloud {
  id: number
  x: number
  y: number
  s: number
  d: number
}

interface StormCloud {
  id: number
  x: number
  y: number
  w: number
  h: number
}

interface RainDrop {
  id: number
  x: number
  d: number
}

interface Star {
  id: number
  x: number
  y: number
  s: number
}

// Estados reactivos con tipos
const clouds = ref<Cloud[]>([])
const stormClouds = ref<StormCloud[]>([])
const rain = ref<RainDrop[]>([])
const manyClouds = ref<Cloud[]>([])
const stars = ref<Star[]>([])

// Inicialización de elementos
const initializeElements = () => {
  clouds.value = Array.from({length: 5}, (_, i) => ({
    id: i, 
    x: Math.random() * 120 - 10, 
    y: 10 + Math.random() * 40, 
    s: 30 + Math.random() * 25, 
    d: 30 + Math.random() * 20
  }))

  stormClouds.value = Array.from({length: 4}, (_, i) => ({
    id: i, 
    x: Math.random() * 100, 
    y: 5 + Math.random() * 30, 
    w: 100 + Math.random() * 100, 
    h: 50 + Math.random() * 60
  }))

  rain.value = Array.from({length: 30}, (_, i) => ({
    id: i, 
    x: Math.random() * 100, 
    d: Math.random() * 2
  }))

  manyClouds.value = Array.from({length: 7}, (_, i) => ({
    id: i, 
    x: Math.random() * 130 - 15, 
    y: 5 + Math.random() * 50, 
    s: 40 + Math.random() * 30, 
    d: 35 + Math.random() * 20
  }))

  stars.value = Array.from({length: 60}, (_, i) => ({
    id: i, 
    x: Math.random() * 100, 
    y: Math.random() * 100, 
    s: 1 + Math.random() * 2
  }))
}

// Funciones de estilo con tipos
const cloudStyle = (c: Cloud) => ({
  left: c.x + '%', 
  top: c.y + '%', 
  width: c.s + 'px', 
  height: (c.s * 0.6) + 'px',
  animationDuration: c.d + 's'
})

const stormStyle = (c: StormCloud) => ({
  left: c.x + '%', 
  top: c.y + '%', 
  width: c.w + 'px', 
  height: c.h + 'px'
})

const rainStyle = (d: RainDrop) => ({
  left: d.x + '%', 
  animationDelay: d.d + 's'
})

const starStyle = (s: Star) => ({
  left: s.x + '%', 
  top: s.y + '%', 
  width: s.s + 'px', 
  height: s.s + 'px'
})

// Clase de fondo computada
const bgClass = computed(() => {
  const base = 'min-h-screen'
  const condition = store.weatherCondition
  
  switch (condition) {
    case 'sunny':
      return `${base} bg-gradient-to-br from-sky-400 via-blue-300 to-cyan-200`
    case 'rainy':
      return `${base} bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900`
    case 'cloudy':
      return `${base} bg-gradient-to-br from-slate-400 via-slate-300 to-slate-500`
    case 'night':
      return `${base} bg-gradient-to-br from-indigo-950 via-purple-900 to-black`
    case 'sunrise':
      return `${base} bg-gradient-to-br from-pink-500 via-orange-400 to-yellow-300`
    case 'sunset':
      return `${base} bg-gradient-to-br from-orange-500 via-red-500 to-purple-600`
    default:
      return `${base} bg-gradient-to-br from-blue-400 to-cyan-200`
  }
})

// Lifecycle hooks
onMounted(() => {
  initializeElements()
})

onUnmounted(() => {
  // Cleanup si es necesario
})
</script>

<style scoped>
/* Base styles para todos los elementos */
.sun { 
  position: absolute; 
  top: 20%; 
  left: 50%; 
  width: 140px; 
  height: 140px; 
  background: radial-gradient(#FFE066, #FFD700); 
  border-radius: 50%;
  transform: translate(-50%, -50%); 
  box-shadow: 0 0 60px #FFD700;
  animation: pulse 4s ease-in-out infinite; 
}

.cloud { 
  position: absolute; 
  background: #FFF; 
  border-radius: 50%; 
  opacity: 0.9; 
  animation: float 30s linear infinite; 
}

.storm-cloud { 
  position: absolute; 
  background: #555; 
  border-radius: 50%; 
  filter: blur(3px); 
  animation: float 25s linear infinite; 
}

.rain-drop { 
  position: absolute; 
  width: 2px; 
  height: 20px; 
  background: #42A5F5;
  animation: fall 1.5s linear infinite; 
}

.cloud-soft { 
  position: absolute; 
  background: #E0E0E0; 
  border-radius: 50%;
  opacity: 0.85; 
  animation: float 40s linear infinite; 
}

.star { 
  position: absolute; 
  background: #FFF; 
  border-radius: 50%;
  box-shadow: 0 0 4px #FFF; 
  animation: twinkle 3s ease-in-out infinite; 
}

.horizon-sun { 
  position: absolute; 
  bottom: 10%; 
  left: 50%; 
  width: 180px; 
  height: 180px;
  background: radial-gradient(#FF8A65, #FF5722); 
  border-radius: 50%;
  transform: translateX(-50%); 
  box-shadow: 0 0 80px #FF5722; 
}

.sunrise-cloud { 
  position: absolute; 
  background: #FFE0B2; 
  border-radius: 50%;
  opacity: 0.6; 
  filter: blur(2px); 
  animation: float 35s linear infinite; 
}

.sunset-cloud { 
  position: absolute; 
  background: #FFB3D9; 
  border-radius: 50%;
  opacity: 0.5; 
  filter: blur(2px); 
  animation: float 35s linear infinite; 
}

/* Animaciones base */
@keyframes float {
  0% { transform: translateX(-100px); }
  100% { transform: translateX(100vw); }
}

@keyframes fall {
  0% { transform: translateY(-100px); opacity: 0.8; }
  100% { transform: translateY(100vh); opacity: 0; }
}

@keyframes pulse {
  0%, 100% { transform: translate(-50%, -50%) scale(1); }
  50% { transform: translate(-50%, -50%) scale(1.05); }
}

@keyframes twinkle {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
}

/* Responsive para móvil */
@media (max-width: 640px) {
  .sun { 
    width: 100px; 
    height: 100px; 
    top: 15%;
    box-shadow: 0 0 40px #FFD700;
  }

  .horizon-sun { 
    width: 120px; 
    height: 120px; 
    bottom: 8%;
    box-shadow: 0 0 50px #FF5722;
  }

  .cloud,
  .storm-cloud,
  .cloud-soft,
  .sunrise-cloud,
  .sunset-cloud {
    animation-duration: 20s !important;
  }

  .rain-drop { 
    width: 1px; 
    height: 15px; 
  }
}

/* Responsive para tablet */
@media (min-width: 641px) and (max-width: 1024px) {
  .sun { 
    width: 120px; 
    height: 120px; 
    top: 18%;
  }

  .horizon-sun { 
    width: 150px; 
    height: 150px; 
    bottom: 9%;
  }

  .cloud,
  .storm-cloud,
  .cloud-soft,
  .sunrise-cloud,
  .sunset-cloud {
    animation-duration: 25s !important;
  }
}

/* Optimizaciones de rendimiento */
@media (prefers-reduced-motion: reduce) {
  .sun,
  .cloud,
  .storm-cloud,
  .rain-drop,
  .cloud-soft,
  .star,
  .horizon-sun,
  .sunrise-cloud,
  .sunset-cloud {
    animation: none !important;
  }
}

/* Soporte para modo oscuro */
@media (prefers-color-scheme: dark) {
  .cloud { 
    background: #F0F0F0; 
  }

  .cloud-soft { 
    background: #D0D0D0; 
  }
}

/* Optimizaciones para pantallas grandes */
@media (min-width: 1920px) {
  .sun { 
    width: 160px; 
    height: 160px; 
  }

  .horizon-sun { 
    width: 200px; 
    height: 200px; 
  }
}

/* Mejoras de accesibilidad */
@media (prefers-contrast: high) {
  .cloud { 
    opacity: 1; 
  }

  .star { 
    opacity: 1; 
    box-shadow: 0 0 6px #FFF; 
  }
}

/* Estados de carga */
.min-h-screen {
  min-height: 100vh;
  min-height: 100dvh;
}

/* Transiciones suaves para cambios de condición */
.min-h-screen {
  transition: background 1s ease-in-out;
}

/* Mejoras de rendimiento para animaciones */
.sun,
.cloud,
.storm-cloud,
.rain-drop,
.cloud-soft,
.star,
.horizon-sun,
.sunrise-cloud,
.sunset-cloud {
  will-change: transform, opacity;
  backface-visibility: hidden;
}

/* Soporte para orientación landscape en móvil */
@media (max-width: 640px) and (orientation: landscape) {
  .sun { 
    top: 10%; 
    width: 80px; 
    height: 80px; 
  }

  .horizon-sun { 
    bottom: 5%; 
    width: 100px; 
    height: 100px; 
  }

  .cloud,
  .storm-cloud,
  .cloud-soft,
  .sunrise-cloud,
  .sunset-cloud {
    animation-duration: 15s !important;
  }
}

/* Input styles mejorados */
input[type="date"], 
input[type="time"] { 
  color-scheme: dark; 
}

input[type="date"]::-webkit-calendar-picker-indicator,
input[type="time"]::-webkit-calendar-picker-indicator { 
  filter: invert(1); 
  opacity: 0.6; 
}

/* Mejoras de scroll para móvil */
@media (max-width: 640px) {
  .min-h-screen {
    -webkit-overflow-scrolling: touch;
  }
}
</style>