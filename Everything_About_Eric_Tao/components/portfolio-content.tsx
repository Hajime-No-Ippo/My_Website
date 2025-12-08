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
    category: "Frontend Develop",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/house.4white-gxoEvJ7aKPNSFBAIgN0Q42uxhAfelr.png",
  },
  {
    id: 2,
    title: "Real-Time Chatbox",
    description: "A Socket.io chat application with rooms, handshake logic, and Firebase user storage.",
    category: "Full-Stack",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/PLATES-rVTHgVnTltSIQgQsMfLfKyYkD7vJUI.png",
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
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dashboard3-M94QOTwML0TPEyYcAS495G912XdD5f.png",
  }
]

const categories = ["All", "Frontend", "UI/UX", "Branding", "Full-Stack"]

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
    <div>
      <div className="mb-8 flex flex-col sm:flex-row gap-4">
        <Input
          type="text"
          placeholder="Search projects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm border-[#E77421] focus-visible:ring-[#E77421]"
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
                  : "border-[#E77421] text-[#E77421] hover:bg-[#E77421]/10"
              }
              onClick={() => setActiveCategory(category)}
              aria-pressed={activeCategory === category}
            >
              {category}
            </Button>
          ))}
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
            <Card className="border-[#E77421]">
              <CardHeader>
                <CardTitle className="font-saffron">{project.title}</CardTitle>
                <CardDescription>{project.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <img
                  src={project.image || "/placeholder.svg"}
                  alt={project.title}
                  className="w-full h-48 object-cover rounded-md"
                />
              </CardContent>
              <CardFooter>
                <Badge variant="secondary" className="bg-[#E77421] text-white">
                  {project.category}
                </Badge>
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

