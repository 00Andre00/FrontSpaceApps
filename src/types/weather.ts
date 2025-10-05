// src/types/weather.ts

export interface Location {
  name: string
  lat: number
  lon: number
}

export interface WeatherCondition {
  condition: 'sunny' | 'rainy' | 'cloudy' | 'night' | 'sunrise' | 'sunset'
  description: string
}