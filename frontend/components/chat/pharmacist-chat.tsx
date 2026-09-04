"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { buildApiUrl } from "@/lib/api"

export function PharmacistChat() {
  const [question, setQuestion] = useState("")
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const sendMessage = async () => {
    if (!question.trim()) return

    const trimmedQuestion = question.trim()
    const userMessage = { role: "user", text: trimmedQuestion }

    setMessages((prev) => [...prev, userMessage])
    setLoading(true)

    try {
      let medicines: any[] = []

      try {
        const saved = localStorage.getItem("prescriptionResult")
        if (saved) {
          const parsed = JSON.parse(saved)
          medicines = parsed?.data?.counseling?.medicines || []
        }
      } catch (error) {
        console.warn("PrescriptionResult was not valid JSON:", error)
      }

      const response = await fetch(buildApiUrl("/v1/chat"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: trimmedQuestion, medicines }),
      })

      const result = await response.json().catch(() => null)

      if (!response.ok || !result || result.success === false) {
        const fallback = result?.message || result?.error || "Sorry, I could not process your question."
        throw new Error(fallback)
      }

      const answer = result?.data?.answer || "I could not generate an answer for that question."

      setMessages((prev) => [...prev, { role: "ai", text: answer }])
    } catch (error) {
      console.error(error)
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text:
            error instanceof Error
              ? error.message
              : "Sorry, I could not process your question.",
        },
      ])
    } finally {
      setQuestion("")
      setLoading(false)
    }
  }

  return (
    <Card className="flex flex-1 flex-col">
      <CardContent className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex-1 space-y-4 overflow-y-auto">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={
                msg.role === "user"
                  ? "ml-auto max-w-md rounded-lg bg-primary p-3 text-primary-foreground"
                  : "max-w-md rounded-lg bg-muted p-3"
              }
            >
              {msg.text}
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask about your medicines..."
            className="flex-1 rounded-lg border px-3 py-2"
          />

          <Button onClick={sendMessage} disabled={loading}>
            {loading ? "Thinking..." : "Send"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
