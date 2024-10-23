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
        <div className="flex 2xl:flex-row flex-col">
          <div className="2xl:basis-1/4 basis-1/12 2xl:h-screen 2xl:p-10 p-2">
            <Sidebar />
          </div>
          <div className="2xl:basis-3/4 basis-11/12 h-screen 2xl:py-8">
            {children}
          </div>
        </div>
      </body>
    </html>
  )
}
