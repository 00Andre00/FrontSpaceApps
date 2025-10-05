// src/stores/weather.ts
import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { nasaService, type WeatherData, type ClimateEvent } from '../services/nasaApi'

// Mover las interfaces aquí en lugar de importarlas
interface Location {
  name: string
  lat: number
  lon: number
  region: string
}

export const useWeatherStore = defineStore('weather', () => {
  const selectedDate = ref('')
  const selectedTime = ref('')
  const selectedLocation = ref<Location>({ 
    name: 'Lima', 
    lat: -12.0464, 
    lon: -77.0428,
    region: 'Lima Metropolitana'
  })
  const useRealNasaData = ref(false)
  const isLoadingNasaData = ref(false)
  const nasaData = ref<WeatherData | null>(null)
  const climateEvents = ref<ClimateEvent[]>([])
  const searchQuery = ref('')

  // Computed para fecha/hora actual
  const currentDateTime = computed(() => {
    const date = selectedDate.value ? new Date(selectedDate.value) : new Date()
    if (selectedTime.value) {
      const [hours, minutes] = selectedTime.value.split(':').map(Number)
      date.setHours(hours || 0, minutes || 0)
    }
    return date
  })

  // Computed para condición climática (simulada)
  const weatherCondition = computed(() => {
    if (!nasaData.value) return 'sunny'
    
    const hour = currentDateTime.value.getHours()
    const isNight = hour < 6 || hour > 20
    
    if (isNight) return 'night'
    if (nasaData.value.precipitation > 5) return 'rainy'
    if (nasaData.value.cloudCover > 70) return 'cloudy'
    if (hour < 7) return 'sunrise'
    if (hour > 18) return 'sunset'
    return 'sunny'
  })

  const temperature = computed(() => {
    if (!nasaData.value) return 20
    return Math.round(nasaData.value.temperature)
  })

  const hour = computed(() => currentDateTime.value.getHours())

  // Todas las ubicaciones de Perú
  const allLocations = ref<Location[]>([
    // Costa
    { name: 'Lima', lat: -12.0464, lon: -77.0428, region: 'Costa' },
    { name: 'Callao', lat: -12.0560, lon: -77.1319, region: 'Costa' },
    { name: 'Trujillo', lat: -8.1092, lon: -79.0215, region: 'Costa' },
    { name: 'Chiclayo', lat: -6.7766, lon: -79.8443, region: 'Costa' },
    { name: 'Piura', lat: -5.1945, lon: -80.6328, region: 'Costa' },
    { name: 'Ica', lat: -14.0678, lon: -75.7286, region: 'Costa' },
    { name: 'Arequipa', lat: -16.4090, lon: -71.5375, region: 'Costa' },
    { name: 'Tacna', lat: -18.0066, lon: -70.2463, region: 'Costa' },
    
    // Sierra
    { name: 'Cusco', lat: -13.5320, lon: -71.9675, region: 'Sierra' },
    { name: 'Huancayo', lat: -12.0651, lon: -75.2049, region: 'Sierra' },
    { name: 'Ayacucho', lat: -13.1639, lon: -74.2236, region: 'Sierra' },
    { name: 'Cajamarca', lat: -7.1617, lon: -78.5128, region: 'Sierra' },
    { name: 'Huánuco', lat: -9.9295, lon: -76.2397, region: 'Sierra' },
    { name: 'Puno', lat: -15.8402, lon: -70.0219, region: 'Sierra' },
    { name: 'Cerro de Pasco', lat: -10.6878, lon: -76.2614, region: 'Sierra' },
    { name: 'Abancay', lat: -13.6333, lon: -72.8833, region: 'Sierra' },
    
    // Selva
    { name: 'Iquitos', lat: -3.7491, lon: -73.2538, region: 'Selva' },
    { name: 'Pucallpa', lat: -8.3849, lon: -74.5359, region: 'Selva' },
    { name: 'Tarapoto', lat: -6.4833, lon: -76.3667, region: 'Selva' },
    { name: 'Puerto Maldonado', lat: -12.5933, lon: -69.1891, region: 'Selva' },
    { name: 'Yurimaguas', lat: -5.8958, lon: -76.0833, region: 'Selva' },
    { name: 'Jaén', lat: -5.7081, lon: -78.8048, region: 'Selva' },
    { name: 'Moyobamba', lat: -6.0333, lon: -76.9667, region: 'Selva' },
    
    // Norte
    { name: 'Tumbes', lat: -3.5667, lon: -80.4414, region: 'Norte' },
    { name: 'Talara', lat: -4.5767, lon: -81.2739, region: 'Norte' },
    { name: 'Sullana', lat: -4.9039, lon: -80.6853, region: 'Norte' },
    
    // Sur
    { name: 'Moquegua', lat: -17.1956, lon: -70.9353, region: 'Sur' },
    { name: 'Tacna', lat: -18.0066, lon: -70.2463, region: 'Sur' }
  ])

  // Locations filtradas por búsqueda
  const filteredLocations = computed(() => {
    if (!searchQuery.value) return allLocations.value
    
    const query = searchQuery.value.toLowerCase()
    return allLocations.value.filter(location =>
      location.name.toLowerCase().includes(query) ||
      location.region.toLowerCase().includes(query)
    )
  })

  // Función para buscar ubicación
  const searchLocation = (query: string) => {
    searchQuery.value = query
  }

  // Función para seleccionar ubicación desde búsqueda
  const selectSearchedLocation = (location: Location) => {
    selectedLocation.value = location
    searchQuery.value = '' // Limpiar búsqueda después de seleccionar
  }

  // Función para obtener datos NASA/simulados
  const fetchNasaData = async () => {
    if (!useRealNasaData.value) {
      // Usar datos simulados realistas
      const simulatedData = await nasaService.getWeatherData(
        selectedLocation.value.lat,
        selectedLocation.value.lon,
        currentDateTime.value
      )
      nasaData.value = simulatedData
      
      // Obtener eventos climáticos
      const events = await nasaService.getNaturalEvents(
        selectedLocation.value.lat,
        selectedLocation.value.lon
      )
      climateEvents.value = events
      return
    }

    isLoadingNasaData.value = true
    try {
      const data = await nasaService.getWeatherData(
        selectedLocation.value.lat,
        selectedLocation.value.lon,
        currentDateTime.value
      )
      nasaData.value = data
      
      const events = await nasaService.getNaturalEvents(
        selectedLocation.value.lat,
        selectedLocation.value.lon
      )
      climateEvents.value = events
    } catch (error) {
      console.error('Error fetching weather data:', error)
    } finally {
      isLoadingNasaData.value = false
    }
  }

  // Función para descargar datos
  // const downloadWeatherData = () => {
  //   if (!nasaData.value) return
    
  //   const csvData = nasaService.generateCSVData(nasaData.value)
    
  //   const blob = new Blob([csvData], { type: 'text/csv' })
  //   const url = window.URL.createObjectURL(blob)
  //   const a = document.createElement('a')
  //   a.href = url
  //   a.download = `weather-data-${selectedLocation.value.name}-${selectedDate.value || 'current'}.csv`
  //   document.body.appendChild(a)
  //   a.click()
  //   document.body.removeChild(a)
  //   window.URL.revokeObjectURL(url)
  // }

  // Watchers
  watch([selectedDate, selectedTime, selectedLocation], fetchNasaData, { immediate: true })
  watch(useRealNasaData, fetchNasaData)

  const setCurrentTime = () => {
    const now = new Date()
    selectedDate.value = now.toISOString().split('T')[0] ?? ''
    selectedTime.value = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
  }

  const setLocation = (location: Location) => {
    selectedLocation.value = location
  }

  const toggleNasaData = () => {
    useRealNasaData.value = !useRealNasaData.value
  }

  return {
    selectedDate,
    selectedTime,
    selectedLocation,
    searchQuery,
    allLocations: filteredLocations,
    currentDateTime,
    hour,
    weatherCondition,
    temperature,
    nasaData,
    climateEvents,
    isLoadingNasaData,
    useRealNasaData,
    setCurrentTime,
    setLocation,
    toggleNasaData,
    fetchNasaData,
    // downloadWeatherData,
    searchLocation,
    selectSearchedLocation
  }
})