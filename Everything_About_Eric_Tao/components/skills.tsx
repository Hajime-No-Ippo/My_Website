"use client"

import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { motion } from "framer-motion"

const skills = [
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "Python",
  "UED",
  "Tailwind CSS",
  "Figma",
  "3D modeling",
]

export default function Skills() {
  return (
    <section id="skills" className="py-16 md:py-24 relative overflow-hidden group">
      <Image
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/05c67409242633d69fb4a3c20b0ad20.jpg-JBbs7LmOKOsn9yYNlE9eRZEK8MN5uH.jpeg"
        alt="Skills background"
        layout="fill"
        objectFit="cover"
        className="absolute inset-0 z-0 transition-all duration-700 ease-in-out group-hover:blur-md"
        priority
      />
      <div className="absolute inset-0 bg-black/40 transition-all duration-700 ease-in-out z-10 group-hover:bg-black/60"></div>
      <div className="container max-w-4xl relative z-20">
        <motion.h2
          className="mb-12 text-center text-4xl font-bold text-white font-saffron"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          My Skills
        </motion.h2>
        <motion.div
          className="flex flex-wrap justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {skills.map((skill, index) => (
            <motion.div
              key={skill}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <Badge
                variant="secondary"
                className="text-lg px-4 py-2 bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm text-white border border-white/20"
              >
                {skill}
              </Badge>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

