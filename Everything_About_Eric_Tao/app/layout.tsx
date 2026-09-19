
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/navbar"
import { Footer } from "@/components/footer"
import { RouteCurtainProvider } from "@/components/curtain"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Eric Tao - Between Innovative & Realistic",
  description: "Personal website of a creative software developer showcasing skills and projects",
    generator: 'v0.app'
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
    <body className={`dark ${inter.variable} font-sans antialiased min-h-screen flex flex-col`}>
      {/* Mounted once here so the curtain outlives client-side navigation —
          anything rendered inside a page could only cover its own arrival. */}
      <RouteCurtainProvider>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </RouteCurtainProvider>
    </body>
    </html>
  )
}
