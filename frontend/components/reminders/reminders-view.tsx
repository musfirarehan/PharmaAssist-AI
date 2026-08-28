"use client"

import { useMemo, useState } from "react"
import {
  Sunrise,
  Sun,
  Sunset,
  Moon,
  Check,
  Utensils,
  Pill,
  CheckCircle2,
} from "lucide-react"
import { toast } from "sonner"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { reminders as seedReminders, type Reminder } from "@/lib/data"

const periods = [
  { key: "Morning", icon: Sunrise, window: "6:00 - 11:59" },
  { key: "Afternoon", icon: Sun, window: "12:00 - 16:59" },
  { key: "Evening", icon: Sunset, window: "17:00 - 20:59" },
  { key: "Night", icon: Moon, window: "21:00 - 5:59" },
] as const

export function RemindersView() {
  const [items, setItems] = useState<Reminder[]>(seedReminders)

  const toggle = (id: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item
        const next = !item.taken
        toast[next ? "success" : "message"](
          next ? "Marked as taken" : "Marked as pending",
          { description: item.medicine },
        )
        return { ...item, taken: next }
      }),
    )
  }

  const { taken, total, percent } = useMemo(() => {
    const takenCount = items.filter((i) => i.taken).length
    return {
      taken: takenCount,
      total: items.length,
      percent: Math.round((takenCount / items.length) * 100),
    }
  }, [items])

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Today&apos;s adherence
                </p>
                <p className="text-2xl font-semibold text-foreground">
                  {taken} of {total} doses taken
                </p>
              </div>
              <div className="flex size-14 items-center justify-center rounded-full bg-accent text-lg font-semibold text-accent-foreground">
                {percent}%
              </div>
            </div>
            <Progress value={percent} />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex h-full flex-col justify-center gap-1">
            <p className="text-sm text-muted-foreground">Next dose</p>
            <p className="text-lg font-semibold text-foreground">
              Ibuprofen 400 mg
            </p>
            <p className="text-sm text-muted-foreground">
              13:00 &middot; Marcus Bennett
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {periods.map((period) => {
          const periodItems = items.filter((i) => i.period === period.key)
          if (periodItems.length === 0) return null
          const Icon = period.icon
          return (
            <div key={period.key} className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <Icon className="size-4" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-foreground">
                    {period.key}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {period.window}
                  </p>
                </div>
              </div>
              <div className="relative flex flex-col gap-3 border-l border-border pl-5">
                {periodItems.map((item) => (
                  <div key={item.id} className="relative">
                    <span
                      className={cn(
                        "absolute -left-[27px] top-4 size-3 rounded-full border-2 border-card",
                        item.taken ? "bg-chart-2" : "bg-muted-foreground/40",
                      )}
                    />
                    <Card
                      className={cn(
                        "transition-colors",
                        item.taken && "bg-accent/30",
                      )}
                    >
                      <CardContent className="flex items-center gap-3 py-4">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Pill className="size-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-foreground">
                            {item.medicine}
                          </p>
                          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            {item.time} &middot; {item.dose} &middot;{" "}
                            {item.patient}
                            {item.withFood ? (
                              <Utensils className="size-3" />
                            ) : null}
                          </p>
                        </div>
                        <Button
                          variant={item.taken ? "outline" : "default"}
                          size="sm"
                          onClick={() => toggle(item.id)}
                        >
                          {item.taken ? (
                            <>
                              <CheckCircle2 data-icon="inline-start" />
                              Taken
                            </>
                          ) : (
                            <>
                              <Check data-icon="inline-start" />
                              Mark taken
                            </>
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
