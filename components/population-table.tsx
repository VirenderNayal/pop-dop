"use client"

import { getTableData } from "@/lib/worldbank"
import { useEffect, useState } from "react"

const TABLE_OPTIONS = ["2023", "2022", "2021", "2020", "2019", "2018"]
export default function PopulationTable() {
  const [tableOptions, setTableOptions] = useState<string>("2023")
  const [tableData, setTableData] = useState<any>()

  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    setIsLoading(true)
    const fetchData = async () => {
      try {
        const data = await getTableData(tableOptions)
        setTableData(() => data)
      } catch (error) {
        console.error("Error fetching world population:", error)
      }
    }

    fetchData()

    setIsLoading(false)
  }, [tableOptions])

  if (isLoading || !tableData)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    )

  return (
    <div className="flex flex-col mt-5">
      <div className="flex justify-end w-full">
        <div className="flex justify-between mb-5">
          <select
            value={tableOptions}
            onChange={(e) => setTableOptions(e.target.value)}
            className="px-3 py-2 text-sm font-medium rounded-lg border border-gray-200 focus:outline-none"
          >
            {TABLE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>
      <table className="table-fixed w-full border-separate border-spacing-0">
        <tbody>
          <tr className="font-bold">
            <td className="border border-gray-400 p-4 text-center">Country</td>
            <td className="border border-gray-400 p-4 text-center">
              Population
            </td>
            <td className="border border-gray-400 p-4 text-center">Density</td>
            <td className="border border-gray-400 p-4 text-center">
              Growth Rate
            </td>
            <td className="border border-gray-400 p-4 text-center">
              Life Exp. at Birth
            </td>
            <td className="border border-gray-400 p-4 text-center">
              Birth Rate
            </td>
            <td className="border border-gray-400 p-4 text-center">
              Death Rate
            </td>
            <td className="border border-gray-400 p-4 text-center">
              Fertility Rate
            </td>
          </tr>
          {Object.entries(tableData).map(([country, values]) => (
            <tr key={country}>
              <td>{country}</td>
              {(values as (number | string | null)[]).map(
                (value: any, index: any) => (
                  <td
                    key={index}
                    className="border border-gray-400 p-4 text-center"
                  >
                    {value === null
                      ? "N/A"
                      : index === 0
                      ? (value / 1_000_000_000).toFixed(1)
                      : value.toFixed(1)}
                  </td>
                )
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
