import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useWeatherStore = defineStore('weather', () => {
  // Funciones con tipos garantizados
  const getDefaultDate = (): string => {
    const date = new Date().toISOString().split('T')[0]
    return date || '2024-01-01' // Fallback explícito
  }
  
  const getDefaultTime = (): string => {
    const now = new Date()
    const hours = now.getHours().toString().padStart(2, '0')
    const minutes = now.getMinutes().toString().padStart(2, '0')
    return `${hours}:${minutes}`
  }

  // Valores iniciales
  const defaultDate = getDefaultDate()
  const defaultTime = getDefaultTime()

  const selectedDate = ref<string>(defaultDate)
  const selectedTime = ref<string>(defaultTime)
  
  const currentDateTime = computed(() => {
    const date = selectedDate.value || defaultDate
    const time = selectedTime.value || defaultTime
    return new Date(`${date}T${time}`)
  })
  
  const hour = computed(() => {
    return currentDateTime.value.getHours()
  })
  
  const month = computed(() => {
    return currentDateTime.value.getMonth()
  })
  
  const weatherCondition = computed(() => {
    if (hour.value >= 6 && hour.value < 8) {
      return 'sunrise'
    } else if (hour.value >= 8 && hour.value < 18) {
      if (month.value >= 5 && month.value <= 7) {
        return Math.random() > 0.3 ? 'sunny' : 'cloudy'
      } else if (month.value === 11 || month.value <= 1) {
        return Math.random() > 0.6 ? 'rainy' : 'cloudy'
      } else {
        const rand = Math.random()
        if (rand > 0.7) return 'sunny'
        if (rand > 0.4) return 'cloudy'
        return 'rainy'
      }
    } else if (hour.value >= 18 && hour.value < 20) {
      return 'sunset'
    } else {
      return 'night'
    }
  })
  
  const temperature = computed(() => {
    let baseTemp = 20
    
    if (hour.value >= 12 && hour.value < 16) {
      baseTemp += 8
    } else if (hour.value >= 6 && hour.value < 8) {
      baseTemp += 2
    } else if (hour.value >= 20 || hour.value < 6) {
      baseTemp -= 5
    }
    
    if (weatherCondition.value === 'sunny') baseTemp += 5
    if (weatherCondition.value === 'cloudy') baseTemp -= 2
    if (weatherCondition.value === 'rainy') baseTemp -= 4
    if (weatherCondition.value === 'night') baseTemp -= 3
    
    if (month.value >= 5 && month.value <= 7) baseTemp += 8
    if (month.value === 11 || month.value <= 1) baseTemp -= 5
    
    return Math.round(baseTemp)
  })
  
  function updateDateTime(date: string, time: string) {
    selectedDate.value = date
    selectedTime.value = time
  }
  
  function setCurrentTime() {
    selectedDate.value = getDefaultDate()
    selectedTime.value = getDefaultTime()
  }
  
  function randomizeDateTime() {
    const randomDate = new Date()
    randomDate.setDate(Math.floor(Math.random() * 30) + 1)
    randomDate.setMonth(Math.floor(Math.random() * 12))
    randomDate.setHours(Math.floor(Math.random() * 24))
    randomDate.setMinutes(Math.floor(Math.random() * 60))
    
    const randomDateStr = randomDate.toISOString().split('T')[0] || getDefaultDate()
    const randomTimeStr = `${randomDate.getHours().toString().padStart(2, '0')}:${randomDate.getMinutes().toString().padStart(2, '0')}`
    
    updateDateTime(randomDateStr, randomTimeStr)
  }
  
  return {
    selectedDate,
    selectedTime,
    currentDateTime,
    hour,
    month,
    weatherCondition,
    temperature,
    updateDateTime,
    setCurrentTime,
    randomizeDateTime
  }
})