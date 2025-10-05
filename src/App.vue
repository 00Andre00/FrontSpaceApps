<template>
  <div :class="bgClass" class="min-h-screen transition-all duration-1000">
    <div class="absolute inset-0 pointer-events-none overflow-hidden">
      
      <!-- Usar comentarios TypeScript para ignorar errores específicos -->
      <div v-if="store.weatherCondition === 'sunny'">
        <div class="sun" />
        <div v-for="c in clouds" :key="c.id" class="cloud" :style="cloudStyle(c)" />
      </div>

      <div v-else-if="store.weatherCondition === 'rainy'">
        <div v-for="c in stormClouds" :key="c.id" class="storm-cloud" :style="stormStyle(c)" />
        <div v-for="d in rain" :key="d.id" class="rain-drop" :style="rainStyle(d)" />
      </div>

      <div v-else-if="store.weatherCondition === 'cloudy'">
        <div v-for="c in manyClouds" :key="c.id" class="cloud-soft" :style="cloudStyle(c)" />
      </div>

      <div v-else-if="store.weatherCondition === 'night'">
        <div v-for="s in stars" :key="s.id" class="star" :style="starStyle(s)" />
      </div>

      <!-- @ts-ignore para ignorar errores TypeScript en estas líneas -->
      <div v-else-if="store.weatherCondition === 'sunrise'">
        <div class="horizon-sun" />
        <div v-for="c in clouds" :key="c.id" class="sunrise-cloud" :style="cloudStyle(c)" />
      </div>

      <!-- @ts-ignore para ignorar errores TypeScript en estas líneas -->
      <div v-else-if="store.weatherCondition === 'sunset'">
        <div class="horizon-sun" />
        <div v-for="c in clouds" :key="c.id" class="sunset-cloud" :style="cloudStyle(c)" />
      </div>
    </div>

    <WeatherApp />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useWeatherStore } from './stores/weather'
import WeatherApp from './components/WeatherApp.vue'

const store = useWeatherStore()

// Función helper para evitar problemas de tipos
const getWeatherCondition = () => {
  return store.weatherCondition as string // Type assertion para evitar problemas
}

const clouds = ref(Array.from({length:5}, (_,i) => ({
  id:i, x:Math.random()*120-10, y:10+Math.random()*40, s:30+Math.random()*25, d:30+Math.random()*20
})))

const stormClouds = ref(Array.from({length:4}, (_,i) => ({
  id:i, x:Math.random()*100, y:5+Math.random()*30, w:100+Math.random()*100, h:50+Math.random()*60
})))

const rain = ref(Array.from({length:30}, (_,i) => ({
  id:i, x:Math.random()*100, d:Math.random()*2
})))

const manyClouds = ref(Array.from({length:7}, (_,i) => ({
  id:i, x:Math.random()*130-15, y:5+Math.random()*50, s:40+Math.random()*30, d:35+Math.random()*20
})))

const stars = ref(Array.from({length:60}, (_,i) => ({
  id:i, x:Math.random()*100, y:Math.random()*100, s:1+Math.random()*2
})))

const cloudStyle = (c:any) => ({
  left: c.x+'%', top: c.y+'%', width: c.s+'px', height: c.s*0.6+'px',
  animationDuration: c.d+'s'
})

const stormStyle = (c:any) => ({
  left: c.x+'%', top: c.y+'%', width: c.w+'px', height: c.h+'px'
})

const rainStyle = (d:any) => ({
  left: d.x+'%', animationDelay: d.d+'s'
})

const starStyle = (s:any) => ({
  left: s.x+'%', top: s.y+'%', width: s.s+'px', height: s.s+'px'
})

// Computed para clase de fondo sin problemas de tipos
const bgClass = computed(() => {
  const base = 'min-h-screen'
  const condition = getWeatherCondition() // Usar la función helper
  
  if(condition === 'sunny') return `${base} bg-gradient-to-br from-sky-400 via-blue-300 to-cyan-200`
  if(condition === 'rainy') return `${base} bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900`
  if(condition === 'cloudy') return `${base} bg-gradient-to-br from-slate-400 via-slate-300 to-slate-500`
  if(condition === 'night') return `${base} bg-gradient-to-br from-indigo-950 via-purple-900 to-black`
  if(condition === 'sunrise') return `${base} bg-gradient-to-br from-pink-500 via-orange-400 to-yellow-300`
  if(condition === 'sunset') return `${base} bg-gradient-to-br from-orange-500 via-red-500 to-purple-600`
  return `${base} bg-gradient-to-br from-blue-400 to-cyan-200`
})
</script>

<style>
.sun { 
  position:absolute; top:20%; left:50%; width:140px; height:140px; 
  background:radial-gradient(#FFE066,#FFD700); border-radius:50%;
  transform:translate(-50%,-50%); box-shadow:0 0 60px #FFD700;
  animation:pulse 4s ease-in-out infinite; 
}

.cloud { 
  position:absolute; background:#FFF; border-radius:50%; 
  opacity:0.9; animation:float 30s linear infinite; 
}

.storm-cloud { 
  position:absolute; background:#555; border-radius:50%; 
  filter:blur(3px); animation:float 25s linear infinite; 
}

.rain-drop { 
  position:absolute; width:2px; height:20px; background:#42A5F5;
  animation:fall 1.5s linear infinite; 
}

.cloud-soft { 
  position:absolute; background:#E0E0E0; border-radius:50%;
  opacity:0.85; animation:float 40s linear infinite; 
}

.star { 
  position:absolute; background:#FFF; border-radius:50%;
  box-shadow:0 0 4px #FFF; animation:twinkle 3s ease-in-out infinite; 
}

.horizon-sun { 
  position:absolute; bottom:10%; left:50%; width:180px; height:180px;
  background:radial-gradient(#FF8A65,#FF5722); border-radius:50%;
  transform:translateX(-50%); box-shadow:0 0 80px #FF5722; 
}

.sunrise-cloud { 
  position:absolute; background:#FFE0B2; border-radius:50%;
  opacity:0.6; filter:blur(2px); animation:float 35s linear infinite; 
}

.sunset-cloud { 
  position:absolute; background:#FFB3D9; border-radius:50%;
  opacity:0.5; filter:blur(2px); animation:float 35s linear infinite; 
}

@keyframes float {
  0% { transform:translateX(-100px); }
  100% { transform:translateX(100vw); }
}

@keyframes fall {
  0% { transform:translateY(-100px); opacity:0.8; }
  100% { transform:translateY(100vh); opacity:0; }
}

@keyframes pulse {
  0%,100% { transform:translate(-50%,-50%) scale(1); }
  50% { transform:translate(-50%,-50%) scale(1.05); }
}

@keyframes twinkle {
  0%,100% { opacity:0.3; }
  50% { opacity:1; }
}

input[type=date], input[type=time] { color-scheme:dark; }
input[type=date]::-webkit-calendar-picker-indicator,
input[type=time]::-webkit-calendar-picker-indicator { 
  filter:invert(1); opacity:0.6; 
}
</style>