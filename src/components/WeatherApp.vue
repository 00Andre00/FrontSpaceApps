<template>
  <div class="min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 weather-app-container">
    
    <!-- Panel lateral - Visible en iPad y desktop, oculto en móvil -->
    <div class="hidden md:flex md:w-80 lg:w-96 flex-shrink-0 bg-black/30 backdrop-blur-2xl border-b lg:border-r border-white/20 p-6 overflow-y-auto">
      <div class="w-full">
        <div class="text-white mb-6">
          <div class="text-xl font-semibold mb-2">🛰️ Datos NASA</div>
          <div class="text-sm text-white/60 flex items-center gap-2">
            <span>📍</span>
            <span class="truncate">{{ store.selectedLocation.name }}, {{ store.selectedLocation.region }}</span>
          </div>
        </div>

        <!-- Indicador de fuente de datos -->
        <div class="mb-6 p-4 bg-blue-500/20 border border-blue-400/30 rounded-xl">
          <div class="text-blue-200 text-sm flex items-center gap-2 mb-1">
            <span>🌍</span>
            <span class="font-semibold">Satélites NASA</span>
          </div>
          <div class="text-blue-300/80 text-xs">
            Datos basados en observación satelital
          </div>
        </div>

        <!-- Datos principales -->
        <div class="space-y-4">
          <!-- Temperatura -->
          <div class="bg-white/10 rounded-xl p-4 border border-white/20">
            <div class="flex justify-between items-center">
              <div class="text-white/70 text-sm">Temperatura</div>
              <div class="text-2xl font-bold text-white">{{ store.temperature }}°C</div>
            </div>
            <div class="text-white/50 text-xs mt-1">Modelo NASA</div>
          </div>

          <!-- Condiciones en grid responsive -->
          <div class="grid grid-cols-2 gap-3">
            <div class="bg-white/10 rounded-lg p-3 border border-white/20">
              <div class="text-white/50 text-xs">Humedad</div>
              <div class="text-white font-semibold text-base">{{ store.nasaData?.humidity || 0 }}%</div>
            </div>
            <div class="bg-white/10 rounded-lg p-3 border border-white/20">
              <div class="text-white/50 text-xs">Viento</div>
              <div class="text-white font-semibold text-base">{{ store.nasaData?.windSpeed || 0 }} m/s</div>
            </div>
            <div class="bg-white/10 rounded-lg p-3 border border-white/20">
              <div class="text-white/50 text-xs">Lluvia</div>
              <div class="text-white font-semibold text-base">{{ store.nasaData?.precipitation || 0 }} mm</div>
            </div>
            <div class="bg-white/10 rounded-lg p-3 border border-white/20">
              <div class="text-white/50 text-xs">Nubes</div>
              <div class="text-white font-semibold text-base">{{ store.nasaData?.cloudCover || 0 }}%</div>
            </div>
          </div>

          <!-- Calidad del Aire -->
          <div class="bg-white/10 rounded-xl p-4 border border-white/20">
            <div class="text-white/70 text-sm mb-2">Calidad del Aire</div>
            <div class="flex items-center justify-between">
              <div class="text-white font-semibold text-lg">{{ store.nasaData?.airQuality || 0 }}/100</div>
              <div class="text-xs px-2 py-1 rounded-full" 
                   :class="getAirQualityClass(store.nasaData?.airQuality || 0)">
                {{ getAirQualityText(store.nasaData?.airQuality || 0) }}
              </div>
            </div>
          </div>

          <!-- Índice UV -->
          <div class="bg-white/10 rounded-xl p-4 border border-white/20">
            <div class="text-white/70 text-sm mb-2">Índice UV</div>
            <div class="flex items-center justify-between mb-2">
              <div class="text-white font-semibold text-lg">{{ store.nasaData?.uvIndex || 0 }}</div>
              <div class="text-xs px-2 py-1 rounded-full" 
                   :class="getUVClass(store.nasaData?.uvIndex || 0)">
                {{ getUVText(store.nasaData?.uvIndex || 0) }}
              </div>
            </div>
            <div class="w-full bg-white/20 rounded-full h-2">
              <div class="bg-yellow-400 h-2 rounded-full" 
                   :style="{ width: `${Math.min(100, (store.nasaData?.uvIndex || 0) * 8.33)}%` }"></div>
            </div>
          </div>

          <!-- Probabilidades NASA -->
          <div class="bg-white/10 rounded-xl p-4 border border-white/20">
            <div class="text-white/70 text-sm mb-3">Probabilidades NASA</div>
            <div class="space-y-2">
              <div class="flex justify-between items-center">
                <span class="text-white/80 text-xs">Calor extremo</span>
                <span class="text-red-400 font-semibold text-sm">{{ Math.round(store.nasaData?.probability?.extremeHeat || 0) }}%</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-white/80 text-xs">Lluvia intensa</span>
                <span class="text-blue-400 font-semibold text-sm">{{ Math.round(store.nasaData?.probability?.heavyRain || 0) }}%</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-white/80 text-xs">Vientos fuertes</span>
                <span class="text-yellow-400 font-semibold text-sm">{{ Math.round(store.nasaData?.probability?.strongWinds || 0) }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenido principal -->
    <div class="flex-1 flex flex-col min-h-0">
      
      <!-- Header - Mejorado para iPad -->
      <div class="weather-header-ipad bg-black/20 backdrop-blur-2xl border-b border-white/10 px-6 py-4">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 max-w-7xl mx-auto w-full">
          
          <!-- Hora y fecha -->
          <div class="text-white flex-1 min-w-0">
            <div class="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight mb-2 leading-tight">
              {{ time }}
            </div>
            <div class="text-lg md:text-xl lg:text-2xl font-medium text-white/80 leading-tight">
              {{ date }}
            </div>
          </div>
          
          <!-- Temperatura y ubicación -->
          <div class="text-white text-right flex-1 min-w-0">
            <div class="text-4xl md:text-5xl lg:text-6xl font-light mb-2 leading-tight">
              {{ store.temperature }}°
            </div>
            <div class="text-lg md:text-xl lg:text-2xl font-medium text-white/80 capitalize leading-tight">
              {{ conditionText }}
            </div>
            <div class="text-sm text-white/60 mt-1 flex items-center justify-end gap-1">
              <span>📍</span>
              <span class="truncate max-w-[200px]">
                {{ store.selectedLocation.name }}, {{ store.selectedLocation.region }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Contenido principal - Layout corregido para iPad -->
      <div class="weather-content-ipad flex-1 flex flex-col md:flex-row items-center justify-between p-6 gap-6 min-h-0">
        
        <!-- Icono del clima - Lado izquierdo en iPad -->
        <div class="flex-1 flex items-center justify-center md:justify-start">
          <div class="weather-icon-ipad w-64 h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 flex-shrink-0">
            <WeatherIcon :condition="store.weatherCondition" />
          </div>
        </div>

        <!-- Panel de controles - Lado derecho en iPad -->
        <div class="flex-1 max-w-md lg:max-w-lg">
          <div class="bg-black/40 backdrop-blur-2xl rounded-2xl border border-white/20 p-6 shadow-2xl">
            
            <!-- Búsqueda de ubicación -->
            <div class="mb-4">
              <label class="block text-white/70 text-base font-medium mb-2">🔍 BUSCAR EN PERÚ</label>
              <div class="relative">
                <input 
                  type="text" 
                  v-model="store.searchQuery"
                  placeholder="Nombre de ciudad..."
                  class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/30 focus:bg-white/20 pr-12 text-base placeholder-white/50 transition-all duration-200"
                />
                <div class="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 text-lg">
                  🔍
                </div>
              </div>
              
              <!-- Resultados de búsqueda -->
              <div v-if="store.searchQuery && store.allLocations.length > 0" 
                   class="mt-2 max-h-40 overflow-y-auto bg-black/80 rounded-lg border border-white/20 shadow-lg">
                <div v-for="location in store.allLocations" 
                     :key="location.name"
                     @click="store.selectSearchedLocation(location)"
                     class="px-4 py-3 hover:bg-white/10 cursor-pointer border-b border-white/10 last:border-b-0 transition-colors duration-150">
                  <div class="text-white font-medium text-base truncate">{{ location.name }}</div>
                  <div class="text-white/60 text-sm truncate">{{ location.region }}</div>
                </div>
              </div>
            </div>

            <!-- Ubicación actual -->
            <div class="mb-4" v-if="!store.searchQuery">
              <label class="block text-white/70 text-base font-medium mb-2">📍 UBICACIÓN ACTUAL</label>
              <div class="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white">
                <div class="font-medium text-base truncate">{{ store.selectedLocation.name }}</div>
                <div class="text-white/60 text-sm truncate">{{ store.selectedLocation.region }}</div>
              </div>
            </div>

            <!-- Fecha y Hora -->
            <div class="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label class="block text-white/70 text-base font-medium mb-2">📅 FECHA</label>
                <input type="date" v-model="store.selectedDate"
                       class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/30 focus:bg-white/20 text-base transition-all duration-200"/>
              </div>
              <div>
                <label class="block text-white/70 text-base font-medium mb-2">🕒 HORA</label>
                <input type="time" v-model="store.selectedTime"
                       class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/30 focus:bg-white/20 text-base transition-all duration-200"/>
              </div>
            </div>

            <!-- Botón Hora Actual -->
            <button @click="store.setCurrentTime"
                    class="w-full bg-white/20 hover:bg-white/30 border border-white/30 text-white font-semibold py-3 rounded-lg transition-all duration-200 text-base active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/50">
              🔄 Hora Actual
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Panel móvil inferior - Solo visible en móvil -->
    <div class="md:hidden bg-black/40 backdrop-blur-2xl border-t border-white/20 p-4">
      <div class="grid grid-cols-3 gap-3 text-center">
        <div class="bg-white/10 rounded-lg p-3 border border-white/20">
          <div class="text-white/50 text-xs">Humedad</div>
          <div class="text-white font-semibold text-sm">{{ store.nasaData?.humidity || 0 }}%</div>
        </div>
        <div class="bg-white/10 rounded-lg p-3 border border-white/20">
          <div class="text-white/50 text-xs">Viento</div>
          <div class="text-white font-semibold text-sm">{{ store.nasaData?.windSpeed || 0 }} m/s</div>
        </div>
        <div class="bg-white/10 rounded-lg p-3 border border-white/20">
          <div class="text-white/50 text-xs">Lluvia</div>
          <div class="text-white font-semibold text-sm">{{ store.nasaData?.precipitation || 0 }} mm</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useWeatherStore } from '../stores/weather'
import WeatherIcon from './WeatherIcon.vue'

const store = useWeatherStore()

const date = computed(() => {
  return store.currentDateTime.toLocaleDateString('es-ES', {
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric'
  })
})

const time = computed(() => {
  return store.currentDateTime.toLocaleTimeString('es-ES', {
    hour: '2-digit', 
    minute: '2-digit', 
    hour12: false
  })
})

const conditionText = computed(() => {
  const conditionMap = {
    sunny: 'Soleado', 
    rainy: 'Lluvioso', 
    cloudy: 'Nublado',
    night: 'Noche', 
    sunrise: 'Amanecer', 
    sunset: 'Atardecer'
  } as const
  
  return conditionMap[store.weatherCondition as keyof typeof conditionMap] || 'Desconocido'
})

// Funciones para calidad del aire
const getAirQualityClass = (quality: number) => {
  if (quality >= 80) return 'bg-green-500/30 text-green-300'
  if (quality >= 60) return 'bg-yellow-500/30 text-yellow-300'
  if (quality >= 40) return 'bg-orange-500/30 text-orange-300'
  return 'bg-red-500/30 text-red-300'
}

const getAirQualityText = (quality: number) => {
  if (quality >= 80) return 'Excelente'
  if (quality >= 60) return 'Buena'
  if (quality >= 40) return 'Moderada'
  return 'Mala'
}

// Funciones para índice UV
const getUVClass = (uv: number) => {
  if (uv <= 2) return 'bg-green-500/30 text-green-300'
  if (uv <= 5) return 'bg-yellow-500/30 text-yellow-300'
  if (uv <= 7) return 'bg-orange-500/30 text-orange-300'
  if (uv <= 10) return 'bg-red-500/30 text-red-300'
  return 'bg-purple-500/30 text-purple-300'
}

const getUVText = (uv: number) => {
  if (uv <= 2) return 'Bajo'
  if (uv <= 5) return 'Moderado'
  if (uv <= 7) return 'Alto'
  if (uv <= 10) return 'Muy Alto'
  return 'Extremo'
}
</script>

<style scoped>
/* Mejoras de scroll */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

/* Layout específico para iPad */
@media (min-width: 768px) and (max-width: 1024px) {
  .weather-header-ipad {
    padding: 1.5rem 2rem !important;
  }
  
  .weather-content-ipad {
    padding: 2rem !important;
    flex-direction: row !important;
    align-items: center !important;
    justify-content: space-between !important;
    gap: 2rem !important;
  }
  
  .weather-icon-ipad {
    width: 280px !important;
    height: 280px !important;
    margin: 0 !important;
  }
  
  /* Asegurar que el panel de controles ocupe el espacio correcto */
  .weather-content-ipad > div:last-child {
    flex: 0 0 400px !important;
    max-width: 400px !important;
  }
}

/* Para tablets más pequeñas */
@media (min-width: 640px) and (max-width: 767px) {
  .weather-content-ipad {
    flex-direction: column !important;
    gap: 2rem !important;
  }
  
  .weather-icon-ipad {
    width: 240px !important;
    height: 240px !important;
  }
}

/* Para desktop */
@media (min-width: 1025px) {
  .weather-content-ipad {
    gap: 4rem !important;
    padding: 3rem !important;
  }
  
  .weather-icon-ipad {
    width: 320px !important;
    height: 320px !important;
  }
}

/* Orientación landscape en iPad */
@media (min-width: 768px) and (max-width: 1024px) and (orientation: landscape) {
  .weather-content-ipad {
    padding: 1rem 2rem !important;
    gap: 1.5rem !important;
  }
  
  .weather-icon-ipad {
    width: 220px !important;
    height: 220px !important;
  }
  
  .weather-content-ipad > div:last-child {
    flex: 0 0 350px !important;
    max-width: 350px !important;
  }
}

/* Mejoras de accesibilidad */
input:focus,
button:focus {
  outline: 2px solid rgba(255, 255, 255, 0.5);
  outline-offset: 2px;
}

/* Transiciones suaves */
* {
  transition: color 0.2s ease, background-color 0.2s ease, border-color 0.2s ease;
}

/* Soporte para movimiento reducido */
@media (prefers-reduced-motion: reduce) {
  * {
    transition: none !important;
    animation: none !important;
  }
}
</style>