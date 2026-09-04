"use client"

import { useEffect, useState } from "react"
import { ShieldAlert } from "lucide-react"

import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type SafetyMedicine = { name?: string; serious_warnings?: string[]; counseling_points?: string[] }

export default function PatientSafetyPage() {
  const [medicines, setMedicines] = useState<SafetyMedicine[]>([])

  useEffect(() => {
    try {
      const result = JSON.parse(localStorage.getItem("prescriptionResult") || "null")
      setMedicines(result?.data?.counseling?.medicines || [])
    } catch {
      setMedicines([])
    }
  }, [])

  return (
    <>
      <PageHeader title="Medication Safety" description="Safety warnings from your analyzed medicines." />
      <main className="flex flex-1 flex-col gap-4 p-4 md:p-6">
        {medicines.length ? medicines.map((medicine, index) => {
          const warnings = [...(medicine.serious_warnings || []), ...(medicine.counseling_points || [])]
          return <Card key={`${medicine.name}-${index}`}><CardHeader><CardTitle className="flex items-center gap-2 text-base"><ShieldAlert className="size-5 text-destructive" />{medicine.name || "Medicine"}</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground">{warnings.length ? <ul className="list-disc space-y-2 pl-5">{warnings.map((warning, warningIndex) => <li key={warningIndex}>{warning}</li>)}</ul> : "No safety warnings were returned for this medicine."}</CardContent></Card>
        }) : <Card><CardContent className="p-6 text-sm text-muted-foreground">Upload a prescription to view medication safety information.</CardContent></Card>}
      </main>
    </>
  )
}