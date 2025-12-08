"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircle, X, Send } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useChat } from "@ai-sdk/react"


export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: "/api/chat",
  })
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messagesEndRef])

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    handleSubmit(e)
  }

  return (
    <>
      <Button
        className="fixed bottom-4 right-4 rounded-full w-16 h-16 shadow-lg z-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <MessageCircle className="h-8 w-8" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.5 }}
            transition={{ type: "spring", damping: 15, stiffness: 100 }}
            className="fixed bottom-20 right-4 bg-background border rounded-lg w-80 h-[480px] shadow-lg flex flex-col overflow-hidden z-50"
          >
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="font-semibold">AI Assistant (ChatGPT)</h3>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <ScrollArea className="flex-grow p-4 h-[calc(100%-8rem)]">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`mb-4 ${message.role === "assistant" ? "text-primary" : "text-secondary-foreground"}`}
                >
                  <strong>{message.role === "assistant" ? "AI: " : "You: "}</strong>
                  {message.content}
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </ScrollArea>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-4 py-2 text-red-500 text-sm"
              >
                Error: {error.message}
              </motion.div>
            )}
            <form onSubmit={onSubmit} className="p-4 border-t flex gap-2">
              <Input
                value={input}
                onChange={handleInputChange}
                placeholder="Ask me anything..."
                disabled={isLoading}
                className="flex-grow"
              />
              <Button type="submit" disabled={isLoading} size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

