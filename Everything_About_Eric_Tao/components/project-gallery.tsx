"use client"

import { useEffect, useRef, useState } from "react"
import { projects } from "@/data/projects"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

function ProjectGallery() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const [filter, setFilter] = useState<"All" | "Frontend" | "UI/UX" | "Full-Stack">("All")
  const [isVisible, setIsVisible] = useState(false)
  const [prevIds, setPrevIds] = useState<Set<number>>(new Set(projects.map((item) => item.id)))
  const filteredItems = filter === "All" ? projects : projects.filter((item) => item.category === filter)

  useEffect(() => {
    setPrevIds(new Set(filteredItems.map((item) => item.id)))
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ left: 0, behavior: "smooth" })
    }
  }, [filter])

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.15 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  // Wheel interception removed so page scroll behaves normally.

  return (
    <section
      id="project-gallery"
      ref={sectionRef}
      className={cn(
        "relative bg-background transition-opacity duration-700",
        isVisible ? "opacity-100" : "opacity-0",
      )}
    >
      <div className="container py-12">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <h2 className="text-3xl font-bold mb-4 md:mb-0 font-saffron">Project Gallery</h2>
          <nav className="flex gap-8 text-sm">
            {["All", "Frontend", "UI/UX", "Full-Stack"].map((category) => (
              <button
                key={category}
                className={cn(
                  "hover:text-[#E77421] transition-colors",
                  filter === category ? "text-[#E77421]" : "",
                )}
                onClick={() => setFilter(category as typeof filter)}
              >
                {category === "All" ? "ALL WORKS" : category}
              </button>
            ))}
          </nav>
        </div>

        <div
          ref={scrollRef}
          className="w-full h-[380px] rounded-lg overflow-x-auto overflow-y-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          <div className="relative flex h-full gap-10 px-2 w-max items-center">
            {filteredItems.map((item, index) => (
              <Dialog key={item.id}>
                <DialogTrigger asChild>
                  {(() => {
                    const isNew = !prevIds.has(item.id)
                    return (
                  <div
                    className={cn(
                      "relative shrink-0 transition-all duration-300 cursor-pointer w-[320px] h-[210px] md:w-[380px] md:h-[250px]",
                      isNew ? "opacity-0 translate-y-3" : "opacity-100 translate-y-0",
                    )}
                    style={{ transitionDelay: `${index * 80}ms` }}
                  >
                    <div className="relative w-full h-full overflow-hidden rounded-lg group">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.title}
                        className="absolute inset-0 h-full w-full object-cover transition-all duration-300 group-hover:scale-110"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="text-white text-center p-4">
                          <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                          <p className="text-sm">{item.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                    )
                  })()}
                </DialogTrigger>
                <DialogContent className="max-w-5xl w-full p-0 overflow-hidden">
                  <div className="flex flex-col md:flex-row h-[80vh]">
                    <ImageGallery mainImage={item.image} additionalImages={item.additionalImages} alt={item.title} />
                    <div className="md:w-1/2 h-full flex flex-col p-6 overflow-y-auto">
                      <DialogHeader className="mb-4">
                        <DialogTitle className="text-2xl font-bold font-saffron">{item.title}</DialogTitle>
                        <DialogDescription className="text-lg">{item.description}</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-lg font-semibold font-saffron">Project Details</h4>
                          <p className="text-muted-foreground">{item.detailedDescription}</p>
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold font-saffron">Technologies Used</h4>
                          <p className="text-muted-foreground">{item.technologies}</p>
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold font-saffron">Project Duration</h4>
                          <p className="text-muted-foreground">{item.duration}</p>
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold font-saffron">Key Features</h4>
                          <ul className="list-disc list-inside text-muted-foreground">
                            {item.features.map((feature, featureIndex) => (
                              <li key={`${item.id}-feature-${featureIndex}`}>{feature}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function ImageGallery({
  mainImage,
  additionalImages,
  alt,
}: { mainImage: string; additionalImages: string[]; alt: string }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const allImages = [mainImage, ...additionalImages]

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % allImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + allImages.length) % allImages.length)
  }

  return (
    <div className="md:w-1/2 h-full relative overflow-hidden">
      <motion.div
        key={currentImageIndex}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        <img
          src={allImages[currentImageIndex] || "/placeholder.svg"}
          alt={`${alt} - Image ${currentImageIndex + 1}`}
          className="absolute inset-0 h-full w-full rounded-lg object-cover"
          loading="lazy"
        />
      </motion.div>
      <div className="absolute inset-y-0 left-0 flex items-center">
        <Button
          variant="outline"
          size="icon"
          onClick={prevImage}
          className="rounded-full bg-background/80 backdrop-blur-sm ml-2 opacity-20 hover:opacity-70 transition-opacity"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>
      <div className="absolute inset-y-0 right-0 flex items-center">
        <Button
          variant="outline"
          size="icon"
          onClick={nextImage}
          className="rounded-full bg-background/80 backdrop-blur-sm mr-2 opacity-20 hover:opacity-70 transition-opacity"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {allImages.slice(0, 3).map((image, index) => (
          <button
            key={`${alt}-thumb-${index}`}
            onClick={() => setCurrentImageIndex(index)}
            className={cn(
              "w-16 h-16 rounded-md overflow-hidden border-2",
              currentImageIndex === index ? "border-[#E77421]" : "border-transparent",
            )}
          >
            <img src={image || "/placeholder.svg"} alt={`Thumbnail ${index + 1}`} className="h-16 w-16 object-cover" />
          </button>
        ))}
      </div>
    </div>
  )
}

export default ProjectGallery
