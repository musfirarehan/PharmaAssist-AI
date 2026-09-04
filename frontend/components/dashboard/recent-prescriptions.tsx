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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export function RecentPrescriptions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Prescriptions</CardTitle>
        <CardDescription>
          Latest prescriptions processed by the assistant
        </CardDescription>
        <CardAction>
          <Button
            nativeButton={false}
            variant="ghost"
            size="sm"
            render={<Link href="/medicines" />}
          >
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
            <TableRow>
              <TableCell colSpan={4} className="p-6 text-center text-sm text-muted-foreground">
                Upload a prescription to see analyzed records here.
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
