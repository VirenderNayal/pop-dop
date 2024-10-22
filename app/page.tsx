"use client"

import { useEffect, useState } from "react"
import PopulationChart from "@/components/home-chart"
import {
  getAveragePopulationDensity,
  getWorldPopulation,
} from "@/lib/worldbank"
import HomeChart from "@/components/home-chart"

interface WorldData {
  population: {
    current: number
    // Add other properties as needed
  }
  density: string | null
}

export default function Home() {
  const [worldData, setWorldData] = useState<WorldData | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [population, density] = await Promise.all([
          getWorldPopulation(),
          getAveragePopulationDensity(),
        ])
        setWorldData({ population, density })
      } catch (error) {
        console.error("Error fetching world data:", error)
      }
    }
    fetchData()
  }, [])

  if (!worldData)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    )

  const { population, density } = worldData

  return (
    <main className="flex flex-col h-full">
      <section className="flex basis-1/5 h-full">
        <InfoCard title="World Population" value={`${population.current}B`} />
        <InfoCard title="Average Density" value={`${density}p/sqkm`} />
      </section>
      <section className="flex basis-4/5 justify-center items-center h-full mx-10 my-5 rounded-2xl bg-gray-200">
        <div className="flex h-3/4 w-full mx-12">
          <StatList
            stats={[
              { label: "World Population", value: `${population.current}B` },
              { label: "Stat 2", value: "Value 2" },
              { label: "Stat 3", value: "Value 3" },
              { label: "Stat 4", value: "Value 4" },
            ]}
          />
          <div className="flex basis-3/4">
            <HomeChart />
          </div>
        </div>
      </section>
    </main>
  )
}

const InfoCard = ({ title, value }: { title: string; value: string }) => (
  <div className="flex flex-col justify-center items-center basis-1/2 mx-10 my-5 rounded-2xl bg-gray-200">
    <p className="text-lg font-semibold">{title}</p>
    <p className="text-2xl font-bold">{value}</p>
  </div>
)

const StatList = ({ stats }: { stats: { label: string; value: string }[] }) => (
  <div className="flex basis-1/4 flex-col">
    {stats.map((stat, index) => (
      <div key={index} className="mb-4 last:mb-0">
        <p className="text-sm text-gray-600">{stat.label}</p>
        <p className="text-lg font-semibold">{stat.value}</p>
      </div>
    ))}
  </div>
)
