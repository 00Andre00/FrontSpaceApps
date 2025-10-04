<template>
  <div id="app" :class="backgroundClasses" class="min-h-screen weather-transition">
    <WeatherApp />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useWeatherStore } from './stores/weather'
import WeatherApp from './components/WeatherApp.vue'

const weatherStore = useWeatherStore()

const backgroundClasses = computed(() => {
  const baseClasses = 'min-h-screen weather-transition'
  
  switch (weatherStore.weatherCondition) {
    case 'sunny':
      return `${baseClasses} bg-gradient-to-br from-yellow-100 via-orange-200 to-yellow-300`
    case 'rainy':
      return `${baseClasses} bg-gradient-to-br from-blue-200 via-gray-300 to-blue-400`
    case 'cloudy':
      return `${baseClasses} bg-gradient-to-br from-gray-200 via-blue-200 to-gray-300`
    case 'night':
      return `${baseClasses} bg-gradient-to-br from-indigo-900 via-purple-800 to-indigo-950`
    case 'sunrise':
      return `${baseClasses} bg-gradient-to-br from-pink-300 via-orange-200 to-yellow-300`
    case 'sunset':
      return `${baseClasses} bg-gradient-to-br from-orange-300 via-pink-400 to-purple-500`
    default:
      return `${baseClasses} bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300`
  }
})
</script>