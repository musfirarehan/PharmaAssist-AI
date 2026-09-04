"use client"

import { useEffect, useState } from "react"
import { Download, FileBarChart2, ShieldCheck, Activity } from "lucide-react"

import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
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

type AnalysisResult = {
  data?: {
    ocr_result?: {
      medicines?: Array<{ name?: string }>
    }
    counseling?: {
      medicines?: Array<{
        name?: string
        category?: string
        serious_warnings?: string[]
      }>
    }
  }
}

export default function ReportsPage() {
  const [result, setResult] = useState<AnalysisResult | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem("prescriptionResult")
    if (!saved) return

    try {
      setResult(JSON.parse(saved))
    } catch {
      setResult(null)
    }
  }, [])

  const ocrMedicines = result?.data?.ocr_result?.medicines || []
  const counselingMedicines = result?.data?.counseling?.medicines || []
  const medicines = counselingMedicines.length ? counselingMedicines : ocrMedicines
  const interactions = counselingMedicines.filter(
    (medicine) => (medicine.serious_warnings || []).length > 0,
  ).length
  const categories = medicines.reduce<Record<string, number>>((counts, medicine) => {
    const category = "category" in medicine && medicine.category
      ? medicine.category
      : "Uncategorized"
    counts[category] = (counts[category] || 0) + 1
    return counts
  }, {})
  const categoryData = Object.entries(categories).map(([category, value], index) => ({
    category,
    value,
    fill: `var(--chart-${(index % 5) + 1})`,
  }))
  const activityData = result
    ? [{ month: "Current", prescriptions: 1, medicines: medicines.length }]
    : []
  const kpis = [
    { label: "Medicines analyzed", value: String(medicines.length), icon: FileBarChart2 },
    { label: "Warnings identified", value: String(interactions), icon: ShieldCheck },
    { label: "Reports generated", value: result ? "1" : "0", icon: Activity },
  ]

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
                  <span className="text-xl font-semibold text-foreground">{kpi.value}</span>
                  <span className="text-sm text-muted-foreground">{kpi.label}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <OverviewChart data={activityData} />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <CategoryChart data={categoryData} />
          <AdherenceChart data={[]} />
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
                {result ? (
                  <TableRow>
                    <TableCell className="pl-6">
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground">Current prescription analysis</span>
                        <span className="text-xs text-muted-foreground">Generated from the latest upload</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden text-muted-foreground md:table-cell">Latest upload</TableCell>
                    <TableCell className="hidden sm:table-cell">{medicines.length}</TableCell>
                    <TableCell>{interactions ? "Review" : "No warnings"}</TableCell>
                    <TableCell className="pr-6 text-right">
                      <Button variant="ghost" size="sm" onClick={() => window.print()}>
                        <Download data-icon="inline-start" />
                        Print
                      </Button>
                    </TableCell>
                  </TableRow>
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="p-6 text-center text-sm text-muted-foreground">
                      Upload a prescription to generate an analysis report.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </>
  )
}
