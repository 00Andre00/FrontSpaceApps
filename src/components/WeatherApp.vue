<template>
  <div class="min-h-screen flex">
    <!-- Layout Principal -->
    <div class="flex-1 flex flex-col lg:flex-row">
      
      <!-- Panel Lateral de Datos NASA - SOLO en Desktop (lg:) -->
      <div class="hidden lg:flex lg:w-96 flex-shrink-0 bg-black/30 backdrop-blur-2xl border-r border-white/20 p-6 overflow-y-auto">
        <div class="w-full space-y-6">
          <!-- Header del Panel -->
          <div>
            <div class="text-xl font-semibold text-white mb-2">🛰️ Datos NASA</div>
            <div class="text-sm text-white/60 flex items-center gap-2">
              <span>📍</span>
              <span class="truncate">{{ store.selectedLocation.name }}, {{ store.selectedLocation.region }}</span>
            </div>
          </div>

          <!-- Tarjeta de Temperatura -->
          <div class="bg-white/10 rounded-xl p-4 border border-white/20">
            <div class="flex justify-between items-center mb-2">
              <div class="text-white/70 text-sm">Temperatura Actual</div>
              <div class="text-2xl font-bold text-white">{{ store.temperature }}°C</div>
            </div>
            <div class="text-white/50 text-xs">Modelo de predicción NASA</div>
          </div>

          <!-- Grid de Métricas -->
          <div class="grid grid-cols-2 gap-3">
            <MetricCard title="Humedad" :value="store.nasaData?.humidity || 0" unit="%" />
            <MetricCard title="Viento" :value="store.nasaData?.windSpeed || 0" unit="m/s" />
            <MetricCard title="Lluvia" :value="store.nasaData?.precipitation || 0" unit="mm" />
            <MetricCard title="Nubes" :value="store.nasaData?.cloudCover || 0" unit="%" />
          </div>

          <!-- Calidad del Aire -->
          <div class="bg-white/10 rounded-xl p-4 border border-white/20">
            <div class="text-white/70 text-sm mb-2">Calidad del Aire</div>
            <div class="flex items-center justify-between">
              <div class="text-white font-semibold text-lg">{{ store.nasaData?.airQuality || 0 }}/100</div>
              <div class="text-xs px-2 py-1 rounded-full" :class="getAirQualityClass(store.nasaData?.airQuality || 0)">
                {{ getAirQualityText(store.nasaData?.airQuality || 0) }}
              </div>
            </div>
          </div>

          <!-- Índice UV -->
          <div class="bg-white/10 rounded-xl p-4 border border-white/20">
            <div class="text-white/70 text-sm mb-2">Índice UV</div>
            <div class="flex items-center justify-between mb-2">
              <div class="text-white font-semibold text-lg">{{ store.nasaData?.uvIndex || 0 }}</div>
              <div class="text-xs px-2 py-1 rounded-full" :class="getUVClass(store.nasaData?.uvIndex || 0)">
                {{ getUVText(store.nasaData?.uvIndex || 0) }}
              </div>
            </div>
            <div class="w-full bg-white/20 rounded-full h-2">
              <div class="bg-yellow-400 h-2 rounded-full transition-all duration-500" 
                   :style="{ width: `${Math.min(100, (store.nasaData?.uvIndex || 0) * 8.33)}%` }"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Contenido Principal -->
      <div class="flex-1 flex flex-col min-h-0">
        
        <!-- Header Superior -->
        <div class="bg-black/20 backdrop-blur-2xl border-b border-white/10 px-4 sm:px-6 py-4">
          <div class="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
            
            <!-- Hora y Fecha -->
            <div class="text-white text-center sm:text-left">
              <div class="text-2xl sm:text-3xl md:text-4xl font-light tracking-tight mb-1">
                {{ time }}
              </div>
              <div class="text-base sm:text-lg md:text-xl text-white/80 capitalize">
                {{ date }}
              </div>
            </div>
            
            <!-- Temperatura y Condición -->
            <div class="text-white text-center sm:text-right">
              <div class="text-2xl sm:text-3xl md:text-4xl font-light mb-1">
                {{ store.temperature }}°
              </div>
              <div class="text-base sm:text-lg md:text-xl text-white/80 capitalize">
                {{ conditionText }}
              </div>
              <div class="text-xs sm:text-sm text-white/60 mt-1 flex items-center justify-center sm:justify-end gap-1">
                <span>📍</span>
                <span class="max-w-[140px] sm:max-w-none truncate">{{ store.selectedLocation.name }}, {{ store.selectedLocation.region }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Contenido Central -->
        <div class="flex-1 flex flex-col lg:flex-row items-center justify-center p-4 sm:p-6 gap-6 lg:gap-8">
          
          <!-- Icono del Clima -->
          <div class="flex-1 flex justify-center">
            <div class="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 xl:w-80 xl:h-80">
              <WeatherIcon :condition="store.weatherCondition" />
            </div>
          </div>

          <!-- Panel de Controles -->
          <div class="flex-1 w-full max-w-md">
            <div class="bg-black/40 backdrop-blur-2xl rounded-xl sm:rounded-2xl border border-white/20 p-4 sm:p-6 shadow-2xl">
              
              <!-- Búsqueda -->
              <div class="mb-4 sm:mb-6">
                <label class="block text-white/70 text-sm sm:text-base font-medium mb-2 sm:mb-3">🔍 Buscar en Perú</label>
                <div class="relative">
                  <input 
                    type="text" 
                    v-model="store.searchQuery"
                    placeholder="Ej: Lima, Arequipa..."
                    class="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 text-sm sm:text-base"
                  />
                </div>
                
                <!-- Resultados de Búsqueda -->
                <div v-if="store.searchQuery && store.allLocations.length > 0" 
                     class="mt-2 max-h-40 overflow-y-auto bg-black/80 rounded-lg border border-white/20">
                  <div v-for="location in store.allLocations" 
                       :key="location.name"
                       @click="store.selectSearchedLocation(location)"
                       class="px-3 sm:px-4 py-2 sm:py-3 hover:bg-white/10 cursor-pointer border-b border-white/10 last:border-b-0">
                    <div class="text-white font-medium text-sm sm:text-base">{{ location.name }}</div>
                    <div class="text-white/60 text-xs sm:text-sm">{{ location.region }}</div>
                  </div>
                </div>
              </div>

              <!-- Ubicación Actual -->
              <div class="mb-4 sm:mb-6" v-if="!store.searchQuery">
                <label class="block text-white/70 text-sm sm:text-base font-medium mb-2 sm:mb-3">📍 Ubicación Actual</label>
                <div class="px-3 sm:px-4 py-2 sm:py-3 bg-white/10 border border-white/20 rounded-lg text-white">
                  <div class="font-medium text-sm sm:text-base">{{ store.selectedLocation.name }}</div>
                  <div class="text-white/60 text-xs sm:text-sm">{{ store.selectedLocation.region }}</div>
                </div>
              </div>

              <!-- Fecha y Hora -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div>
                  <label class="block text-white/70 text-xs sm:text-sm font-medium mb-2">📅 Fecha</label>
                  <input type="date" v-model="store.selectedDate"
                         class="w-full px-2 sm:px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/30 text-xs sm:text-sm"/>
                </div>
                <div>
                  <label class="block text-white/70 text-xs sm:text-sm font-medium mb-2">🕒 Hora</label>
                  <input type="time" v-model="store.selectedTime"
                         class="w-full px-2 sm:px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/30 text-xs sm:text-sm"/>
                </div>
              </div>

              <!-- Botón Hora Actual -->
              <button @click="store.setCurrentTime"
                      class="w-full bg-white/20 hover:bg-white/30 border border-white/30 text-white font-semibold py-2 sm:py-3 rounded-lg transition-all duration-200 active:scale-95 text-sm sm:text-base">
                🔄 Hora Actual
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Panel Móvil Inferior - Visible en Móvil Y Tablet (oculto en lg) -->
    <div class="lg:hidden fixed bottom-0 left-0 right-0 bg-black/60 backdrop-blur-2xl border-t border-white/20 p-4 z-20">
      <div class="grid grid-cols-4 gap-3 text-center">
        <MetricCard mobile title="Temp" :value="store.temperature" unit="°" />
        <MetricCard mobile title="Humedad" :value="store.nasaData?.humidity || 0" unit="%" />
        <MetricCard mobile title="Viento" :value="store.nasaData?.windSpeed || 0" unit="m/s" />
        <MetricCard mobile title="Lluvia" :value="store.nasaData?.precipitation || 0" unit="mm" />
      </div>
    </div>

    <!-- ELIMINADO: Panel lateral para tablet ya no existe -->
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useWeatherStore } from '../stores/weather'
import WeatherIcon from './WeatherIcon.vue'
import MetricCard from './MetricCard.vue'

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
/* Scroll personalizado */
::-webkit-scrollbar {
  width: 4px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
}

/* Asegurar que el contenido sea accesible */
@media (max-width: 1023px) {
  .min-h-screen {
    padding-bottom: 80px; /* Espacio para el panel inferior en móvil y tablet */
  }
}

/* Para tablets en landscape */
@media (min-width: 768px) and (max-width: 1024px) and (orientation: landscape) {
  .min-h-screen {
    padding-bottom: 70px;
  }
  
  /* Ajustar el grid del panel inferior para landscape */
  .lg\\:hidden .grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 2px;
  }
  
  /* Reducir padding en landscape */
  .lg\\:hidden {
    padding: 8px;
  }
}

/* Mejorar el panel inferior en tablet */
@media (min-width: 768px) and (max-width: 1023px) {
  .lg\\:hidden {
    padding: 12px 16px;
    background: rgba(0, 0, 0, 0.7);
  }
  
  .lg\\:hidden .grid {
    gap: 8px;
  }
}
</style>