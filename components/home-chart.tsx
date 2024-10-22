"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { ApexOptions } from "apexcharts"
import { getWorldPopulation } from "@/lib/worldbank"

const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center h-[400px]">
      Loading chart...
    </div>
  ),
})

// Types
interface PopulationData {
  years: number[]
  population: number[]
}

interface ChartData {
  options: ApexOptions
  series: ApexAxisChartSeries
}

// Constants
const YEAR_OPTIONS = [5, 10, 20, 50] as const
type YearRange = (typeof YEAR_OPTIONS)[number]

const CHART_CONFIG = {
  color: "#cc00f4",
  fontFamily: "Inter, sans-serif",
} as const

// Hooks
const usePopulationData = () => {
  const [data, setData] = useState<PopulationData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getWorldPopulation()
        setData(result)
      } catch (error) {
        setError("Failed to fetch population data")
        console.error("Error fetching world population:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  return { data, error, isLoading }
}

// Components
const YearRangeSelector = ({
  value,
  onChange,
}: {
  value: YearRange
  onChange: (value: YearRange) => void
}) => (
  <select
    value={value}
    onChange={(e) => onChange(Number(e.target.value) as YearRange)}
    className="px-3 py-2 text-sm font-medium rounded-lg border border-gray-200 focus:outline-none hover:bg-gray-50 transition-colors"
    aria-label="Select year range"
  >
    {YEAR_OPTIONS.map((year) => (
      <option key={year} value={year}>
        {year} yrs
      </option>
    ))}
  </select>
)

const LoadingState = () => (
  <div className="flex justify-center items-center h-screen" role="status">
    <span className="text-gray-500">Loading...</span>
  </div>
)

const ErrorState = ({ message }: { message: string }) => (
  <div
    className="flex justify-center items-center h-screen text-red-500"
    role="alert"
  >
    {message}
  </div>
)

// Chart configuration builder
const createChartConfig = (
  data: PopulationData,
  yearRange: number
): ChartData => ({
  options: {
    chart: {
      type: "area",
      fontFamily: CHART_CONFIG.fontFamily,
      toolbar: { show: false },
      background: "#e5e7eb",
    },
    dataLabels: { enabled: false },
    stroke: {
      width: 2,
      curve: "straight",
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.6,
        opacityTo: 0.5,
      },
    },
    xaxis: {
      categories: data.years.slice(0, yearRange).reverse(),
      labels: {
        style: {
          fontFamily: CHART_CONFIG.fontFamily,
          cssClass: "text-xs font-normal fill-gray-500 dark:fill-gray-400",
        },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: { show: true },
  },
  series: [
    {
      name: "Total Population",
      data: data.population.slice(0, yearRange).reverse(),
      color: CHART_CONFIG.color,
    },
  ],
})

export default function HomeChart() {
  const [yearRange, setYearRange] = useState<YearRange>(5)
  const { data, error, isLoading } = usePopulationData()

  if (isLoading) return <LoadingState />
  if (error) return <ErrorState message={error} />
  if (!data) return null

  const chartConfig = createChartConfig(data, yearRange)

  return (
    <div className="w-full bg-gray-200 p-4 md:p-6 rounded-lg">
      <div className="flex justify-between mb-5">
        <YearRangeSelector value={yearRange} onChange={setYearRange} />
      </div>
      <Chart
        options={chartConfig.options}
        series={chartConfig.series}
        type="area"
        height="90%"
      />
    </div>
  )
}
