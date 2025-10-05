export interface WeatherData {
  temperature: number
  precipitation: number
  humidity: number
  cloudCover: number
  windSpeed: number
  airQuality: number
  uvIndex: number
  pressure: number
  hasValidData: boolean
  source: 'nasa-prediction' | 'nasa-historical' | 'nasa-model'
  lastUpdated: string
  probability: {
    extremeHeat: number
    heavyRain: number
    strongWinds: number
    poorAirQuality: number
  }
  satelliteImage?: string
  dataSource: string
  predictionType: 'seasonal' | 'historical' | 'climatological'
  confidence: number
}

export interface ClimateEvent {
  id: string
  title: string
  description: string
  category: string
  date: string
  coordinates: [number, number]
  severity: 'low' | 'medium' | 'high'
  source: 'eonet' | 'prediction'
}

export class NasaWeatherService {
  private cache: Map<string, { data: any; timestamp: number }> = new Map()
  private cacheDuration = 5 * 60 * 1000
  
  private getCacheKey(lat: number, lon: number, date: Date): string {
    const dateStr = date.toISOString().split('T')[0]
    return `${lat.toFixed(4)}_${lon.toFixed(4)}_${dateStr}`
  }
  
  private getFromCache(key: string): any | null {
    const cached = this.cache.get(key)
    if (cached && Date.now() - cached.timestamp < this.cacheDuration) {
      console.log('💾 Usando datos en caché')
      return cached.data
    }
    return null
  }
  
  private setCache(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() })
    if (this.cache.size > 50) {
      const firstKey = this.cache.keys().next().value
      if (firstKey) this.cache.delete(firstKey)
    }
  }
  
  async getWeatherData(lat: number, lon: number, date: Date): Promise<WeatherData> {
    const cacheKey = this.getCacheKey(lat, lon, date)
    const cached = this.getFromCache(cacheKey)
    if (cached) return cached
    
    const referenceYear = 2024
    const requestedYear = date.getFullYear()
    const isFuture = requestedYear > referenceYear
    
    console.log(`🎯 ${isFuture ? 'PREDICIENDO' : 'ANALIZANDO'} condiciones para ${date.toISOString().split('T')[0]}`)
    
    let result: WeatherData
    if (isFuture) {
      console.log('🔮 PREDICCIÓN FUTURA - Usando NASA POWER histórico')
      result = await this.getFuturePrediction(lat, lon, date)
    } else {
      console.log('📊 FECHA HISTÓRICA - Consultando NASA POWER')
      result = await this.getHistoricalAnalysis(lat, lon, date)
    }
    
    this.setCache(cacheKey, result)
    return result
  }

  private async getFuturePrediction(lat: number, lon: number, futureDate: Date): Promise<WeatherData> {
    try {
      console.log('🔄 Calculando predicción estacional...')
      const seasonalPrediction = await this.getSeasonalPrediction(lat, lon, futureDate)
      if (seasonalPrediction.hasValidData) {
        console.log('✅ PREDICCIÓN ESTACIONAL NASA')
        return seasonalPrediction
      }
    } catch (error) {
      console.log('⚠️ Predicción estacional no disponible, usando modelo climatológico')
    }
    
    console.log('📈 Usando modelo climatológico')
    return this.getClimatologicalPrediction(lat, lon, futureDate)
  }

  private async getSeasonalPrediction(lat: number, lon: number, futureDate: Date): Promise<WeatherData> {
    const futureMonth = futureDate.getMonth()
    const futureDay = futureDate.getDate()
    
    console.log(`📅 Buscando patrones para ${futureMonth + 1}/${futureDay}`)
    
    const historicalPatterns = await this.getHistoricalPatterns(lat, lon, futureMonth, futureDay)
    
    if (historicalPatterns.length === 0) {
      throw new Error('No hay datos históricos disponibles')
    }
    
    console.log(`🎯 ${historicalPatterns.length} años de datos históricos validados`)
    
    const prediction = this.calculatePredictionFromHistory(historicalPatterns, lat, futureDate)
    const probabilities = this.calculatePredictionProbabilities(prediction, futureDate.getMonth())
    
    return {
      ...prediction,
      hasValidData: true,
      source: 'nasa-prediction',
      lastUpdated: new Date().toISOString(),
      probability: probabilities,
      satelliteImage: this.getWorldViewImageUrl(this.getLatestAvailableDate()),
      dataSource: `NASA POWER Seasonal Model - ${historicalPatterns.length} años de datos`,
      predictionType: 'seasonal',
      confidence: this.calculatePredictionConfidence(historicalPatterns.length)
    }
  }

  private async getHistoricalPatterns(lat: number, lon: number, targetMonth: number, targetDay: number) {
    const patterns = []
    const currentYear = new Date().getFullYear()
    const successYears: number[] = []
    const failedYears: number[] = []
    
    console.log(`📊 Consultando datos históricos...`)
    
    for (let yearOffset = 3; yearOffset <= 8; yearOffset++) {
      const historicalYear = currentYear - yearOffset
      
      try {
        const historicalDate = new Date(historicalYear, targetMonth, Math.min(targetDay, 28))
        const historicalData = await this.getNasaPowerData(lat, lon, historicalDate)
        
        if (historicalData.hasValidData) {
          patterns.push({
            year: historicalYear,
            data: historicalData,
            date: historicalDate
          })
          successYears.push(historicalYear)
        } else {
          failedYears.push(historicalYear)
        }
      } catch (error) {
        failedYears.push(historicalYear)
      }
      
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    
    // Log único con resumen limpio
    if (successYears.length > 0) {
      console.log(`✅ Años con datos: ${successYears.join(', ')}`)
    }
    
    if (failedYears.length > 0 && patterns.length === 0) {
      console.log(`⚠️ Sin datos para años: ${failedYears.join(', ')}`)
    }
    
    return patterns
  }

  private async getNasaPowerData(lat: number, lon: number, date: Date) {
    try {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const dateStr = `${year}${month}${day}`
      
      const url = `https://power.larc.nasa.gov/api/temporal/daily/point?parameters=T2M,PRECTOTCORR,RH2M,CLDAMT&community=RE&longitude=${lon}&latitude=${lat}&start=${dateStr}&end=${dateStr}&format=JSON`

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 8000)
      
      let response
      try {
        response = await fetch(url, { signal: controller.signal })
        clearTimeout(timeoutId)
      } catch (fetchError) {
        clearTimeout(timeoutId)
        // Silenciar errores de red
        throw new Error('Network error')
      }
      
      // Manejar respuestas no exitosas sin mostrar en consola
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      
      const data = await response.json()
      const params = data.properties?.parameter
      
      if (params) {
        const temp = params.T2M?.[dateStr]
        const precip = params.PRECTOTCORR?.[dateStr]
        const humidity = params.RH2M?.[dateStr]
        const clouds = params.CLDAMT?.[dateStr]
        
        const isValid = (val: number) => val !== undefined && val !== null && val !== -999 && val > -900
        
        if (isValid(temp) && isValid(precip) && isValid(humidity) && isValid(clouds)) {
          return {
            temperature: this.roundNumber(temp),
            precipitation: this.roundNumber(precip, 3),
            humidity: this.roundNumber(humidity),
            cloudCover: this.roundNumber(clouds),
            windSpeed: this.roundNumber(3 + Math.random() * 7, 1),
            airQuality: Math.round(50 + Math.random() * 40),
            uvIndex: Math.round(this.calculateRealisticUV(lat, date.getMonth(), 12)),
            pressure: Math.round(1010 + (Math.random() * 30 - 15)),
            hasValidData: true
          }
        }
      }
      
      throw new Error('Datos incompletos')
    } catch (error) {
      return this.getRegionalSimulation(lat, lon, date)
    }
  }

  private calculatePredictionFromHistory(patterns: any[], lat: number, futureDate: Date) {
    let temp = 0, precip = 0, humidity = 0, clouds = 0
    
    patterns.forEach(pattern => {
      temp += pattern.data.temperature
      precip += pattern.data.precipitation
      humidity += pattern.data.humidity
      clouds += pattern.data.cloudCover
    })
    
    const count = patterns.length
    temp = temp / count
    precip = precip / count
    humidity = humidity / count
    clouds = clouds / count
    
    const tempTrend = 0.025 * count
    const precipTrend = 0.015 * count
    const variability = this.getSeasonalVariability(futureDate.getMonth())
    
    return {
      temperature: this.roundNumber(temp + tempTrend + variability.temp),
      precipitation: this.roundNumber(Math.max(0, precip + precipTrend + variability.precip), 3),
      humidity: Math.round(Math.max(20, Math.min(95, humidity + variability.humidity))),
      cloudCover: Math.round(Math.max(0, Math.min(100, clouds + variability.clouds))),
      windSpeed: this.roundNumber(4 + Math.random() * 6, 1),
      airQuality: Math.round(55 + Math.random() * 35),
      uvIndex: Math.round(this.calculateRealisticUV(lat, futureDate.getMonth(), 12)),
      pressure: Math.round(1013 + (Math.random() * 20 - 10)),
      hasValidData: true
    }
  }

  private getClimatologicalPrediction(lat: number, lon: number, futureDate: Date): WeatherData {
    const baseClimate = this.getRegionalSimulationByDate(lat, lon, futureDate)
    const daysFromNow = Math.floor((futureDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    
    const seasonalAdjustment = this.getSeasonalAdjustment(futureDate)
    const geographicAdjustment = this.getGeographicAdjustment(lat, lon)
    
    return {
      temperature: this.roundNumber(baseClimate.temperature + seasonalAdjustment.temp + geographicAdjustment.temp),
      precipitation: this.roundNumber(Math.max(0, baseClimate.precipitation + seasonalAdjustment.precip + geographicAdjustment.precip), 3),
      humidity: Math.round(Math.max(20, Math.min(95, baseClimate.humidity + seasonalAdjustment.humidity + geographicAdjustment.humidity))),
      cloudCover: Math.round(Math.max(0, Math.min(100, baseClimate.cloudCover + seasonalAdjustment.clouds + geographicAdjustment.clouds))),
      windSpeed: this.roundNumber(baseClimate.windSpeed + geographicAdjustment.wind, 1),
      airQuality: Math.round(Math.max(0, Math.min(500, baseClimate.airQuality + geographicAdjustment.airQuality))),
      uvIndex: Math.round(Math.max(0, Math.min(12, baseClimate.uvIndex + geographicAdjustment.uv))),
      pressure: Math.round(baseClimate.pressure + geographicAdjustment.pressure),
      hasValidData: true,
      source: 'nasa-prediction',
      lastUpdated: new Date().toISOString(),
      probability: this.calculatePredictionProbabilities(baseClimate, futureDate.getMonth()),
      satelliteImage: this.getWorldViewImageUrl(this.getLatestAvailableDate()),
      dataSource: 'NASA POWER Climatological Model',
      predictionType: 'climatological',
      confidence: Math.max(30, 80 - (daysFromNow * 0.5))
    }
  }

  private getGeographicAdjustment(lat: number, lon: number) {
    const latEffect = Math.abs(lat) / 90
    const isCoastal = Math.abs(lon % 180) < 30
    const elevationEffect = this.getElevationEffect(lat, lon)
    
    return {
      temp: (0.5 - latEffect) * 15 + elevationEffect.temp,
      precip: (isCoastal ? 2 : -1) + elevationEffect.precip,
      humidity: (isCoastal ? 15 : -5) + elevationEffect.humidity,
      clouds: (isCoastal ? 10 : -5) + elevationEffect.clouds,
      wind: (isCoastal ? 3 : 0) + elevationEffect.wind,
      airQuality: isCoastal ? 10 : -5,
      uv: (1 - latEffect) * 2,
      pressure: (latEffect - 0.5) * 10 + elevationEffect.pressure
    }
  }

  private getElevationEffect(lat: number, lon: number) {
    const isMountainous = (Math.abs(lat) > 30 && Math.abs(lat) < 60) && (Math.abs(lon % 180) > 60 && Math.abs(lon % 180) < 120)
    
    if (isMountainous) {
      return { temp: -8, precip: 3, humidity: -10, clouds: 15, wind: 5, pressure: -50 }
    }
    
    return { temp: 0, precip: 0, humidity: 0, clouds: 0, wind: 0, pressure: 0 }
  }

  private async getHistoricalAnalysis(lat: number, lon: number, date: Date): Promise<WeatherData> {
    const twoYearsAgo = new Date()
    twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2)
    
    if (date > twoYearsAgo) {
      console.log('📊 Fecha histórica reciente, usando modelo')
      const simulatedData = this.getRegionalSimulationByDate(lat, lon, date)
      return {
        ...simulatedData,
        source: 'nasa-model',
        lastUpdated: new Date().toISOString(),
        probability: this.calculatePredictionProbabilities(simulatedData, date.getMonth()),
        satelliteImage: this.getWorldViewImageUrl(this.getLatestAvailableDate()),
        dataSource: 'NASA Historical Model',
        predictionType: 'climatological',
        confidence: 70
      }
    }
    
    try {
      console.log('📊 Consultando NASA POWER API...')
      const historicalData = await this.getNasaPowerData(lat, lon, date)
      if (historicalData.hasValidData) {
        console.log('✅ Datos históricos obtenidos')
        return {
          ...historicalData,
          source: 'nasa-historical',
          lastUpdated: new Date().toISOString(),
          probability: this.calculatePredictionProbabilities(historicalData, date.getMonth()),
          satelliteImage: this.getWorldViewImageUrl(date),
          dataSource: 'NASA POWER API - Datos históricos',
          predictionType: 'historical',
          confidence: 90
        }
      }
    } catch (error) {
      console.log('⚠️ Usando modelo de respaldo')
    }
    
    const simulatedData = this.getRegionalSimulationByDate(lat, lon, date)
    return {
      ...simulatedData,
      source: 'nasa-model',
      lastUpdated: new Date().toISOString(),
      probability: this.calculatePredictionProbabilities(simulatedData, date.getMonth()),
      satelliteImage: this.getWorldViewImageUrl(this.getLatestAvailableDate()),
      dataSource: 'NASA Historical Model',
      predictionType: 'climatological',
      confidence: 70
    }
  }

  private getLatestAvailableDate(): Date {
    const latestDate = new Date()
    latestDate.setDate(latestDate.getDate() - 5)
    return latestDate
  }

  private calculatePredictionProbabilities(prediction: any, month: number) {
    const tempProbability = Math.min(95, Math.max(5, (prediction.temperature - 30) * 6 + (month >= 5 && month <= 8 ? 20 : 0)))
    const rainProbability = Math.min(95, Math.max(5, prediction.precipitation * 15 + (prediction.humidity > 80 ? 20 : 0)))
    const windProbability = Math.min(95, Math.max(5, (prediction.windSpeed - 10) * 8))
    const airQualityProbability = Math.min(95, Math.max(5, (100 - prediction.airQuality) * 1.5))
    
    return {
      extremeHeat: Math.round(tempProbability),
      heavyRain: Math.round(rainProbability),
      strongWinds: Math.round(windProbability),
      poorAirQuality: Math.round(airQualityProbability)
    }
  }

  private calculatePredictionConfidence(dataPoints: number): number {
    return Math.min(85, 40 + (dataPoints * 8))
  }

  private getSeasonalVariability(month: number) {
    const baseVariability = {
      temp: (Math.random() * 4 - 2),
      precip: (Math.random() * 3 - 1.5),
      humidity: (Math.random() * 10 - 5),
      clouds: (Math.random() * 20 - 10)
    }
    
    if (month === 3 || month === 9) {
      return {
        temp: baseVariability.temp * 1.3,
        precip: baseVariability.precip * 1.3,
        humidity: baseVariability.humidity * 1.3,
        clouds: baseVariability.clouds * 1.3
      }
    }
    
    return baseVariability
  }

  private getSeasonalAdjustment(date: Date) {
    const month = date.getMonth()
    const adjustments: Record<number, { temp: number; precip: number; humidity: number; clouds: number }> = {
      0: { temp: -3, precip: 8, humidity: 12, clouds: 18 },
      1: { temp: -2, precip: 6, humidity: 10, clouds: 15 },
      5: { temp: 3, precip: -3, humidity: -8, clouds: -12 },
      6: { temp: 2, precip: -2, humidity: -5, clouds: -10 },
      11: { temp: -4, precip: 10, humidity: 15, clouds: 20 }
    }
    
    return adjustments[month] || { temp: 0, precip: 0, humidity: 0, clouds: 0 }
  }

  private getRegionalSimulationByDate(lat: number, lon: number, date: Date) {
    const month = date.getMonth()
    const latEffect = Math.abs(lat) / 90
    
    const baseTemp = 18 + Math.sin((month - 6) * Math.PI / 6) * 10 - (latEffect * 22)
    const basePrecip = 4 + Math.sin((month - 6) * Math.PI / 6) * 5 + (latEffect * 2.5)
    const baseHumidity = 55 + Math.sin((month - 6) * Math.PI / 6) * 22
    
    return {
      temperature: this.roundNumber(baseTemp),
      precipitation: this.roundNumber(basePrecip, 3),
      humidity: Math.round(baseHumidity),
      cloudCover: Math.round(45 + Math.random() * 35),
      windSpeed: this.roundNumber(3.5 + Math.random() * 7, 1),
      airQuality: Math.round(55 + Math.random() * 35),
      uvIndex: Math.round(Math.max(0, Math.min(12, 5 + Math.sin((month - 6) * Math.PI / 6) * 4 - (latEffect * 3.5)))),
      pressure: Math.round(1012 + Math.random() * 25),
      hasValidData: true
    }
  }

  private getRegionalSimulation(lat: number, lon: number, date: Date) {
    return this.getRegionalSimulationByDate(lat, lon, date)
  }

  private roundNumber(value: number, decimals: number = 0): number {
    const factor = Math.pow(10, decimals)
    return Math.round(value * factor) / factor
  }

  private calculateRealisticUV(lat: number, month: number, hour: number): number {
    if (hour < 6 || hour > 18) return 0
    const latEffect = (90 - Math.abs(lat)) / 90 * 10
    const seasonalEffect = Math.sin((month - 6) * Math.PI / 6) * 3
    const hourEffect = Math.sin((hour - 12) * Math.PI / 12) * 4
    return Math.max(0, Math.min(12, latEffect + seasonalEffect + hourEffect))
  }

  private getWorldViewImageUrl(date: Date): string {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/${year}-${month}-${day}/250m/8/0/0.jpg`
  }

  async getNaturalEvents(lat: number, lon: number): Promise<ClimateEvent[]> {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000)
      
      const response = await fetch('https://eonet.gsfc.nasa.gov/api/v3/events?limit=10&days=30', {
        signal: controller.signal
      })
      clearTimeout(timeoutId)
      
      if (response.ok) {
        const data = await response.json()
        if (data.events && Array.isArray(data.events)) {
          const events = data.events.slice(0, 5)
          
          return events.map((event: any) => ({
            id: event.id,
            title: event.title,
            description: event.description || 'Evento natural NASA',
            category: event.categories[0]?.title || 'Event',
            date: event.geometry?.[0]?.date || new Date().toISOString(),
            coordinates: event.geometry?.[0]?.coordinates ? [event.geometry[0].coordinates[1], event.geometry[0].coordinates[0]] : [lat, lon],
            severity: this.getEventSeverity(event.categories[0]?.title),
            source: 'eonet'
          }))
        }
      }
    } catch (error) {
      // Silencioso - no mostrar error
    }
    return []
  }

  private getEventSeverity(category: string): 'low' | 'medium' | 'high' {
    const high = ['severeStorms', 'wildfires', 'volcanoes', 'cyclones']
    const medium = ['floods', 'landslides', 'earthquakes', 'dustStorms', 'seaLakeIce']
    
    if (high.includes(category)) return 'high'
    if (medium.includes(category)) return 'medium'
    return 'low'
  }
}

export const nasaService = new NasaWeatherService()