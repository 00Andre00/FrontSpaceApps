<template>
  <div class="weather-icon">
    <svg v-if="condition === 'sunny'" viewBox="0 0 200 200">
      <defs>
        <radialGradient id="sunGrad">
          <stop offset="0%" stop-color="#FFF9E6"/>
          <stop offset="50%" stop-color="#FFE066"/>
          <stop offset="100%" stop-color="#FFD700"/>
        </radialGradient>
      </defs>
      <g v-for="i in 12" :key="i" :transform="`rotate(${i * 30} 100 100)`">
        <rect x="98" y="25" width="4" height="30" rx="2" fill="#FFD700" opacity="0.7">
          <animate attributeName="opacity" values="0.5;0.9;0.5" dur="3s" :begin="`${i*0.15}s`" repeatCount="indefinite"/>
        </rect>
      </g>
      <circle cx="100" cy="100" r="40" fill="url(#sunGrad)">
        <animate attributeName="r" values="40;43;40" dur="4s" repeatCount="indefinite"/>
      </circle>
    </svg>

    <svg v-else-if="condition === 'sunrise'" viewBox="0 0 200 200">
      <defs>
        <radialGradient id="sunrise">
          <stop offset="0%" stop-color="#FFB74D"/>
          <stop offset="100%" stop-color="#FF5722"/>
        </radialGradient>
      </defs>
      <g v-for="i in 6" :key="i" :transform="`rotate(${i*60-90} 100 140)`">
        <rect x="98" y="60" width="4" height="30" rx="2" fill="#FF8A65" opacity="0.6">
          <animate attributeName="opacity" values="0.4;0.7;0.4" dur="3s" :begin="`${i*0.3}s`" repeatCount="indefinite"/>
        </rect>
      </g>
      <circle cx="100" cy="140" r="35" fill="url(#sunrise)"/>
      <ellipse cx="100" cy="165" rx="60" ry="20" fill="#FFB74D" opacity="0.3"/>
    </svg>

    <svg v-else-if="condition === 'rainy'" viewBox="0 0 200 200">
      <ellipse cx="80" cy="70" rx="35" ry="25" fill="#78909C"/>
      <ellipse cx="110" cy="65" rx="40" ry="30" fill="#90A4AE"/>
      <ellipse cx="140" cy="72" rx="32" ry="24" fill="#78909C"/>
      <g v-for="i in 8" :key="i">
        <line :x1="65+i*15" y1="100" :x2="63+i*15" y2="125" stroke="#42A5F5" stroke-width="2">
          <animate attributeName="y1" values="100;125" dur="1s" :begin="`${i*0.12}s`" repeatCount="indefinite"/>
          <animate attributeName="y2" values="125;150" dur="1s" :begin="`${i*0.12}s`" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.8;0" dur="1s" :begin="`${i*0.12}s`" repeatCount="indefinite"/>
        </line>
      </g>
    </svg>

    <svg v-else-if="condition === 'cloudy'" viewBox="0 0 200 200">
      <ellipse cx="70" cy="80" rx="40" ry="28" fill="#CFD8DC"/>
      <ellipse cx="105" cy="75" rx="45" ry="33" fill="#E0E0E0"/>
      <ellipse cx="140" cy="82" rx="38" ry="27" fill="#B0BEC5"/>
      <ellipse cx="90" cy="105" rx="36" ry="26" fill="#ECEFF1"/>
    </svg>

    <svg v-else-if="condition === 'sunset'" viewBox="0 0 200 200">
      <defs>
        <radialGradient id="sunset">
          <stop offset="0%" stop-color="#FF8A65"/>
          <stop offset="100%" stop-color="#E64A19"/>
        </radialGradient>
      </defs>
      <g v-for="i in 6" :key="i" :transform="`rotate(${i*60-90} 100 140)`">
        <rect x="97" y="55" width="6" height="35" rx="3" fill="#FF5722" opacity="0.5">
          <animate attributeName="opacity" values="0.3;0.6;0.3" dur="3.5s" :begin="`${i*0.3}s`" repeatCount="indefinite"/>
        </rect>
      </g>
      <circle cx="100" cy="140" r="38" fill="url(#sunset)"/>
      <ellipse cx="100" cy="168" rx="65" ry="25" fill="#FF5722" opacity="0.2"/>
    </svg>

    <svg v-else viewBox="0 0 200 200">
      <defs>
        <radialGradient id="moon">
          <stop offset="0%" stop-color="#FFFDE7"/>
          <stop offset="100%" stop-color="#FFF9C4"/>
        </radialGradient>
      </defs>
      <circle v-for="(s, i) in stars" :key="i" :cx="s.x" :cy="s.y" :r="s.r" fill="#FFF">
        <animate attributeName="opacity" :values="`0.3;${s.o};0.3`" :dur="`${3+i%2}s`" repeatCount="indefinite"/>
      </circle>
      <circle cx="100" cy="100" r="33" fill="url(#moon)"/>
      <circle cx="88" cy="92" r="5" fill="#FFF9C4" opacity="0.3"/>
      <circle cx="106" cy="96" r="4" fill="#FFF9C4" opacity="0.35"/>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

defineProps<{ condition: string }>()

const stars = computed(() => [
  {x:40,y:35,r:1.5,o:0.9}, {x:145,y:40,r:1,o:0.7}, {x:70,y:30,r:1.2,o:0.8},
  {x:125,y:35,r:1.8,o:0.95}, {x:30,y:60,r:1,o:0.75}, {x:160,y:65,r:1.3,o:0.85}
])
</script>

<style scoped>
.weather-icon { filter: drop-shadow(0 8px 20px rgba(0,0,0,0.3)); }
svg { width: 100%; height: 100%; }
</style>
*/