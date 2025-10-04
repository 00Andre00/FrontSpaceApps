<template>
  <div class="weather-icon">
    <!-- Sol -->
    <svg v-if="condition === 'sunny'" class="w-full h-full" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="25" fill="#FFD700" class="sun-glow"/>
      <g v-for="i in 8" :key="i" :transform="`rotate(${i * 45} 50 50)`">
        <rect x="48" y="15" width="4" height="15" rx="2" fill="#FFD700"/>
      </g>
    </svg>
    
    <!-- Amanecer -->
    <svg v-else-if="condition === 'sunrise'" class="w-full h-full" viewBox="0 0 100 100">
      <circle cx="50" cy="40" r="18" fill="#FFA726" class="animate-pulse-slow"/>
      <g v-for="i in 6" :key="i" :transform="`rotate(${i * 60} 50 50)`">
        <rect x="48" y="25" width="4" height="12" rx="2" fill="#FFA726"/>
      </g>
    </svg>
    
    <!-- Nube con lluvia -->
    <svg v-else-if="condition === 'rainy'" class="w-full h-full" viewBox="0 0 100 100">
      <path d="M30,45 Q20,30 40,25 Q45,10 65,15 Q80,5 85,25 Q95,25 85,40 Q90,45 80,45 L30,45 Z" fill="#B0BEC5" class="animate-float"/>
      <g v-for="i in 3" :key="i">
        <line 
          :x1="35 + i*15" 
          :y1="65" 
          :x2="35 + i*15" 
          :y2="75" 
          stroke="#64B5F6" 
          stroke-width="3" 
          class="animate-rain"
          :style="`animation-delay: ${i * 0.2}s`"
        />
      </g>
    </svg>
    
    <!-- Nubes -->
    <svg v-else-if="condition === 'cloudy'" class="w-full h-full" viewBox="0 0 100 100">
      <path d="M25,45 Q15,30 35,25 Q40,10 60,15 Q75,5 80,25 Q90,25 80,40 Q85,45 75,45 L25,45 Z" fill="#E0E0E0"/>
      <path d="M15,55 Q5,40 25,35 Q30,20 50,25 Q65,15 70,35 Q80,35 70,50 Q75,55 65,55 L15,55 Z" fill="#EEEEEE" class="animate-float" style="animation-delay: 1s"/>
    </svg>
    
    <!-- Atardecer -->
    <svg v-else-if="condition === 'sunset'" class="w-full h-full" viewBox="0 0 100 100">
      <circle cx="50" cy="35" r="20" fill="#FF7043" class="animate-pulse-slow"/>
      <g v-for="i in 8" :key="i" :transform="`rotate(${i * 45} 50 50)`">
        <rect x="48" y="20" width="4" height="15" rx="2" fill="#FF7043" :opacity="0.7 - (i * 0.05)"/>
      </g>
    </svg>
    
    <!-- Noche con luna y estrellas -->
    <svg v-else class="w-full h-full" viewBox="0 0 100 100">
      <!-- Luna -->
      <path d="M50,30 Q60,20 70,30 Q80,40 70,50 Q60,60 50,50 Q40,40 50,30 Z" fill="#FFEB3B" class="animate-pulse-slow"/>
      
      <!-- Estrellas -->
      <circle cx="25" cy="25" r="1.5" fill="#FFFFFF" class="star" style="animation-delay: 0s"/>
      <circle cx="80" cy="30" r="1" fill="#FFFFFF" class="star" style="animation-delay: 0.5s"/>
      <circle cx="35" cy="70" r="2" fill="#FFFFFF" class="star" style="animation-delay: 1s"/>
      <circle cx="75" cy="65" r="1.2" fill="#FFFFFF" class="star" style="animation-delay: 1.5s"/>
      <circle cx="20" cy="50" r="1" fill="#FFFFFF" class="star" style="animation-delay: 0.8s"/>
      <circle cx="60" cy="20" r="1.3" fill="#FFFFFF" class="star" style="animation-delay: 1.2s"/>
    </svg>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  condition: string;
}>();
</script>