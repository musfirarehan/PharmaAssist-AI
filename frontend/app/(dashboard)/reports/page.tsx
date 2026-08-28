import { Download, FileBarChart2, ShieldCheck, Activity } from "lucide-react"

import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { OverviewChart } from "@/components/dashboard/overview-chart"
import { CategoryChart } from "@/components/reports/category-chart"
import { AdherenceChart } from "@/components/reports/adherence-chart"

const kpis = [
  {
    label: "Avg. analysis accuracy",
    value: "98.6%",
    icon: ShieldCheck,
  },
  {
    label: "Interactions prevented",
    value: "312",
    icon: Activity,
  },
  {
    label: "Reports generated",
    value: "1,047",
    icon: FileBarChart2,
  },
]

const reports = [
  {
    id: "RPT-4821",
    title: "Amelia Hughes — Full analysis",
    date: "Aug 2, 2026",
    meds: 4,
    risk: "Low",
    tone: "bg-accent text-accent-foreground",
  },
  {
    id: "RPT-4820",
    title: "Sofia Alvarez — Interaction review",
    date: "Aug 1, 2026",
    meds: 5,
    risk: "High",
    tone: "bg-destructive/10 text-destructive",
  },
  {
    id: "RPT-4818",
    title: "David Chen — Full analysis",
    date: "Aug 1, 2026",
    meds: 3,
    risk: "Moderate",
    tone: "bg-chart-4/15 text-chart-4",
  },
  {
    id: "RPT-4815",
    title: "Grace Miller — Refill assessment",
    date: "Jul 31, 2026",
    meds: 1,
    risk: "Low",
    tone: "bg-accent text-accent-foreground",
  },
]

export default function ReportsPage() {
  return (
    <>
      <PageHeader
        title="Reports"
        description="Prescription analysis reports and pharmacy performance insights."
        actions={
          <Button variant="outline">
            <Download data-icon="inline-start" />
            Export all
          </Button>
        }
      />
      <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {kpis.map((kpi) => (
            <Card key={kpi.label}>
              <CardContent className="flex items-center gap-4">
                <div className="flex size-11 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <kpi.icon className="size-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-semibold text-foreground">
                    {kpi.value}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {kpi.label}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <OverviewChart />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <CategoryChart />
          <AdherenceChart />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Analysis Reports</CardTitle>
            <CardDescription>
              Detailed AI reports generated from prescriptions
            </CardDescription>
          </CardHeader>
          <CardContent className="px-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-6">Report</TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                  <TableHead className="hidden sm:table-cell">
                    Medicines
                  </TableHead>
                  <TableHead>Risk</TableHead>
                  <TableHead className="pr-6 text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="pl-6">
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground">
                          {report.title}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {report.id}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden text-muted-foreground md:table-cell">
                      {report.date}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {report.meds}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`border-transparent font-medium ${report.tone}`}
                      >
                        {report.risk}
                      </Badge>
                    </TableCell>
                    <TableCell className="pr-6 text-right">
                      <Button variant="ghost" size="sm">
                        <Download data-icon="inline-start" />
                        PDF
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </>
  )
}
