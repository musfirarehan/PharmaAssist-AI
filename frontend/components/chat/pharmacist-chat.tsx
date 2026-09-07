"use client"

import { useEffect, useState } from "react"
import { MessageSquare, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { buildApiUrl } from "@/lib/api"

type Contact = { id: number; name: string; email: string; role: "patient" | "pharmacist" }
type Message = { id: number; sender_id: number; body: string; created_at: string }

export function PharmacistChat() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [body, setBody] = useState("")
  const [currentUserId, setCurrentUserId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState("")

  const authHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("authToken") || ""}`,
    "Content-Type": "application/json",
  })

  const loadConversation = async (contact: Contact) => {
    const response = await fetch(buildApiUrl(`/v1/messages/${contact.id}`), {
      headers: authHeaders(),
    })
    const payload = await response.json().catch(() => null)
    if (!response.ok || !payload?.success) {
      throw new Error(payload?.error || "Could not load conversation.")
    }
    setMessages(payload.data.messages || [])
  }

  useEffect(() => {
    const loadContacts = async () => {
      try {
        const profile = JSON.parse(localStorage.getItem("profile") || "null")
        setCurrentUserId(profile?.id || null)
        const response = await fetch(buildApiUrl("/v1/messages/contacts"), {
          headers: authHeaders(),
        })
        const payload = await response.json().catch(() => null)
        if (!response.ok || !payload?.success) {
          throw new Error(payload?.error || "Could not load contacts.")
        }
        const availableContacts = payload.data || []
        setContacts(availableContacts)
        setSelectedContact(availableContacts[0] || null)
        if (availableContacts[0]) await loadConversation(availableContacts[0])
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Could not load contacts.")
      } finally {
        setLoading(false)
      }
    }

    loadContacts()
  }, [])

  useEffect(() => {
    if (!selectedContact) return
    const refresh = window.setInterval(() => {
      loadConversation(selectedContact).catch(() => undefined)
    }, 5000)
    return () => window.clearInterval(refresh)
  }, [selectedContact])

  const selectContact = async (contact: Contact) => {
    setSelectedContact(contact)
    setError("")
    try {
      await loadConversation(contact)
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Could not load conversation.")
    }
  }

  const sendMessage = async () => {
    if (!selectedContact || !body.trim()) return
    setSending(true)
    setError("")
    try {
      const response = await fetch(buildApiUrl("/v1/messages"), {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ recipient_id: selectedContact.id, body: body.trim() }),
      })
      const payload = await response.json().catch(() => null)
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.error || "Could not send message.")
      }
      setMessages((previous) => [...previous, payload.data])
      setBody("")
    } catch (sendError) {
      setError(sendError instanceof Error ? sendError.message : "Could not send message.")
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="grid min-h-0 flex-1 gap-4 md:grid-cols-[240px_1fr]">
      <Card className="min-h-0">
        <CardHeader><CardTitle className="text-base">{contacts.length ? "Contacts" : "Available contacts"}</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {contacts.map((contact) => (
            <button
              key={contact.id}
              type="button"
              onClick={() => selectContact(contact)}
              className={`w-full rounded-lg border p-3 text-left text-sm ${selectedContact?.id === contact.id ? "border-primary bg-primary/10" : "border-border hover:bg-muted"}`}
            >
              <span className="block font-medium">{contact.name}</span>
              <span className="text-xs text-muted-foreground">{contact.email}</span>
            </button>
          ))}
          {!loading && !contacts.length && <p className="text-sm text-muted-foreground">No {currentUserId ? "opposite-role" : "available"} users have registered yet.</p>}
        </CardContent>
      </Card>

      <Card className="flex min-h-0 flex-col">
        <CardHeader className="border-b"><CardTitle className="flex items-center gap-2 text-base"><MessageSquare className="size-4" />{selectedContact ? `Conversation with ${selectedContact.name}` : "Patient communication"}</CardTitle></CardHeader>
        <CardContent className="flex min-h-0 flex-1 flex-col gap-4 p-5">
          <div className="min-h-0 flex-1 space-y-3 overflow-y-auto">
            {messages.map((message) => {
              const mine = message.sender_id === currentUserId
              return <div key={message.id} className={mine ? "ml-auto max-w-md rounded-lg bg-primary p-3 text-primary-foreground" : "max-w-md rounded-lg bg-muted p-3"}>{message.body}</div>
            })}
            {!loading && selectedContact && !messages.length && <p className="py-8 text-center text-sm text-muted-foreground">Start the conversation with {selectedContact.name}.</p>}
            {!loading && !selectedContact && <p className="py-8 text-center text-sm text-muted-foreground">A patient and pharmacist can message each other here.</p>}
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex gap-2">
            <input value={body} onChange={(event) => setBody(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); sendMessage() } }} disabled={!selectedContact || sending} placeholder={selectedContact ? "Write a message..." : "Select a contact"} className="flex-1 rounded-lg border px-3 py-2" />
            <Button onClick={sendMessage} disabled={!selectedContact || !body.trim() || sending}><Send data-icon="inline-start" />{sending ? "Sending..." : "Send"}</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
