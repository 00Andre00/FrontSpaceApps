<template>
  <div class="min-h-screen flex flex-col lg:flex-row">
    <!-- Panel lateral - Oculto en móvil, visible desde tablet -->
    <div class="hidden md:block md:w-80 bg-black/30 backdrop-blur-2xl border-b lg:border-r border-white/20 p-4 lg:p-6 overflow-y-auto">
      <div class="text-white mb-4 lg:mb-6">
        <div class="text-lg font-semibold mb-2">🛰️ Datos NASA</div>
        <div class="text-sm text-white/60 flex items-center gap-2">
          <span>📍</span>
          <span>{{ store.selectedLocation.name }}, {{ store.selectedLocation.region }}</span>
        </div>
      </div>

      <!-- Indicador de fuente de datos -->
      <div class="mb-4 p-3 bg-blue-500/20 border border-blue-400/30 rounded-xl">
        <div class="text-blue-200 text-sm flex items-center gap-2 mb-1">
          <span>🌍</span>
          <span class="font-semibold">Satélites NASA</span>
        </div>
        <div class="text-blue-300/80 text-xs">
          Datos basados en observación satelital
        </div>
      </div>

      <!-- Datos principales -->
      <div class="space-y-3 lg:space-y-4">
        <!-- Temperatura -->
        <div class="bg-white/10 rounded-xl p-3 lg:p-4 border border-white/20">
          <div class="flex justify-between items-center">
            <div class="text-white/70 text-sm">Temperatura</div>
            <div class="text-xl lg:text-2xl font-bold text-white">{{ store.temperature }}°C</div>
          </div>
          <div class="text-white/50 text-xs mt-1">Modelo NASA</div>
        </div>

        <!-- Condiciones en grid responsive -->
        <div class="grid grid-cols-2 gap-2 lg:gap-3">
          <div class="bg-white/10 rounded-lg p-2 lg:p-3 border border-white/20">
            <div class="text-white/50 text-xs">Humedad</div>
            <div class="text-white font-semibold text-sm lg:text-base">{{ store.nasaData?.humidity || 0 }}%</div>
          </div>
          <div class="bg-white/10 rounded-lg p-2 lg:p-3 border border-white/20">
            <div class="text-white/50 text-xs">Viento</div>
            <div class="text-white font-semibold text-sm lg:text-base">{{ store.nasaData?.windSpeed || 0 }} m/s</div>
          </div>
          <div class="bg-white/10 rounded-lg p-2 lg:p-3 border border-white/20">
            <div class="text-white/50 text-xs">Lluvia</div>
            <div class="text-white font-semibold text-sm lg:text-base">{{ store.nasaData?.precipitation || 0 }} mm</div>
          </div>
          <div class="bg-white/10 rounded-lg p-2 lg:p-3 border border-white/20">
            <div class="text-white/50 text-xs">Nubes</div>
            <div class="text-white font-semibold text-sm lg:text-base">{{ store.nasaData?.cloudCover || 0 }}%</div>
          </div>
        </div>

        <!-- Calidad del Aire -->
        <div class="bg-white/10 rounded-xl p-3 lg:p-4 border border-white/20">
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
        <div class="bg-white/10 rounded-xl p-3 lg:p-4 border border-white/20">
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
        <div class="bg-white/10 rounded-xl p-3 lg:p-4 border border-white/20">
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

    <!-- Contenido principal -->
    <div class="flex-1 flex flex-col min-h-0">
      <!-- Header responsive -->
      <div class="bg-black/20 backdrop-blur-2xl border-b border-white/10 px-4 lg:px-6 py-3 lg:py-6">
        <div class="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0 max-w-5xl mx-auto">
          <div class="text-white text-center sm:text-left order-2 sm:order-1">
            <div class="text-3xl sm:text-4xl lg:text-6xl font-light tracking-tight mb-1">{{ time }}</div>
            <div class="text-base sm:text-lg lg:text-2xl font-medium text-white/80">{{ date }}</div>
          </div>
          <div class="text-white text-center sm:text-right order-1 sm:order-2">
            <div class="text-3xl sm:text-4xl lg:text-5xl font-light mb-1">{{ store.temperature }}°</div>
            <div class="text-base sm:text-lg lg:text-xl font-medium text-white/80 capitalize">{{ conditionText }}</div>
            <div class="text-xs sm:text-sm text-white/60 mt-1 flex items-center justify-center sm:justify-end gap-1">
              <span>📍</span>
              <span>{{ store.selectedLocation.name }}, {{ store.selectedLocation.region }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Área del icono del clima - Mejor responsive -->
      <div class="flex-1 flex items-center justify-center p-4 lg:p-6 relative min-h-0">
        <div class="w-40 h-40 sm:w-48 sm:h-48 lg:w-64 lg:h-64 xl:w-80 xl:h-80">
          <WeatherIcon :condition="store.weatherCondition" />
        </div>

        <!-- Panel de controles - Mejor responsive -->
        <div class="absolute bottom-2 sm:bottom-4 lg:bottom-8 left-1/2 -translate-x-1/2 w-full max-w-md lg:max-w-2xl px-3 sm:px-4 lg:px-6">
          <div class="bg-black/40 backdrop-blur-2xl rounded-xl lg:rounded-2xl border border-white/20 p-3 sm:p-4 lg:p-6">
            
            <!-- Búsqueda de ubicación -->
            <div class="mb-3 lg:mb-4">
              <label class="block text-white/70 text-xs sm:text-sm font-medium mb-2">🔍 BUSCAR EN PERÚ</label>
              <div class="relative">
                <input 
                  type="text" 
                  v-model="store.searchQuery"
                  placeholder="Nombre de ciudad..."
                  class="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/10 border border-white/20 rounded-lg sm:rounded-xl text-white focus:outline-none focus:bg-white/20 pr-10 text-sm sm:text-base"
                />
                <div class="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 text-sm">
                  🔍
                </div>
              </div>
              
              <!-- Resultados de búsqueda -->
              <div v-if="store.searchQuery && store.allLocations.length > 0" 
                   class="mt-2 max-h-32 lg:max-h-40 overflow-y-auto bg-black/60 rounded-lg border border-white/20">
                <div v-for="location in store.allLocations" 
                     :key="location.name"
                     @click="store.selectSearchedLocation(location)"
                     class="px-3 py-2 hover:bg-white/10 cursor-pointer border-b border-white/10 last:border-b-0">
                  <div class="text-white font-medium text-sm">{{ location.name }}</div>
                  <div class="text-white/60 text-xs">{{ location.region }}</div>
                </div>
              </div>
              
              <!-- Sin resultados -->
              <div v-if="store.searchQuery && store.allLocations.length === 0" 
                   class="mt-2 px-3 py-2 bg-black/50 rounded-lg border border-white/20 text-white/60 text-center text-sm">
                No se encontraron ubicaciones
              </div>
            </div>

            <!-- Ubicación actual seleccionada -->
            <div class="mb-3 lg:mb-4" v-if="!store.searchQuery">
              <label class="block text-white/70 text-xs sm:text-sm font-medium mb-2">📍 UBICACIÓN ACTUAL</label>
              <div class="px-3 sm:px-4 py-2 sm:py-3 bg-white/10 border border-white/20 rounded-lg sm:rounded-xl text-white">
                <div class="font-medium text-sm sm:text-base">{{ store.selectedLocation.name }}</div>
                <div class="text-white/60 text-xs sm:text-sm">{{ store.selectedLocation.region }}</div>
              </div>
            </div>

            <!-- Fecha y Hora -->
            <div class="grid grid-cols-2 gap-2 sm:gap-3 lg:gap-4 mb-3 sm:mb-4 lg:mb-6">
              <div>
                <label class="block text-white/70 text-xs sm:text-sm font-medium mb-2">📅 FECHA</label>
                <input type="date" v-model="store.selectedDate"
                       class="w-full px-2 sm:px-3 py-2 sm:py-3 bg-white/10 border border-white/20 rounded-lg sm:rounded-xl text-white focus:outline-none focus:bg-white/20 text-xs sm:text-sm"/>
              </div>
              <div>
                <label class="block text-white/70 text-xs sm:text-sm font-medium mb-2">🕒 HORA</label>
                <input type="time" v-model="store.selectedTime"
                       class="w-full px-2 sm:px-3 py-2 sm:py-3 bg-white/10 border border-white/20 rounded-lg sm:rounded-xl text-white focus:outline-none focus:bg-white/20 text-xs sm:text-sm"/>
              </div>
            </div>

            <!-- Botón único "Ahora" -->
            <div class="flex gap-2 sm:gap-3">
              <button @click="store.setCurrentTime"
                      class="flex-1 bg-white/20 hover:bg-white/30 border border-white/30 text-white font-semibold py-2 sm:py-3 rounded-lg sm:rounded-xl transition-all text-sm sm:text-base">
                🔄 Hora Actual
              </button>
            </div>
          </div>
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

const date = computed(() => store.currentDateTime.toLocaleDateString('es-ES', {
  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
}))

const time = computed(() => store.currentDateTime.toLocaleTimeString('es-ES', {
  hour: '2-digit', minute: '2-digit', hour12: false
}))

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