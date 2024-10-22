"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Sidebar() {
  const currentPath = usePathname()

  return (
    <div className="flex flex-col justify-start items-start bg-gray-200 rounded-3xl h-full py-12">
      <div className="font-bold text-5xl my-12 mx-auto">PopDop</div>
      <Link
        href="/"
        className={`flex w-2/3 mx-auto my-1 py-3 pr-3 rounded-3xl ${
          currentPath === "/" && "bg-gray-300"
        }`}
      >
        <div className="flex justify-start w-4/6 ml-auto items-center align-middle">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
            />
          </svg>
          <p className="text-xl mx-2">home</p>
        </div>
      </Link>
      <Link
        href="/population"
        className={`flex w-2/3 mx-auto my-1 py-3 pr-3 rounded-3xl ${
          currentPath === "/population" && "bg-gray-300"
        }`}
      >
        <div className="flex justify-start w-4/6 ml-auto items-center align-middle">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"
            />
          </svg>

          <p className="text-xl mx-2">population</p>
        </div>
      </Link>
      <Link
        href="/about"
        className={`flex w-2/3 mx-auto my-1 py-3 pr-3 rounded-3xl ${
          currentPath === "/about" && "bg-gray-300"
        }`}
      >
        <div className="flex justify-start w-4/6 ml-auto items-center align-middle">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
            />
          </svg>
          <p className="text-xl mx-2">about</p>
        </div>
      </Link>
    </div>
  )
}
