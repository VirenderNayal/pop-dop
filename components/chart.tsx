"use client"

import { useEffect, useState } from "react"
import Chart from "react-apexcharts"
import { ApexOptions } from "apexcharts"
import { getWorldPopulation } from "@/lib/worldbank"

const YEAR_OPTIONS = [5, 10, 20, 50]

export default function PopulationChart() {
  const [populationData, setPopulationData] = useState<{
    years: number[]
    population: number[]
  } | null>(null)
  const [yearRange, setYearRange] = useState(5)

  const options: ApexOptions = {
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
        opacityFrom: 0.7,
        opacityTo: 0.9,
        stops: [0, 90, 100],
      },
    },
    xaxis: {
      categories: populationData?.years.slice(0, yearRange).reverse() || [],
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

  const series = populationData
    ? [
        {
          name: "Total Population",
          data: populationData.population.slice(0, yearRange).reverse(),
          color: "#1A56DB",
        },
      ]
    : []

  useEffect(() => {
    const fetchPopulation = async () => {
      try {
        const data = await getWorldPopulation()
        setPopulationData(data)
      } catch (error) {
        console.error("Error fetching world population:", error)
      }
    }

    fetchPopulation()
  }, [])

  if (!populationData) return <div>Loading...</div>

  return (
    <div className="w-full bg-gray-200 p-4 md:p-6">
      <div className="flex justify-between mb-5">
        <select
          value={yearRange}
          onChange={(e) => setYearRange(Number(e.target.value))}
          className="px-3 py-2 text-sm font-medium rounded-lg border border-gray-200 focus:outline-none"
        >
          {YEAR_OPTIONS.map((year) => (
            <option key={year} value={year}>
              {year} Y
            </option>
          ))}
        </select>
      </div>
      <Chart options={options} series={series} type="area" height="90%" />
    </div>
  )
}
