"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function BackToMainButton() {
  const router = useRouter()

  return (
    <Button variant="ghost" onClick={() => router.push("/")} className="mb-4" aria-label="Go back to previous page">
      <ArrowLeft className="mr-2 h-4 w-4" />
      Back
    </Button>
  )
}

