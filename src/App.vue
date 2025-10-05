<template>
  <div :class="bgClass" class="min-h-screen transition-all duration-1000 relative overflow-hidden">
    <!-- Escena climática en el fondo -->
    <div class="absolute inset-0 pointer-events-none overflow-hidden weather-scene">
      
      <!-- Sunny -->
      <div v-if="store.weatherCondition === 'sunny'" class="absolute inset-0">
        <div class="sun" />
        <div v-for="c in clouds" :key="c.id" class="cloud" :style="cloudStyle(c)" />
      </div>

      <!-- Rainy -->
      <div v-else-if="store.weatherCondition === 'rainy'" class="absolute inset-0">
        <div v-for="c in stormClouds" :key="c.id" class="storm-cloud" :style="stormStyle(c)" />
        <div v-for="d in rain" :key="d.id" class="rain-drop" :style="rainStyle(d)" />
      </div>

      <!-- Cloudy -->
      <div v-else-if="store.weatherCondition === 'cloudy'" class="absolute inset-0">
        <div v-for="c in manyClouds" :key="c.id" class="cloud-soft" :style="cloudStyle(c)" />
      </div>

      <!-- Night -->
      <div v-else-if="store.weatherCondition === 'night'" class="absolute inset-0">
        <div v-for="s in stars" :key="s.id" class="star" :style="starStyle(s)" />
      </div>

      <!-- Sunrise -->
      <div v-else-if="store.weatherCondition === 'sunrise'" class="absolute inset-0">
        <div class="horizon-sun" />
        <div v-for="c in clouds" :key="c.id" class="sunrise-cloud" :style="cloudStyle(c)" />
      </div>

      <!-- Sunset -->
      <div v-else-if="store.weatherCondition === 'sunset'" class="absolute inset-0">
        <div class="horizon-sun" />
        <div v-for="c in clouds" :key="c.id" class="sunset-cloud" :style="cloudStyle(c)" />
      </div>
    </div>

    <!-- Contenido principal encima de la escena -->
    <div class="relative z-10">
      <WeatherApp />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useWeatherStore } from './stores/weather'
import WeatherApp from './components/WeatherApp.vue'

const store = useWeatherStore()

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
  y: number
  d: number
}

interface Star {
  id: number
  x: number
  y: number
  s: number
}

const clouds = ref<Cloud[]>([])
const stormClouds = ref<StormCloud[]>([])
const rain = ref<RainDrop[]>([])
const manyClouds = ref<Cloud[]>([])
const stars = ref<Star[]>([])

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

  // FIXED: Las gotas de lluvia ahora tienen posición Y inicial
  rain.value = Array.from({length: 30}, (_, i) => ({
    id: i, 
    x: Math.random() * 100, 
    y: Math.random() * 100,
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

// FIXED: Estilo corregido para gotas de lluvia
const rainStyle = (d: RainDrop) => ({
  left: d.x + '%', 
  top: d.y + '%',
  animationDelay: d.d + 's'
})

const starStyle = (s: Star) => ({
  left: s.x + '%', 
  top: s.y + '%', 
  width: s.s + 'px', 
  height: s.s + 'px'
})

const bgClass = computed(() => {
  const condition = store.weatherCondition
  
  switch (condition) {
    case 'sunny':
      return 'bg-gradient-to-br from-sky-400 via-blue-300 to-cyan-200'
    case 'rainy':
      return 'bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900'
    case 'cloudy':
      return 'bg-gradient-to-br from-slate-400 via-slate-300 to-slate-500'
    case 'night':
      return 'bg-gradient-to-br from-indigo-950 via-purple-900 to-black'
    case 'sunrise':
      return 'bg-gradient-to-br from-pink-500 via-orange-400 to-yellow-300'
    case 'sunset':
      return 'bg-gradient-to-br from-orange-500 via-red-500 to-purple-600'
    default:
      return 'bg-gradient-to-br from-blue-400 to-cyan-200'
  }
})

onMounted(() => {
  initializeElements()
})
</script>

<style scoped>
/* Elementos de clima - FIXED: Mejor posicionamiento */
.sun { 
  position: absolute; 
  top: 15%; 
  left: 50%; 
  width: 120px; 
  height: 120px; 
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
  opacity: 0.8;
  animation: float 25s linear infinite; 
}

/* FIXED: Animación de lluvia corregida */
.rain-drop { 
  position: absolute; 
  width: 2px; 
  height: 20px; 
  background: #42A5F5;
  opacity: 0.7;
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
  bottom: 15%; 
  left: 50%; 
  width: 150px; 
  height: 150px;
  background: radial-gradient(#FF8A65, #FF5722); 
  border-radius: 50%;
  transform: translateX(-50%); 
  box-shadow: 0 0 80px #FF5722; 
}

.sunrise-cloud,
.sunset-cloud { 
  position: absolute; 
  border-radius: 50%;
  opacity: 0.6; 
  filter: blur(2px); 
  animation: float 35s linear infinite; 
}

.sunrise-cloud {
  background: #FFE0B2; 
}

.sunset-cloud {
  background: #FFB3D9; 
}

/* Animaciones */
@keyframes float {
  0% { transform: translateX(-100px); }
  100% { transform: translateX(calc(100vw + 100px)); }
}

@keyframes fall {
  0% { 
    transform: translateY(-100px); 
    opacity: 0.8; 
  }
  100% { 
    transform: translateY(100vh); 
    opacity: 0; 
  }
}

@keyframes pulse {
  0%, 100% { transform: translate(-50%, -50%) scale(1); }
  50% { transform: translate(-50%, -50%) scale(1.05); }
}

@keyframes twinkle {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
}

/* Responsive */
@media (max-width: 768px) {
  .sun { 
    width: 80px; 
    height: 80px; 
    top: 12%;
  }

  .horizon-sun { 
    width: 100px; 
    height: 100px; 
    bottom: 10%;
  }

  .rain-drop { 
    width: 1px; 
    height: 15px; 
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .sun { 
    width: 100px; 
    height: 100px; 
    top: 15%;
  }

  .horizon-sun { 
    width: 120px; 
    height: 120px; 
    bottom: 12%;
  }
}

/* Mejoras de rendimiento */
.weather-scene * {
  will-change: transform, opacity;
  backface-visibility: hidden;
}

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
</style>