import {
  FileText,
  Pill,
  BellRing,
  ShieldAlert,
  TrendingUp,
  TrendingDown,
} from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { stats } from "@/lib/data"

const icons = {
  prescriptions: FileText,
  medicines: Pill,
  reminders: BellRing,
  interactions: ShieldAlert,
} as const

export function StatCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = icons[stat.key as keyof typeof icons]
        const positive = stat.trend === "up"
        return (
          <Card key={stat.key} className="overflow-hidden">
            <CardContent className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex size-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <Icon className="size-5" />
                </div>
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium",
                    positive
                      ? "bg-accent text-accent-foreground"
                      : "bg-destructive/10 text-destructive",
                  )}
                >
                  {positive ? (
                    <TrendingUp className="size-3" />
                  ) : (
                    <TrendingDown className="size-3" />
                  )}
                  {stat.change}
                </span>
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
