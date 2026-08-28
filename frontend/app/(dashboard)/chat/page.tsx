import { PageHeader } from "@/components/page-header"
import { PharmacistChat } from "@/components/chat/pharmacist-chat"

export default function ChatPage() {
  return (
    <div className="flex h-svh flex-col">
      <PageHeader
        title="AI Pharmacist"
        description="Ask questions about medicines, interactions, and patient guidance."
      />
      <main className="flex min-h-0 flex-1 flex-col p-4 md:p-6">
        <PharmacistChat />
      </main>
    </div>
  )
}
