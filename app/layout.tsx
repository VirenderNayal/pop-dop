import type { Metadata } from "next"
import "./globals.css"
import Sidebar from "@/components/sidebar"

export const metadata: Metadata = {
  title: "PopDop",
  description: "Data analysis application for population.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <div className="flex flex-row">
          <div className="basis-1/4 h-screen p-10">
            <Sidebar />
          </div>
          <div className="basis-3/4 h-screen py-8">{children}</div>
        </div>
      </body>
    </html>
  )
}
