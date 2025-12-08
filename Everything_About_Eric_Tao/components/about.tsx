"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { motion } from "framer-motion"

export default function About() {
  return (
    <section id="about" className="py-16 md:py-24">
      <div className="container max-w-7xl">
        <motion.h2
          className="mb-8 text-center text-4xl font-bold"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          About Me
        </motion.h2>
        <div className="flex justify-center">
          <motion.div
            className="flex flex-col md:flex-row gap-2 items-stretch max-w-6xl w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="w-full md:w-1/2 flex justify-center">
              <div className="relative w-full max-w-[500px] aspect-[3/4] overflow-hidden rounded-lg group">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/f204798ad48d24e7e654dfac781e642.jpg-M1JKYWrM6B7VVLpIIM8IBZM9xq6dMV.jpeg"
                  alt="Chenming Tao in a green hoodie"
                  layout="fill"
                  objectFit="cover"
                  className="transition-all duration-500 ease-in-out grayscale group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-black opacity-0 transition-opacity duration-500 group-hover:opacity-10"></div>
              </div>
            </div>
            <div className="w-full md:w-1/2">
              <Card className="h-full flex flex-col">
                <CardHeader>
                  <CardTitle className="text-3xl font-bold font-saffron">Hi, I am Chenming Tao</CardTitle>
                  <CardDescription className="text-lg font-inter">
                    Why don't we make things easier and reliable?
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col justify-between">
                  <div className="space-y-4">
                    <h3 className="text-2xl font-semibold font-saffron">Not only developer but also designer</h3>
                    <p className="text-muted-foreground">
                      I am a Software Development student at Maynooth University.
                      I combine my background in Art & Design with software engineering to create applications with
                      both strong technical foundation and excellent user experience.

                    </p>
                    <p className="text-muted-foreground">
                      My unique background in both development and design allows me to bridge the gap between aesthetics
                      and functionality. I believe in creating software that not only works flawlessly but also provides
                      an intuitive and enjoyable user experience. Whether it's crafting responsive web applications,
                      designing user interfaces, or developing innovative software solutions, I approach each project
                      with creativity, technical expertise, and a user-centric mindset.
                    </p>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-2xl font-semibold font-saffron">Honor & License</h3>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                      <li>
                        Oracle Artificial Intelligience Associate Certificate
                      </li>
                      <li>
                        National Design Awards in China
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

