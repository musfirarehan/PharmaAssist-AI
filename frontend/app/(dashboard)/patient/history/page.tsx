"use client"

import { useEffect, useState } from "react"
import { FileText } from "lucide-react"

import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type HistoryResult = { data?: { ocr_result?: { patient_name?: string; date?: string; hospital?: string; medicines?: Array<{ name?: string }> } } }

export default function PatientHistoryPage() {
  const [result, setResult] = useState<HistoryResult | null>(null)

  useEffect(() => {
    try { setResult(JSON.parse(localStorage.getItem("prescriptionResult") || "null")) } catch { setResult(null) }
  }, [])

  const prescription = result?.data?.ocr_result
  return (
    <>
      <PageHeader title="Prescription History" description="Your analyzed prescription records." />
      <main className="flex flex-1 flex-col gap-4 p-4 md:p-6">
        {prescription ? <Card><CardHeader><CardTitle className="flex items-center gap-2 text-base"><FileText className="size-5" />Latest prescription</CardTitle></CardHeader><CardContent className="grid gap-3 text-sm sm:grid-cols-2"><p><span className="font-medium">Date:</span> {prescription.date || "Not detected"}</p><p><span className="font-medium">Hospital:</span> {prescription.hospital || "Not detected"}</p><p><span className="font-medium">Patient:</span> {prescription.patient_name || "Not detected"}</p><p><span className="font-medium">Medicines:</span> {prescription.medicines?.map((medicine) => medicine.name).filter(Boolean).join(", ") || "None detected"}</p></CardContent></Card> : <Card><CardContent className="p-6 text-sm text-muted-foreground">No prescription history is available yet.</CardContent></Card>}
      </main>
    </>
  )
}