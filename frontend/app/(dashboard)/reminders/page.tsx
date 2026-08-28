import { Plus } from "lucide-react"

import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { RemindersView } from "@/components/reminders/reminders-view"

export default function RemindersPage() {
  return (
    <>
      <PageHeader
        title="Reminders"
        description="Daily medication timeline and schedule across your patients."
        actions={
          <Button>
            <Plus data-icon="inline-start" />
            New reminder
          </Button>
        }
      />
      <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        <RemindersView />
      </main>
    </>
  )
}
