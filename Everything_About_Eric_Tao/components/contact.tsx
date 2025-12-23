"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { motion } from "framer-motion"

export default function Contact() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle")

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!name.trim() || !email.trim() || !message.trim()) {
      setStatus("error")
      return
    }

    setStatus("sending")
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      })

      if (!response.ok) {
        throw new Error("Request failed")
      }

      setStatus("success")
      setName("")
      setEmail("")
      setMessage("")
    } catch {
      setStatus("error")
    }
  }

  return (
    <section id="contact" className="py-16 md:py-24">
      <div className="container max-w-2xl">
        <motion.h2
          className="mb-8 text-center text-4xl font-bold font-saffron"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Collaborate with me
        </motion.h2>
        <motion.form
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          onSubmit={handleSubmit}
        >
          <Input
            placeholder="Your Name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
          <Input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <Textarea
            placeholder="Your Message"
            rows={4}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            required
          />
          <Button type="submit" className="w-full" disabled={status === "sending"}>
            {status === "sending" ? "Sending..." : "Send Message"}
          </Button>
          {status === "success" && <p className="text-sm text-green-500">Thanks! Your message was sent.</p>}
          {status === "error" && (
            <p className="text-sm text-red-500">Sorry, something went wrong. Please try again.</p>
          )}
        </motion.form>
      </div>
    </section>
  )
}
