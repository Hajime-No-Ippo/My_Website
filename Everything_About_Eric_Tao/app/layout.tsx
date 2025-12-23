
import type { Metadata } from "next"
import { Playfair_Display as Saffron, Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/navbar"
import { Footer } from "@/components/footer"

const saffron = Saffron({
  subsets: ["latin"],
  variable: "--font-saffron",
  weight: ["400", "700"],
  display: "swap",
})

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
    <body className={`dark ${saffron.variable} ${inter.variable} font-sans antialiased min-h-screen flex flex-col`}>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </body>
    </html>
  )
}
