import Link from "next/link"
import { Upload, Sparkles } from "lucide-react"

import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { StatCards } from "@/components/dashboard/stat-cards"
import { OverviewChart } from "@/components/dashboard/overview-chart"
import { RecentPrescriptions } from "@/components/dashboard/recent-prescriptions"
import { UpcomingReminders } from "@/components/dashboard/upcoming-reminders"

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Good morning, Dr. Rossi"
        description="Here is what is happening across your pharmacy today."
        actions={
          <>
            <Button render={<Link href="/upload" />}>
              <Upload data-icon="inline-start" />
              Upload Prescription
            </Button>
            <Button variant="outline" render={<Link href="/chat" />}>
              <Sparkles data-icon="inline-start" />
              Ask AI Pharmacist
            </Button>
          </>
        }
      />
      <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        <StatCards />
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <OverviewChart />
          <UpcomingReminders />
        </div>
        <RecentPrescriptions />
      </main>
    </>
  )
}
