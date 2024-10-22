import axios from "axios"

const baseUrl = "https://api.worldbank.org/v2"

interface PopulationData {
  indicator: {
    id: string
    value: string
  }
  country: {
    id: string
    value: string
  }
  countryiso3code: string
  date: string
  value: number
  unit: string
  obs_status: string
  decimal: number
}

interface Result {
  [country: string]: {
    years: string[]
    population: number[]
  }
}

interface CountryData {
  [country: string]: string[]
}

export async function getWorldPopulation(): Promise<any> {
  try {
    const response = await axios.get(
      `${baseUrl}/country/WLD/indicator/SP.POP.TOTL?date=1960:2023&format=json&per_page=50&sort=date:desc`
    )

    const data = response.data[1]

    const population = data.map((item: { value: number }) =>
      (item.value / 1_000_000_000).toFixed(1)
    )
    const years = data.map((item: { date: any }) => item.date)
    return {
      population: population,
      years: years,
      current: population[0],
    }
  } catch (error) {
    console.error("Error fetching world population data:", error)
    throw error
  }
}

export async function getAveragePopulationDensity(): Promise<string | null> {
  try {
    const response = await axios.get(
      `${baseUrl}/country/WLD/indicator/EN.POP.DNST?date=1960:2023&format=json`
    )

    const data = response.data[1]

    const densityValues = data
      .map((obj: { value: any }) => obj.value)
      .filter((value: null) => value !== null) as number[]

    if (densityValues.length === 0) {
      return null
    }

    const totalDensity = densityValues.reduce((sum, value) => sum + value, 0)
    const averageDensity = totalDensity / densityValues.length

    return averageDensity.toFixed(2)
  } catch (error) {
    console.error("Error fetching population density data:", error)
    throw error
  }
}

export async function getCurrLifeExp(): Promise<any> {
  try {
    const response = await axios.get(
      `${baseUrl}/country/WLD/indicator/SP.DYN.LE00.IN?date=2022&format=json`
    )

    const data = response.data[1]

    return data.value === null ? "N/A" : Math.floor(Number(data[0].value))
  } catch (error) {
    console.error("Error fetching population density data:", error)
    throw error
  }
}

export async function getPopulationChange(): Promise<any> {
  try {
    const responseCurr = await axios.get(
      `${baseUrl}/country/WLD/indicator/SP.POP.TOTL?date=2023&format=json`
    )

    const responsePrev = await axios.get(
      `${baseUrl}/country/WLD/indicator/SP.POP.TOTL?date=2022&format=json`
    )

    const dataCurr = responseCurr.data[1]
    const dataPrev = responsePrev.data[1]

    return ((dataCurr[0].value - dataPrev[0].value) / 1_000_000).toFixed(1)
  } catch (error) {
    console.error("Error fetching population change data:", error)
    throw error
  }
}

export async function getCountyPopulation(): Promise<any> {
  try {
    const response = await axios.get(
      `${baseUrl}/country/CHN;IND;USA;IDN;PAK/indicator/SP.POP.TOTL?date=1923:2023&format=json&per_page=400`
    )

    const data: PopulationData[] = response.data[1]

    const result: Result = {}

    data.forEach((item) => {
      const countryName = item.country.value

      if (!result[countryName]) {
        result[countryName] = {
          years: [],
          population: [],
        }
      }

      result[countryName].years.push(item.date)
      result[countryName].population.push(item.value)
    })
    return result
  } catch (error) {
    console.error("Error fetching country population data:", error)
    throw error
  }
}

export async function getWorldPopulationDensity() {
  try {
    const response = await axios.get(
      `${baseUrl}/country/WLD/indicator/EN.POP.DNST?date=1960:2021&format=json&per_page=100&sort=date:desc`
    )

    const data = response.data[1]

    const density = data.map((item: { value: number | null }) =>
      item.value === null ? 0 : item.value
    )
    const years = data.map((item: { date: any }) => item.date)

    return {
      density: density,
      years: years,
    }
  } catch (error) {
    console.error("Error fetching world density data:", error)
    throw error
  }
}

export async function getWorldGrowthRate() {
  try {
    const response = await axios.get(
      `${baseUrl}/country/WLD/indicator/SP.POP.GROW?date=1960:2023&format=json&per_page=100&sort=date:desc`
    )

    const data = response.data[1]

    const growthRate = data.map((item: { value: number | null }) =>
      item.value === null ? 0 : item.value
    )
    const years = data.map((item: { date: any }) => item.date)

    return {
      growthRate: growthRate,
      years: years,
    }
  } catch (error) {
    console.error("Error fetching world growth rate data:", error)
    throw error
  }
}

export async function getWorldLifeExp() {
  try {
    const response = await axios.get(
      `${baseUrl}/country/WLD/indicator/SP.DYN.LE00.IN?date=1960:2022&format=json&per_page=100&sort=date:desc`
    )

    const data = response.data[1]

    const lifeExp = data.map((item: { value: number | null }) =>
      item.value === null ? 0 : item.value
    )
    const years = data.map((item: { date: any }) => item.date)

    return {
      lifeExp: lifeExp,
      years: years,
    }
  } catch (error) {
    console.error("Error fetching world life exp. data:", error)
    throw error
  }
}

export async function getWorlBirthRate() {
  try {
    const response = await axios.get(
      `${baseUrl}/country/WLD/indicator/SP.DYN.CBRT.IN?date=1960:2022&format=json&per_page=100&sort=date:desc`
    )

    const data = response.data[1]

    const birthRate = data.map((item: { value: number | null }) =>
      item.value === null ? 0 : item.value
    )
    const years = data.map((item: { date: any }) => item.date)

    return {
      birthRate: birthRate,
      years: years,
    }
  } catch (error) {
    console.error("Error fetching world birth rate data:", error)
    throw error
  }
}

export async function getWorldDeathRate() {
  try {
    const response = await axios.get(
      `${baseUrl}/country/WLD/indicator/SP.DYN.CDRT.IN?date=1960:2022&format=json&per_page=100&sort=date:desc`
    )

    const data = response.data[1]

    const deathRate = data.map((item: { value: number | null }) =>
      item.value === null ? 0 : item.value
    )
    const years = data.map((item: { date: any }) => item.date)

    return {
      deathRate: deathRate,
      years: years,
    }
  } catch (error) {
    console.error("Error fetching world death rate data:", error)
    throw error
  }
}

export async function getWorldFertilityRate() {
  try {
    const response = await axios.get(
      `${baseUrl}/country/WLD/indicator/SP.DYN.TFRT.IN?date=1960:2022&format=json&per_page=100&sort=date:desc`
    )

    const data = response.data[1]

    const fertilityRate = data.map((item: { value: number | null }) =>
      item.value === null ? 0 : item.value
    )
    const years = data.map((item: { date: any }) => item.date)

    return {
      fertilityRate: fertilityRate,
      years: years,
    }
  } catch (error) {
    console.error("Error fetching world fertility rate data:", error)
    throw error
  }
}

export async function getTableData(year: string) {
  try {
    const popRes = await axios.get(
      `${baseUrl}/country/CHN;IND;USA;IDN;PAK/indicator/SP.POP.TOTL?format=json&date=${year}`
    )

    const pdRes = await axios.get(
      `${baseUrl}/country/CHN;IND;USA;IDN;PAK/indicator/EN.POP.DNST?format=json&date=${year}`
    )

    const grRes = await axios.get(
      `${baseUrl}/country/CHN;IND;USA;IDN;PAK/indicator/SP.POP.GROW?format=json&date=${year}`
    )
    const leRes = await axios.get(
      `${baseUrl}/country/CHN;IND;USA;IDN;PAK/indicator/SP.DYN.LE00.IN?format=json&date=${year}`
    )
    const brRes = await axios.get(
      `${baseUrl}/country/CHN;IND;USA;IDN;PAK/indicator/SP.DYN.CBRT.IN?format=json&date=${year}`
    )
    const drRes = await axios.get(
      `${baseUrl}/country/CHN;IND;USA;IDN;PAK/indicator/SP.DYN.CDRT.IN?format=json&date=${year}`
    )
    const frRes = await axios.get(
      `${baseUrl}/country/CHN;IND;USA;IDN;PAK/indicator/SP.DYN.TFRT.IN?format=json&date=${year}`
    )

    const popData = popRes.data[1]
    const pdData = pdRes.data[1]
    const grData = grRes.data[1]
    const leData = leRes.data[1]
    const brData = brRes.data[1]
    const drData = drRes.data[1]
    const frData = frRes.data[1]

    const allData = [popData, pdData, grData, leData, brData, drData, frData]

    const countryData: CountryData = {}

    allData.forEach((dataArray) => {
      dataArray.forEach(
        (item: {
          country: { value: any }
          indicator: { value: any }
          date: any
          value: any
        }) => {
          const countryName = item.country.value

          if (!countryData[countryName]) {
            countryData[countryName] = []
          }

          countryData[countryName].push(item.value)
        }
      )
    })

    return countryData
  } catch (error) {
    console.error("Error fetching world fertility rate data:", error)
    throw error
  }
}
