"use client"

import { useEffect, useState } from "react"
import Chart from "react-apexcharts"
import { ApexOptions } from "apexcharts"
import {
  getCountyPopulation,
  getWorlBirthRate,
  getWorldDeathRate,
  getWorldFertilityRate,
  getWorldGrowthRate,
  getWorldLifeExp,
  getWorldPopulationDensity,
} from "@/lib/worldbank"

const YEAR_OPTIONS = [5, 10, 20, 50, 100]
const CHART_OPTIONS = [
  "Population",
  "Population Density",
  "Growth Rate",
  "Life Exp. at birth",
  "Birth Rate",
  "Death Rate",
  "Fertility Rate",
]

export default function PopulationChart() {
  const [chartData, setChartData] = useState<{
    xAxisData: string[]
    yAxisData: number[]
  } | null>(null)
  const [countryPopulation, setCountryPopulation] = useState<any>()
  const [worldPopulationDensity, setWorldPopulationDensity] = useState<any>()
  const [worldGrowthRate, setWorldGrowthRate] = useState<any>()
  const [worldLifeExp, setWorldLifeExp] = useState<any>()
  const [worldBirthRate, setWorldBirthRate] = useState<any>()
  const [worldDeathRate, setWorldDeathRate] = useState<any>()
  const [worldFertilityRate, setWorldFertilityRate] = useState<any>()

  const [yearRange, setYearRange] = useState(5)
  const [chartOption, setChartOption] = useState("Population")

  const options: ApexOptions = {
    chart: {
      type: "area",
      fontFamily: "Inter, sans-serif",
      toolbar: { show: false },
      background: "#e5e7eb",
    },
    dataLabels: { enabled: false },
    stroke: { width: 1, curve: "straight" },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.9,
        stops: [0, 90, 100],
      },
    },
    xaxis: {
      categories: chartData?.xAxisData.slice(0, yearRange).reverse() || [],
      labels: {
        style: {
          fontFamily: "Inter, sans-serif",
          cssClass: "text-xs font-normal fill-gray-500 dark:fill-gray-400",
        },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: { show: true },
  }

  const series = chartData
    ? [
        {
          name: "Total Population",
          data: chartData?.yAxisData.slice(0, yearRange).reverse(),
          color: "#1A56DB",
        },
      ]
    : []

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCountyPopulation()
        setCountryPopulation(data)
      } catch (error) {
        console.error("Error fetching world population:", error)
      }

      try {
        const data = await getWorldPopulationDensity()
        setWorldPopulationDensity(data)
      } catch (error) {
        console.error("Error fetching world density:", error)
      }

      try {
        const data = await getWorldGrowthRate()
        setWorldGrowthRate(data)
      } catch (error) {
        console.error("Error fetching world growth rate:", error)
      }

      try {
        const data = await getWorldLifeExp()
        setWorldLifeExp(data)
      } catch (error) {
        console.error("Error fetching world life exp. :", error)
      }

      try {
        const data = await getWorlBirthRate()
        setWorldBirthRate(data)
      } catch (error) {
        console.error("Error fetching world birth rate :", error)
      }

      try {
        const data = await getWorldDeathRate()
        setWorldDeathRate(data)
      } catch (error) {
        console.error("Error fetching world death rate :", error)
      }

      try {
        const data = await getWorldFertilityRate()
        setWorldFertilityRate(data)
      } catch (error) {
        console.error("Error fetching world fertility rate :", error)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (chartOption === "Population") {
      const years: string[] = []
      const population: number[] = []

      for (const country in countryPopulation) {
        const countryData = countryPopulation[country]

        countryData.years.forEach((year: string, index: string | number) => {
          const value = countryData.population[index]

          const yearIndex = years.indexOf(year)

          if (yearIndex === -1) {
            years.push(year)
            population.push(value)
          } else {
            population[yearIndex] += value
          }
        })
      }

      const populationInBillions = population.map(
        (e) => Math.round((e / 1_000_000_000) * 10) / 10
      )

      setChartData({
        xAxisData: years,
        yAxisData: populationInBillions,
      })

      //   check
      options.tooltip = {
        enabled: true,
        shared: false,
        custom: function () {
          return `
            <div class="flex p-4">
              <p>2022</p>
              <p>India: 2.2</p>
              <p>Pakistan: X.X</p>
              <p>China: Y.Y</p>
              <p>Indonesia: Z.Z</p>
              <p>XYZ: W.W</p>
            </div>
          `
        },
      }
    } else if (chartOption === "Population Density" && worldPopulationDensity) {
      const densityRounded = worldPopulationDensity.density.map(
        (e: number) => Math.round(e * 100) / 100
      )
      setChartData({
        xAxisData: worldPopulationDensity.years,
        yAxisData: densityRounded,
      })
    } else if (chartOption === "Growth Rate" && worldGrowthRate) {
      const growthRateRounded = worldGrowthRate.growthRate.map(
        (e: number) => Math.round(e * 10) / 10
      )
      setChartData({
        xAxisData: worldGrowthRate.years,
        yAxisData: growthRateRounded,
      })
    } else if (chartOption === "Life Exp. at birth" && worldLifeExp) {
      const lifeExpRounded = worldLifeExp.lifeExp.map((e: number) =>
        Math.floor(e)
      )
      setChartData({
        xAxisData: worldLifeExp.years,
        yAxisData: lifeExpRounded,
      })
    } else if (chartOption === "Birth Rate" && worldBirthRate) {
      const birthRateRounded = worldBirthRate.birthRate.map(
        (e: number) => Math.round(e * 10) / 10
      )
      setChartData({
        xAxisData: worldBirthRate.years,
        yAxisData: birthRateRounded,
      })
    } else if (chartOption === "Death Rate" && worldDeathRate) {
      const deathRateRounded = worldDeathRate.deathRate.map(
        (e: number) => Math.round(e * 10) / 10
      )
      setChartData({
        xAxisData: worldDeathRate.years,
        yAxisData: deathRateRounded,
      })
    } else if (chartOption === "Fertility Rate" && worldFertilityRate) {
      const fertilityRateRounded = worldFertilityRate.fertilityRate.map(
        (e: number) => Math.round(e * 10) / 10
      )
      setChartData({
        xAxisData: worldFertilityRate.years,
        yAxisData: fertilityRateRounded,
      })
    }
  }, [
    chartOption,
    countryPopulation,
    worldPopulationDensity,
    worldGrowthRate,
    worldBirthRate,
    worldDeathRate,
    worldFertilityRate,
  ])

  if (!chartData) return <div>Loading...</div>

  return (
    <div className="w-full bg-gray-200">
      <div className="flex justify-between w-full">
        <div className="flex justify-between mb-5">
          <select
            value={chartOption}
            onChange={(e) => setChartOption(e.target.value)}
            className="px-3 py-2 text-sm font-medium rounded-lg border border-gray-200 focus:outline-none"
          >
            {CHART_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-between mb-5">
          <select
            value={yearRange}
            onChange={(e) => setYearRange(Number(e.target.value))}
            className="px-3 py-2 text-sm font-medium rounded-lg border border-gray-200 focus:outline-none"
          >
            {YEAR_OPTIONS.map((year) => (
              <option key={year} value={year}>
                {year} yrs
              </option>
            ))}
          </select>
        </div>
      </div>
      <Chart options={options} series={series} type="area" height="90%" />
    </div>
  )
}
