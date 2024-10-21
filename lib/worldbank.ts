import axios from "axios"

const baseUrl = "https://api.worldbank.org/v2"

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
