"use client"

import { useRef, useEffect, useState } from "react"
import Image from "next/legacy/image"
import { ScrollArea } from "@/components/ui/scroll-area"
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
import { motion, AnimatePresence } from "framer-motion"

const galleryItems = [
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/PLATES-rVTHgVnTltSIQgQsMfLfKyYkD7vJUI.png",
    alt: "Mobile App Framework Design",
    className: "w-[400px] h-[250px]",
    title: "Mobile UI Framework",
    description: "User interface architecture for food exchange application",
    detailedDescription:
      "This mobile UI framework was designed to provide a seamless and intuitive user experience for a service-based application. It focuses on simplicity, accessibility, and scalability to accommodate various features and user needs.",
    technologies: "Figma",
    duration: "4 weeks",
    features: [
      "Modular component design",
      "Responsive layouts for various device sizes",
      "Customizable theming system",
      "Accessibility-first approach",
    ],
    additionalImages: [
      "https://ndszsepzvtrxsmzg.public.blob.vercel-storage.com/iFoodie/Menu%20Page.png",
      "/placeholder.svg?height=250&width=400",
    ],
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/design-lab_%E7%94%BB%E6%9D%BF%201-qp1NuwprNlFGNRPlLvgsPp8WOpSI2R.png",
    alt: "Design Lab Logo - Original",
    className: "w-[350px] h-[220px]",
    title: "Design Lab Branding",
    description: "Logo design for creative studio",
    detailedDescription:
      "The Design Lab logo was created to represent a creative studio that combines innovation with precision. The logo embodies the studio's core values of creativity, technology, and collaboration.",
    technologies: "Adobe Illustrator, Adobe InDesign",
    duration: "1 week",
    features: [
      "Versatile monogram design",
      "Scalable for various applications",
      "Color palette selection",
      "Typography integration",
    ],
    additionalImages: [
      "/placeholder.svg?height=220&width=350",
      "/placeholder.svg?height=220&width=350",
      "/placeholder.svg?height=220&width=350",
    ],
  },
  {
    src: "https://ndszsepzvtrxsmzg.public.blob.vercel-storage.com/WechatIMG416.jpg",
    alt: "Sustainable Marketplace Platform",
    className: "w-[500px] h-[300px]",
    title: "Sustainable Marketplace Platform",
    description: "Frontend development with firebase backend project with user authentication",
    detailedDescription:
      "A modern e-commerce web app where users can upload, browse, and exchange products. Includes real-time chat, product gallery with zoom, authentication, and Firestore integration.",
    technologies: "React, D3.js, WebSocket, Three.js",
    duration: "6 weeks",
    features: [
      "Real-time new-released product status updates",
      "Real-time comment list function",
      "Navigator to seller's email",
      "Product searching and sorting",
    ],
    additionalImages: [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dashboard-qeRWpfF3gcrWLP8W8ZTtW26FPocCvI.png",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dashboard2-K3i3ATBJhup7rovvPkbq2SiUzCmqzm.png",
    ],
  },
  {
    src: "/placeholder.svg?height=400&width=600",
    alt: "Eco-Friendly Product Packaging",
    className: "w-[450px] h-[350px]",
    title: "Eco-Friendly Product Packaging",
    description: "Sustainable packaging design for consumer goods",
    detailedDescription:
      "This project focuses on creating environmentally friendly packaging solutions for everyday consumer products. The designs prioritize recyclability, biodegradability, and minimal material usage.",
    technologies: "Sustainable materials, 3D printing, CAD software",
    duration: "8 weeks",
    features: [
      "100% recyclable materials",
      "Minimalist design to reduce waste",
      "Innovative folding techniques",
      "Informative eco-friendly labeling",
    ],
    additionalImages: [
      "/placeholder.svg?height=350&width=450",
      "/placeholder.svg?height=350&width=450",
      "/placeholder.svg?height=350&width=450",
    ],
  },
]

function Gallery() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (scrollRef.current) {
        e.preventDefault()
        scrollRef.current.scrollLeft += e.deltaY
      }
    }

    const currentScrollRef = scrollRef.current
    if (currentScrollRef) {
      currentScrollRef.addEventListener("wheel", handleWheel, { passive: false })
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      {
        threshold: 0.1,
      },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (currentScrollRef) {
        currentScrollRef.removeEventListener("wheel", handleWheel)
      }
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        const scrollPosition = scrollRef.current.scrollLeft
        const itemWidth = scrollRef.current.scrollWidth / galleryItems.length
        const newSlide = Math.round(scrollPosition / itemWidth)
        setCurrentSlide(newSlide)
      }
    }

    const currentScrollRef = scrollRef.current
    if (currentScrollRef) {
      currentScrollRef.addEventListener("scroll", handleScroll)
    }

    return () => {
      if (currentScrollRef) {
        currentScrollRef.removeEventListener("scroll", handleScroll)
      }
    }
  }, []) // Removed unnecessary dependency: galleryItems.length

  return (
    <section
      id="gallery"
      ref={sectionRef}
      className={cn(
        "relative min-h-screen bg-background transition-all duration-1000 ease-in-out",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10",
      )}
    >
      <div className="container py-16">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <h2 className="text-3xl font-bold mb-4 md:mb-0 font-saffron">Project Gallery</h2>
          <nav className="flex gap-8 text-sm">
            <button className="hover:text-[#E77421] transition-colors">ALL WORKS</button>
            <button className="hover:text-[#E77421] transition-colors">3D DESIGN</button>
            <button className="hover:text-[#E77421] transition-colors">UI/UX</button>
            <button className="hover:text-[#E77421] transition-colors">INDUSTRIAL DESIGN</button>
          </nav>
        </div>

        <ScrollArea className="w-full h-[600px] rounded-lg" scrollHideDelay={400}>
          <div className="relative flex h-full gap-10 px-2" ref={scrollRef}>
            {galleryItems.map((item, index) => (
              <Dialog key={index}>
                <DialogTrigger asChild>
                  <div
                    className={cn(
                      "relative shrink-0 transition-all duration-500 cursor-pointer",
                      item.className,
                      isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10",
                    )}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <div className="relative w-full h-full overflow-hidden rounded-lg group">
                      <Image
                        src={item.src || "/placeholder.svg"}
                        alt={item.alt}
                        layout="fill"
                        objectFit="cover"
                        className="transition-all duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="text-white text-center p-4">
                          <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                          <p className="text-sm">{item.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-5xl w-full p-0 overflow-hidden">
                  <div className="flex flex-col md:flex-row h-[80vh]">
                    <ImageGallery mainImage={item.src} additionalImages={item.additionalImages} alt={item.alt} />
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
                            {item.features.map((feature, index) => (
                              <li key={index}>{feature}</li>
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
        </ScrollArea>

        <div className="flex justify-center gap-2 mt-8">
          {galleryItems.map((_, index) => (
            <button
              key={index}
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                currentSlide === index ? "bg-[#E77421] w-4" : "bg-muted",
              )}
              onClick={() => {
                const targetElement = scrollRef.current?.children[index] as HTMLElement
                if (targetElement) {
                  targetElement.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" })
                }
                setCurrentSlide(index)
              }}
            />
          ))}
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
        <Image
          src={allImages[currentImageIndex] || "/placeholder.svg"}
          alt={`${alt} - Image ${currentImageIndex + 1}`}
          layout="fill"
          objectFit="cover"
          className="rounded-lg"
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
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={cn(
              "w-16 h-16 rounded-md overflow-hidden border-2",
              currentImageIndex === index ? "border-[#E77421]" : "border-transparent",
            )}
          >
            <Image
              src={image || "/placeholder.svg"}
              alt={`Thumbnail ${index + 1}`}
              width={64}
              height={64}
              objectFit="cover"
            />
          </button>
        ))}
      </div>
    </div>
  )
}

export default Gallery
