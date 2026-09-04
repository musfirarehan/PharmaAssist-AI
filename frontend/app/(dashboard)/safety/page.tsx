"use client"

import { useEffect, useState } from "react"
import { AlertTriangle, ShieldCheck } from "lucide-react"

import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

 type MedicineSafety = { name?: string; serious_warnings?: string[]; counseling_points?: string[]; interaction?: string }

export default function SafetyCheckerPage() {
  const [medicines, setMedicines] = useState<MedicineSafety[]>([])

  useEffect(() => {
    try {
      const result = JSON.parse(localStorage.getItem("prescriptionResult") || "null")
      setMedicines(result?.data?.counseling?.medicines || [])
    } catch {
      setMedicines([])
    }
  }, [])

  const warnings = medicines.flatMap((medicine) => [...(medicine.serious_warnings || []), ...(medicine.counseling_points || [])].map((warning) => ({ medicine: medicine.name || "Medicine", warning })))

  return (
    <>
      <PageHeader title="Interaction & Safety Checker" description="Review safety warnings returned for the latest analyzed prescription." />
      <main className="flex flex-1 flex-col gap-5 p-4 md:p-6">
        <Card><CardContent className="flex items-center gap-3 p-5"><ShieldCheck className="size-6 text-primary" /><div><p className="font-semibold">{warnings.length ? `${warnings.length} safety items require review` : "No safety warnings returned"}</p><p className="text-sm text-muted-foreground">Only information from the analyzed prescription is shown.</p></div></CardContent></Card>
        {warnings.length ? warnings.map((item, index) => <Card key={`${item.medicine}-${index}`}><CardHeader><CardTitle className="flex items-center gap-2 text-base"><AlertTriangle className="size-5 text-destructive" />{item.medicine}</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground">{item.warning}</CardContent></Card>) : <Card><CardContent className="p-6 text-sm text-muted-foreground">Upload and analyze a prescription to review medication safety information.</CardContent></Card>}
      </main>
    </>
  )
}
