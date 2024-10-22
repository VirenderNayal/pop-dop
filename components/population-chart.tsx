"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
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

const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center h-[400px]">
      Loading chart...
    </div>
  ),
})

// Types
type ChartDataType = {
  xAxisData: string[]
  yAxisData: number[]
}

type MetricOption = {
  label: string
  value: string
  dataKey: keyof typeof dataFetchers
  formatter?: (value: number) => number
}

// Constants
const YEAR_OPTIONS = [5, 10, 20, 50, 100] as const
const METRICS: MetricOption[] = [
  {
    label: "Population",
    value: "population",
    dataKey: "getCountyPopulation",
    formatter: (value) => Math.round((value / 1_000_000_000) * 10) / 10,
  },
  {
    label: "Population Density",
    value: "density",
    dataKey: "getWorldPopulationDensity",
    formatter: (value) => Math.round(value * 100) / 100,
  },
  {
    label: "Growth Rate",
    value: "growthRate",
    dataKey: "getWorldGrowthRate",
    formatter: (value) => Math.round(value * 10) / 10,
  },
  {
    label: "Life Exp. at birth",
    value: "lifeExp",
    dataKey: "getWorldLifeExp",
    formatter: Math.floor,
  },
  {
    label: "Birth Rate",
    value: "birthRate",
    dataKey: "getWorlBirthRate",
    formatter: (value) => Math.round(value * 10) / 10,
  },
  {
    label: "Death Rate",
    value: "deathRate",
    dataKey: "getWorldDeathRate",
    formatter: (value) => Math.round(value * 10) / 10,
  },
  {
    label: "Fertility Rate",
    value: "fertilityRate",
    dataKey: "getWorldFertilityRate",
    formatter: (value) => Math.round(value * 10) / 10,
  },
]

// Data fetchers mapping
const dataFetchers = {
  getCountyPopulation,
  getWorldPopulationDensity,
  getWorlBirthRate,
  getWorldDeathRate,
  getWorldFertilityRate,
  getWorldGrowthRate,
  getWorldLifeExp,
}

export default function PopulationChart() {
  const [chartData, setChartData] = useState<ChartDataType | null>(null)
  const [metricsData, setMetricsData] = useState<Record<string, any>>({})
  const [yearRange, setYearRange] = useState<number>(5)
  const [selectedMetric, setSelectedMetric] = useState<MetricOption>(METRICS[0])

  const chartOptions: ApexOptions = {
    chart: {
      type: "area",
      fontFamily: "Inter, sans-serif",
      toolbar: { show: false },
      background: "#e5e7eb",
    },
    dataLabels: { enabled: false },
    stroke: { width: 2, curve: "straight" },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.6,
        opacityTo: 0.5,
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
          name: selectedMetric.label,
          data: chartData.yAxisData.slice(0, yearRange).reverse(),
          color: "#cc00f4",
        },
      ]
    : []

  // Fetch all data on component mount
  useEffect(() => {
    const fetchAllData = async () => {
      const promises = METRICS.map(async (metric) => {
        try {
          const data = await dataFetchers[metric.dataKey]()
          return [metric.value, data]
        } catch (error) {
          console.error(`Error fetching ${metric.label}:`, error)
          return [metric.value, null]
        }
      })

      const results = await Promise.all(promises)
      setMetricsData(Object.fromEntries(results))
    }

    fetchAllData()
  }, [])

  // Update chart data when metric or data changes
  useEffect(() => {
    if (!metricsData[selectedMetric.value]) return

    if (selectedMetric.value === "population") {
      const years: string[] = []
      const population: number[] = []

      const countryPopulation = metricsData[selectedMetric.value]
      for (const country in countryPopulation) {
        const countryData = countryPopulation[country]
        countryData.years.forEach((year: string, index: number) => {
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

      setChartData({
        xAxisData: years,
        yAxisData: population.map(selectedMetric.formatter!),
      })
    } else {
      const data = metricsData[selectedMetric.value]
      setChartData({
        xAxisData: data.years,
        yAxisData: data[selectedMetric.value].map(selectedMetric.formatter!),
      })
    }
  }, [selectedMetric, metricsData])

  if (!chartData) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    )
  }

  return (
    <div className="w-full h-full bg-gray-200">
      <div className="flex justify-between w-full">
        <div className="flex justify-between mb-5">
          <select
            value={selectedMetric.value}
            onChange={(e) => {
              const metric = METRICS.find((m) => m.value === e.target.value)!
              setSelectedMetric(metric)
            }}
            className="px-3 py-2 text-sm font-medium rounded-lg border border-gray-200 focus:outline-none"
          >
            {METRICS.map((metric) => (
              <option key={metric.value} value={metric.value}>
                {metric.label}
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
      <Chart options={chartOptions} series={series} type="area" height="90%" />
    </div>
  )
}
