import Link from "next/link"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function UpcomingReminders() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Reminders</CardTitle>
        <CardDescription>Today&apos;s medication schedule</CardDescription>
        <CardAction>
          <Button
            nativeButton={false}
            variant="ghost"
            size="sm"
            render={<Link href="/reminders" />}
          >
            Manage
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <p className="p-3 text-sm text-muted-foreground">
          Upload a prescription to generate reminders from its analyzed medicines.
        </p>
      </CardContent>
    </Card>
  )
}
