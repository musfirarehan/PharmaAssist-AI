"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { buildApiUrl } from "@/lib/api"

type ChatMessage = { role: "user" | "ai"; text: string }

export function AiPharmacistChat() {
  const [question, setQuestion] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(false)

  const sendMessage = async () => {
    const trimmedQuestion = question.trim()
    if (!trimmedQuestion) return

    setMessages((previous) => [...previous, { role: "user", text: trimmedQuestion }])
    setQuestion("")
    setLoading(true)

    try {
      let medicines: unknown[] = []
      try {
        const saved = localStorage.getItem("prescriptionResult")
        if (saved) medicines = JSON.parse(saved)?.data?.counseling?.medicines || []
      } catch {
        medicines = []
      }

      const response = await fetch(buildApiUrl("/v1/chat"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: trimmedQuestion, medicines }),
      })
      const result = await response.json().catch(() => null)
      if (!response.ok || !result || result.success === false) {
        throw new Error(result?.message || result?.error || "Sorry, I could not process your question.")
      }
      setMessages((previous) => [...previous, { role: "ai", text: result?.data?.answer || "I could not generate an answer for that question." }])
    } catch (error) {
      setMessages((previous) => [...previous, { role: "ai", text: error instanceof Error ? error.message : "Sorry, I could not process your question." }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="flex min-h-0 flex-1 flex-col">
      <CardContent className="flex min-h-0 flex-1 flex-col gap-4 p-5">
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto">
          {messages.map((message, index) => <div key={`${message.role}-${index}`} className={message.role === "user" ? "ml-auto max-w-md rounded-lg bg-primary p-3 text-primary-foreground" : "max-w-md rounded-lg bg-muted p-3"}>{message.text}</div>)}
          {!messages.length && <p className="py-8 text-center text-sm text-muted-foreground">Ask the AI pharmacist about your medicines, interactions, or side effects.</p>}
        </div>
        <div className="flex gap-2">
          <input value={question} onChange={(event) => setQuestion(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); sendMessage() } }} placeholder="Ask about your medicines..." className="flex-1 rounded-lg border px-3 py-2" />
          <Button onClick={sendMessage} disabled={loading || !question.trim()}>{loading ? "Thinking..." : "Send"}</Button>
        </div>
      </CardContent>
    </Card>
  )
}