import Image from "next/image"

export default function Home() {
  return (
    <main className="flex flex-col h-full">
      <div className="flex basis-1/5 h-full">
        <div className="flex basis-1/2 mx-10 my-5 rounded-2xl bg-gray-200"></div>
        <div className="flex basis-1/2 mx-10 my-5 rounded-2xl bg-gray-200"></div>
      </div>
      <div className="flex basis-4/5 h-full mx-10 my-5 rounded-2xl bg-gray-200"></div>
    </main>
  )
}
