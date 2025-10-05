<template>
  <div :class="bgClass" class="min-h-screen transition-all duration-1000 relative overflow-hidden">
    <!-- Escena climática en el fondo -->
    <div class="absolute inset-0 pointer-events-none overflow-hidden weather-scene">
      
      <!-- Sunny -->
      <div v-if="store.weatherCondition === 'sunny'" class="absolute inset-0">
        <div class="sun" />
        <div v-for="c in clouds" :key="c.id" class="cloud" :style="cloudStyle(c)" />
      </div>

      <!-- Rainy - MEJORADO con lluvia más realista -->
      <div v-else-if="store.weatherCondition === 'rainy'" class="absolute inset-0 rain-container">
        <!-- Nubes de tormenta -->
        <div v-for="c in stormClouds" :key="c.id" class="storm-cloud" :style="stormStyle(c)" />
        
        <!-- Lluvia principal - más densa y realista -->
        <div class="rain-layer">
          <div v-for="d in rainDrops" :key="`rain-${d.id}`" class="rain-drop" :style="rainStyle(d)" />
        </div>
        
        <!-- Lluvia de fondo - más suave -->
        <div class="rain-layer background">
          <div v-for="d in backgroundRain" :key="`bg-${d.id}`" class="rain-drop background" :style="rainStyle(d)" />
        </div>
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
  delay: number
  duration: number
  length: number
  speed: number
  opacity: number
}

interface Star {
  id: number
  x: number
  y: number
  s: number
}

const clouds = ref<Cloud[]>([])
const stormClouds = ref<StormCloud[]>([])
const rainDrops = ref<RainDrop[]>([])
const backgroundRain = ref<RainDrop[]>([])
const manyClouds = ref<Cloud[]>([])
const stars = ref<Star[]>([])

const initializeElements = () => {
  // Nubes normales
  clouds.value = Array.from({length: 5}, (_, i) => ({
    id: i, 
    x: Math.random() * 120 - 10, 
    y: 10 + Math.random() * 40, 
    s: 30 + Math.random() * 25, 
    d: 30 + Math.random() * 20
  }))

  // Nubes de tormenta - más realistas
  stormClouds.value = Array.from({length: 8}, (_, i) => ({
    id: i, 
    x: Math.random() * 130 - 15, 
    y: 5 + Math.random() * 20, 
    w: 60 + Math.random() * 100, 
    h: 30 + Math.random() * 60
  }))

  // MEJORADO: Lluvia principal - más realista
  rainDrops.value = Array.from({length: 80}, (_, i) => ({
    id: i, 
    x: Math.random() * 110 - 5, 
    delay: Math.random() * 2,
    duration: 0.6 + Math.random() * 0.4, // Más rápida
    length: 12 + Math.random() * 8,
    speed: 0.8 + Math.random() * 0.4,
    opacity: 0.3 + Math.random() * 0.4
  }))

  // MEJORADO: Lluvia de fondo - más lenta y suave
  backgroundRain.value = Array.from({length: 60}, (_, i) => ({
    id: i, 
    x: Math.random() * 110 - 5, 
    delay: Math.random() * 3,
    duration: 1 + Math.random() * 0.6, // Más lenta
    length: 8 + Math.random() * 6,
    speed: 0.5 + Math.random() * 0.3,
    opacity: 0.1 + Math.random() * 0.2
  }))

  // Nubes para clima nublado
  manyClouds.value = Array.from({length: 8}, (_, i) => ({
    id: i, 
    x: Math.random() * 130 - 15, 
    y: 5 + Math.random() * 50, 
    s: 40 + Math.random() * 30, 
    d: 35 + Math.random() * 20
  }))

  // Estrellas
  stars.value = Array.from({length: 80}, (_, i) => ({
    id: i, 
    x: Math.random() * 100, 
    y: Math.random() * 100, 
    s: 0.5 + Math.random() * 2
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
  height: c.h + 'px',
  animationDelay: (c.id * 2) + 's'
})

// MEJORADO: Estilo de lluvia más realista
const rainStyle = (d: RainDrop) => ({
  left: d.x + '%', 
  animationDelay: d.delay + 's',
  animationDuration: d.duration + 's',
  height: d.length + 'px',
  opacity: d.opacity,
  animationTimingFunction: `cubic-bezier(0.4, 0, ${0.2 + d.speed * 0.1}, 1)`
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
      return 'bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900'
    case 'cloudy':
      return 'bg-gradient-to-br from-slate-500 via-slate-400 to-slate-600'
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
/* Elementos de clima */
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
  background: #4A5568; 
  border-radius: 50%; 
  filter: blur(8px); 
  opacity: 0.8;
  animation: stormFloat 25s ease-in-out infinite; 
}

/* MEJORADO: Sistema de lluvia más realista */
.rain-layer {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.rain-layer.background {
  filter: blur(1px);
  opacity: 0.6;
}

.rain-drop { 
  position: absolute; 
  width: 2px; 
  background: linear-gradient(to bottom, 
    rgba(100, 181, 246, 0.8) 0%, 
    rgba(66, 165, 245, 0.9) 30%,
    rgba(33, 150, 243, 0.7) 70%,
    transparent 100%);
  border-radius: 1px;
  top: -30px;
  transform-origin: top center;
  animation: rainFall linear infinite;
}

.rain-drop.background {
  width: 1px;
  background: linear-gradient(to bottom, 
    rgba(100, 181, 246, 0.4) 0%, 
    rgba(66, 165, 245, 0.5) 50%,
    transparent 100%);
  filter: blur(0.3px);
}

/* MEJORADO: Animación de lluvia más natural */
@keyframes rainFall {
  0% { 
    transform: translateY(-100px) translateX(0) rotate(10deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  80% {
    opacity: 0.8;
  }
  100% { 
    transform: translateY(100vh) translateX(20px) rotate(10deg);
    opacity: 0;
  }
}

/* MEJORADO: Animación de nubes de tormenta */
@keyframes stormFloat {
  0% { 
    transform: translateX(-200px) translateY(0);
  }
  25% {
    transform: translateX(calc(25vw - 200px)) translateY(-5px);
  }
  50% {
    transform: translateX(calc(50vw - 200px)) translateY(0);
  }
  75% {
    transform: translateX(calc(75vw - 200px)) translateY(5px);
  }
  100% { 
    transform: translateX(calc(100vw + 200px)) translateY(0);
  }
}

@keyframes float {
  0% { transform: translateX(-100px); }
  100% { transform: translateX(calc(100vw + 100px)); }
}

@keyframes pulse {
  0%, 100% { transform: translate(-50%, -50%) scale(1); }
  50% { transform: translate(-50%, -50%) scale(1.05); }
}

@keyframes twinkle {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
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

/* MEJORADO: Efecto de viento más sutil */
.rain-container {
  animation: rainWind 15s ease-in-out infinite;
}

@keyframes rainWind {
  0%, 100% { transform: translateX(0) skewX(0deg); }
  33% { transform: translateX(5px) skewX(1deg); }
  66% { transform: translateX(-3px) skewX(-0.5deg); }
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
    width: 1.5px; 
  }
  
  .rain-drop.background {
    width: 1px;
  }
  
  .storm-cloud {
    filter: blur(6px);
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
  
  .rain-container {
    animation: none !important;
  }
}
</style>