<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 max-w-md w-full animate-fade-in">
      <h1 class="text-3xl font-bold text-center mb-6 text-gray-800">Clima Dinámico</h1>
      
      <!-- Selectores de fecha y hora -->
      <div class="mb-6 space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
          <input 
            type="date" 
            v-model="weatherStore.selectedDate"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          >
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Hora</label>
          <input 
            type="time" 
            v-model="weatherStore.selectedTime"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          >
        </div>
      </div>
      
      <!-- Información del clima -->
      <div class="bg-white/60 rounded-xl p-6 shadow-lg animate-slide-up">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h2 class="text-2xl font-semibold text-gray-800">{{ formattedDate }}</h2>
            <p class="text-gray-600">{{ formattedTime }}</p>
          </div>
          <div class="text-4xl font-bold text-gray-800">
            {{ weatherStore.temperature }}°C
          </div>
        </div>
        
        <!-- Icono del clima -->
        <div class="flex justify-center my-6">
          <WeatherIcon :condition="weatherStore.weatherCondition" class="w-32 h-32" />
        </div>
        
        <!-- Condición climática -->
        <div class="text-center">
          <p class="text-xl font-medium text-gray-700 capitalize">
            {{ weatherConditionText }}
          </p>
          <p class="text-sm text-gray-500 mt-1">
            {{ weatherDescription }}
          </p>
        </div>
      </div>
      
      <!-- Botones de control -->
      <div class="mt-6 flex gap-3">
        <button 
          @click="weatherStore.setCurrentTime"
          class="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-all duration-200 transform hover:scale-105 active:scale-95"
        >
          Hora Actual
        </button>
        <button 
          @click="weatherStore.randomizeDateTime"
          class="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md transition-all duration-200 transform hover:scale-105 active:scale-95"
        >
          Aleatorio
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useWeatherStore } from '../stores/weather'
import WeatherIcon from './WeatherIcon.vue'

const weatherStore = useWeatherStore()

const formattedDate = computed(() => {
  return weatherStore.currentDateTime.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

const formattedTime = computed(() => {
  return weatherStore.currentDateTime.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  })
})

const weatherConditionText = computed(() => {
  const conditions: Record<string, string> = {
    sunny: 'Soleado',
    rainy: 'Lluvioso',
    cloudy: 'Nublado',
    night: 'Noche',
    sunrise: 'Amanecer',
    sunset: 'Atardecer'
  }
  return conditions[weatherStore.weatherCondition] || 'Desconocido'
})

const weatherDescription = computed(() => {
  const descriptions: Record<string, string> = {
    sunny: 'Día perfecto para actividades al aire libre',
    rainy: 'Mejor llevar paraguas hoy',
    cloudy: 'Cielo parcialmente nublado',
    night: 'Noche estrellada y tranquila',
    sunrise: 'El amanecer más hermoso del día',
    sunset: 'Atardecer espectacular'
  }
  return descriptions[weatherStore.weatherCondition] || ''
})
</script>