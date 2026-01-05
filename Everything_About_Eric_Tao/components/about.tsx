"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { motion } from "framer-motion"

export default function About() {
  return (
    <section id="about" className="py-12 md:py-24">
      <div className="container max-w-7xl px-4 sm:px-6">
        <motion.h2
          className="mb-6 text-center text-3xl font-bold sm:text-4xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          About Me
        </motion.h2>
        <div className="flex justify-center">
          <motion.div
            className="flex flex-col md:flex-row gap-6 items-stretch max-w-6xl w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="w-full md:w-1/2 flex justify-center">
              <div className="relative w-full max-w-[380px] sm:max-w-[420px] md:max-w-[500px] aspect-[4/5] md:aspect-[3/4] overflow-hidden rounded-lg group">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/f204798ad48d24e7e654dfac781e642.jpg-M1JKYWrM6B7VVLpIIM8IBZM9xq6dMV.jpeg"
                  alt="Chenming Tao in a green hoodie"
                  fill
                  className="transition-all duration-500 ease-in-out grayscale group-hover:grayscale-0"
                  style={{ objectFit: "cover" }}
                />
                <div className="absolute inset-0 bg-black opacity-0 transition-opacity duration-500 group-hover:opacity-10"></div>
              </div>
            </div>
            <div className="w-full md:w-1/2">
              <Card className="h-full flex flex-col">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold font-saffron sm:text-3xl">Hi, I am Eric Tao</CardTitle>
                  <CardDescription className="text-base font-inter sm:text-lg">
                    <p className="text-muted-foreground">
                      I am a Software Development student at Maynooth University.
                      I combine my background in Art & Design with software engineering to create applications with
                      both strong technical foundation and excellent user experience.

                    </p>
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col justify-between">
                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold font-saffron sm:text-2xl">Not only developer but also designer</h3>
                    
                    <p className="text-sm text-muted-foreground sm:text-base">
                      I have a dual background in Art & Design and Computer Science.
                      This allows me to bridge the gap between user experience and engineering.
                    
                      I build full-stack applications and also design the interfaces people
                      interact with. My work combines system thinking, UX reasoning, and
                      modern web development.
                    </p>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold font-saffron sm:text-2xl">My Further Study</h3>
                    <p className="text-sm text-muted-foreground sm:text-base">
                      I'm further studying on CNN / RNN artificial Intelligience and fine-turning on local large-language model.
                    </p>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-xl font-semibold font-saffron sm:text-2xl">If you're curious about my BLOG</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground sm:text-base">
                      <li>
                        <a href="https://design6003.wordpress.com/" className="hover:underline italic">
                          https://design6003.wordpress.com/
                        </a>
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
