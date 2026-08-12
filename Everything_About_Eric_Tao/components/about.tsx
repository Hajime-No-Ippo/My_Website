"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
            className="max-w-3xl w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div>
              <Card className="h-full flex flex-col border-none shadow-none">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold font-saffron sm:text-2xl">Hi, I am Eric Tao</CardTitle>
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
                      I&apos;m further studying on CNN / RNN artificial Intelligience and fine-turning on local large-language model.
                    </p>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-xl font-semibold font-saffron sm:text-2xl">If you&apos;re curious about my Research</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground sm:text-base">
                      <li>
                        <a href="https://blog.ericdesign.uk/" className="hover:underline italic">
                          https://blog.ericdesign.uk/
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
