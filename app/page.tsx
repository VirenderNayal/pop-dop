"use client"

import { useEffect, useState } from "react"
import PopulationChart from "@/components/home-chart"
import {
  getAveragePopulationDensity,
  getCurrLifeExp,
  getPopulationChange,
  getWorldPopulation,
} from "@/lib/worldbank"
import HomeChart from "@/components/home-chart"

export default function Home() {
  const [worldData, setWorldData] = useState<any | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [population, density, worldLifeExp, populationChange] =
          await Promise.all([
            getWorldPopulation(),
            getAveragePopulationDensity(),
            getCurrLifeExp(),
            getPopulationChange(),
          ])
        setWorldData({ population, density, worldLifeExp, populationChange })
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

  const { population, density, worldLifeExp, populationChange } = worldData

  return (
    <main className="flex flex-col h-full">
      <section className="flex basis-1/5 h-full">
        <InfoCard title="World Population" value={`${population.current}B`} />
        <InfoCard title="Average Density" value={`${density}p/sqkm`} />
      </section>
      <section className="flex basis-4/5 justify-center items-center h-full mx-10 my-5 rounded-2xl bg-gray-200">
        <div className="flex h-3/4 w-full mx-12 pb-16">
          <StatList
            stats={[
              { label: "Total Population", value: `${population.current}B` },
              { label: "Change in last year", value: `${populationChange}M` },
              { label: "Life Expectancy at Birth", value: `${worldLifeExp}` },
            ]}
          />
          <div className="flex basis-3/4 border-b-2 border-gray-300">
            <HomeChart />
          </div>
        </div>
      </section>
    </main>
  )
}

const InfoCard = ({ title, value }: { title: string; value: string }) => (
  <div className="flex flex-col justify-center items-center basis-1/2 mx-10 my-5 rounded-2xl bg-gray-200">
    <p className="text-lg text-gray-600">{title}</p>
    <p className="text-4xl font-semibold p-2">{value}</p>
  </div>
)

const StatList = ({ stats }: { stats: { label: string; value: string }[] }) => (
  <div className="flex basis-1/4 flex-col justify-end pl-28 pb-16 border-b-2 border-gray-300">
    {stats.map((stat, index) => (
      <div key={index} className="mb-4 last:mb-0">
        <p className="text-lg text-gray-600">{stat.label}</p>
        <p className="text-4xl font-semibold">{stat.value}</p>
      </div>
    ))}
  </div>
)
