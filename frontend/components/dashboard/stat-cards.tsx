import {
  FileText,
  Pill,
  BellRing,
  ShieldAlert,
} from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"

const icons = {
  prescriptions: FileText,
  medicines: Pill,
  reminders: BellRing,
  interactions: ShieldAlert,
} as const

export function StatCards() {
  const stats = [
    { key: "prescriptions", label: "Prescriptions Analyzed", value: "0" },
    { key: "medicines", label: "Medicines Explained", value: "0" },
    { key: "reminders", label: "Active Reminders", value: "0" },
    { key: "interactions", label: "Interactions Flagged", value: "0" },
  ] as const

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = icons[stat.key as keyof typeof icons]
        return (
          <Card key={stat.key} className="overflow-hidden">
            <CardContent className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex size-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <Icon className="size-5" />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-2xl font-semibold tracking-tight text-foreground">
                  {stat.value}
                </span>
                <span className="text-sm text-muted-foreground">
                  {stat.label}
                </span>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
