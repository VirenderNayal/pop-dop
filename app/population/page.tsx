import PopulationChart from "@/components/population-chart"
import "./style.css"
import PopulationTable from "@/components/population-table"

export default function PopulationPage() {
  return (
    <main className="flex flex-col h-full mx-10 py-10 rounded-3xl bg-gray-200">
      <section className="flex basis-3/5 px-20">
        <PopulationChart />
      </section>
      <section className="flex basis-2/5 px-20">
        <PopulationTable />
      </section>
    </main>
  )
}
