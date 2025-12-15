"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"

const projects = [
  {
    id: 1,
    title: "Sustainable Marketplace Platform",
    description: "A modern e-commerce web app where users can upload, browse, and exchange products.",
    category: "Frontend",
    image: "https://ndszsepzvtrxsmzg.public.blob.vercel-storage.com/WechatIMG416.jpg",
  },
  {
    id: 2,
    title: "Real-Time Chatbox",
    description: "A Socket.io chat application with rooms, handshake logic, and Firebase user storage.",
    category: "Full-Stack",
    image: "https://ndszsepzvtrxsmzg.public.blob.vercel-storage.com/Chatbox/WechatIMG427.jpg",
  },
  {
    id: 3,
    title: "Design Lab Branding",
    description: "Logo design for my creative studio",
    category: "UI/UX",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/design-lab_%E7%94%BB%E6%9D%BF%201-qp1NuwprNlFGNRPlLvgsPp8WOpSI2R.png",
  },
  {
    id: 4,
    title: "Local LLM + Tauri Toolkit",
    description: "A desktop tool that captures screen, processes training images, and integrates local LLM models.",
    category: "Full-Stack",
    image: "https://ndszsepzvtrxsmzg.public.blob.vercel-storage.com/RustLLm/ui-screenshot-1764960498.png",
  },
  {
    id: 5,
    title: "iFoodie Food Exchange App",
    description: "A desktop tool that captures screen, processes training images, and integrates local LLM models.",
    category: "UI/UX",
    image: "https://ndszsepzvtrxsmzg.public.blob.vercel-storage.com/iFoodie/WX20251208-070645.png",
  }
]

const categories = ["All", "Frontend", "UI/UX", "Branding", "Full-Stack", "Ideation"]

export default function PortfolioContent() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = activeCategory === "All" || project.category === activeCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-10">
      <div className="rounded-3xl border border-border/50 bg-gradient-to-br from-black via-background to-[#0f0f0f] p-6 md:p-10 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-[#E77421]/80">Selected work</p>
            <h2 className="mt-2 text-3xl md:text-4xl font-bold font-saffron">Projects & Experiments</h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Explore recent frontend, product, and full-stack builds. Filter by craft or search by keywords to jump
              into specifics.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 bg-background/60 border-border focus-visible:ring-[#E77421]"
              aria-label="Search projects"
            />
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter projects by category">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={activeCategory === category ? "default" : "outline"}
                  className={
                    activeCategory === category
                      ? "bg-[#E77421] text-white hover:bg-[#E77421]/90"
                      : "border-border text-foreground hover:border-[#E77421]/60 hover:text-white"
                  }
                  onClick={() => setActiveCategory(category)}
                  aria-pressed={activeCategory === category}
                  size="sm"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="overflow-hidden border border-border/60 bg-gradient-to-b from-black via-background to-[#0b0b0b] shadow-lg hover:-translate-y-1 transition-transform duration-200">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={project.image || "/placeholder.svg"}
                  alt={project.title}
                  className="h-full w-full object-cover transition duration-500 ease-out hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <Badge className="absolute left-4 top-4 bg-white/10 text-white backdrop-blur border border-white/20">
                  {project.category}
                </Badge>
              </div>
              <CardHeader className="space-y-2">
                <CardTitle className="font-saffron text-xl">{project.title}</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">{project.description}</CardDescription>
              </CardHeader>
              <CardFooter className="pt-0">
                <Button variant="ghost" className="px-2 text-[#E77421] hover:text-white" size="sm">
                  View details →
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
      {filteredProjects.length === 0 && (
        <p className="text-center text-muted-foreground mt-8">No projects found matching your criteria.</p>
      )}
    </div>
  )
}
