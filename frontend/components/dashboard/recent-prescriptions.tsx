import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { StatusBadge } from "@/components/status-badge"
import { prescriptions } from "@/lib/data"

export function RecentPrescriptions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Prescriptions</CardTitle>
        <CardDescription>
          Latest prescriptions processed by the assistant
        </CardDescription>
        <CardAction>
          <Button variant="ghost" size="sm" render={<Link href="/medicines" />}>
            View all
            <ArrowUpRight data-icon="inline-end" />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="px-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="pl-6">Patient</TableHead>
              <TableHead className="hidden md:table-cell">Prescriber</TableHead>
              <TableHead className="hidden sm:table-cell">Meds</TableHead>
              <TableHead className="pr-6 text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {prescriptions.map((rx) => (
              <TableRow key={rx.id}>
                <TableCell className="pl-6">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-9">
                      <AvatarFallback className="bg-accent text-xs text-accent-foreground">
                        {rx.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground">
                        {rx.patient}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {rx.id} &middot; {rx.date}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden text-muted-foreground md:table-cell">
                  {rx.doctor}
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  {rx.medicines}
                </TableCell>
                <TableCell className="pr-6 text-right">
                  <StatusBadge status={rx.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
