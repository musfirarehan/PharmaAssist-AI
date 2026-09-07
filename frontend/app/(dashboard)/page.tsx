"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { MessageSquareText, Upload } from "lucide-react"

import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { StatCards } from "@/components/dashboard/stat-cards"
import { OverviewChart } from "@/components/dashboard/overview-chart"
import { RecentPrescriptions } from "@/components/dashboard/recent-prescriptions"
import { UpcomingReminders } from "@/components/dashboard/upcoming-reminders"

export default function DashboardPage() {
  const [greeting, setGreeting] = useState("Hello, Dr. Pharmacist")

  useEffect(() => {
    const savedProfile = localStorage.getItem("profile")
    if (!savedProfile) return

    try {
      const profile = JSON.parse(savedProfile)
      const name = profile.name?.trim() || profile.username?.trim()
      if (!name) return
      setGreeting(profile.role === "pharmacist" ? `Hello, Dr. ${name}` : `Hello, Mr./Ms. ${name}`)
    } catch {
      setGreeting("Hello, Dr. Pharmacist")
    }
  }, [])

  return (
    <>
      <PageHeader
        title={greeting}
        description="Here is what is happening across your pharmacy today."
        actions={
          <>
            <Button nativeButton={false} render={<Link href="/upload" />}>
              <Upload data-icon="inline-start" />
              Upload Prescription
            </Button>
            <Button
              nativeButton={false}
              variant="outline"
              render={<Link href="/chat" />}
            >
              <MessageSquareText data-icon="inline-start" />
              Patient Communication
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
