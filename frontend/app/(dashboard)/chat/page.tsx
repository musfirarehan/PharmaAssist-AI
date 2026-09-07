"use client"

import { useEffect, useState } from "react"
import { PageHeader } from "@/components/page-header"
import { AiPharmacistChat } from "@/components/chat/ai-pharmacist-chat"
import { PharmacistChat } from "@/components/chat/pharmacist-chat"

export default function ChatPage() {
  const [portal, setPortal] = useState<"patient" | "pharmacist">("pharmacist")
  const [mode, setMode] = useState<"ai" | "human">("human")

  useEffect(() => {
    const savedPortal = localStorage.getItem("portal")
    const params = new URLSearchParams(window.location.search)
    setPortal(savedPortal === "patient" ? "patient" : "pharmacist")
    setMode(params.get("mode") === "human" ? "human" : "ai")
  }, [])

  const showAi = portal === "patient" && mode === "ai"

  return (
    <div className="flex h-svh flex-col">
      <PageHeader
        title={showAi ? "AI Pharmacist Chat" : "Pharmacist Communication"}
        description={showAi ? "Ask questions about medicines, interactions, and side effects." : "Message patients and pharmacists directly in a private conversation."}
      />
      <main className="flex min-h-0 flex-1 flex-col p-4 md:p-6">
        {showAi ? <AiPharmacistChat /> : <PharmacistChat />}
      </main>
    </div>
  )
}
