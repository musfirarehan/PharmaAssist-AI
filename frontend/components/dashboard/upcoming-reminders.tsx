import Link from "next/link"
import { Clock, Check, Utensils } from "lucide-react"

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { reminders } from "@/lib/data"

export function UpcomingReminders() {
  const upcoming = reminders.slice(0, 5)
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Reminders</CardTitle>
        <CardDescription>Today&apos;s medication schedule</CardDescription>
        <CardAction>
          <Button variant="ghost" size="sm" render={<Link href="/reminders" />}>
            Manage
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {upcoming.map((reminder) => (
          <div
            key={reminder.id}
            className="flex items-center gap-3 rounded-xl border border-border bg-card p-3"
          >
            <div
              className={cn(
                "flex size-10 shrink-0 items-center justify-center rounded-lg",
                reminder.taken
                  ? "bg-accent text-accent-foreground"
                  : "bg-secondary text-secondary-foreground",
              )}
            >
              {reminder.taken ? (
                <Check className="size-5" />
              ) : (
                <Clock className="size-5" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">
                {reminder.medicine}
              </p>
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                {reminder.dose} &middot; {reminder.patient}
                {reminder.withFood ? (
                  <>
                    <Utensils className="size-3" />
                    <span className="sr-only">Take with food</span>
                  </>
                ) : null}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-foreground">
                {reminder.time}
              </p>
              <p className="text-xs text-muted-foreground">{reminder.period}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
