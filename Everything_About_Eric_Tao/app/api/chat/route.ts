import { NextResponse } from "next/server"
import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    // Ensure that the messages array is not empty and has the correct structure
    if (!Array.isArray(messages) || messages.length === 0 || !messages[0].content) {
      throw new Error("Invalid message format")
    }

    const result = streamText({
      model: openai("gpt-4-turbo"),
      messages: messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Error in API route:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An unknown error occurred" },
      { status: 500 },
    )
  }
}

