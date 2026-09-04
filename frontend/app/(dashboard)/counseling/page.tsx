"use client"

import { useEffect, useState } from "react"
import { Check, RefreshCw, Send } from "lucide-react"

import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { buildApiUrl } from "@/lib/api"

type CounselingMedicine = {
  name?: string
  purpose?: string
  how_to_take?: string
  food_instructions?: string
  common_side_effects?: string[]
  serious_warnings?: string[]
  counseling_points?: string[]
}

function loadMedicines() {
  try {
    const result = JSON.parse(localStorage.getItem("prescriptionResult") || "null")
    return result?.data?.counseling?.medicines || []
  } catch {
    return []
  }
}

export default function CounselingReviewPage() {
  const [medicines, setMedicines] = useState<CounselingMedicine[]>([])
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => setMedicines(loadMedicines()), [])

  const generate = async () => {
    setLoading(true)
    try {
      const result = JSON.parse(localStorage.getItem("prescriptionResult") || "null")
      const source = result?.data?.ocr_result?.medicines || []
      const response = await fetch(buildApiUrl("/v1/counsel"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(source),
      })
      const payload = await response.json().catch(() => null)
      if (!response.ok || !payload?.success) throw new Error(payload?.error || "Counseling generation failed")
      setMedicines(payload.data.medicines || [])
      setSaved(false)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const update = (index: number, field: keyof CounselingMedicine, value: string | string[]) => {
    setMedicines((current) => current.map((medicine, medicineIndex) => medicineIndex === index ? { ...medicine, [field]: value } : medicine))
    setSaved(false)
  }

  const saveReviewed = () => {
    try {
      const result = JSON.parse(localStorage.getItem("prescriptionResult") || "{}")
      localStorage.setItem("prescriptionResult", JSON.stringify({ ...result, data: { ...result.data, counseling: { ...result.data?.counseling, medicines } } }))
      setSaved(true)
    } catch {
      setSaved(false)
    }
  }

  return (
    <>
      <PageHeader title="AI-Assisted Counseling" description="Generate counseling, review every field, and approve it before sharing." actions={<Button onClick={generate} disabled={loading}><RefreshCw data-icon="inline-start" />{loading ? "Generating..." : "Generate counseling"}</Button>} />
      <main className="flex flex-1 flex-col gap-5 p-4 md:p-6">
        {medicines.length ? medicines.map((medicine, index) => <Card key={`${medicine.name}-${index}`}><CardHeader><CardTitle className="text-base">{medicine.name || "Medicine"}</CardTitle></CardHeader><CardContent className="grid gap-4 sm:grid-cols-2"><label className="grid gap-2 text-sm font-medium">Purpose<Textarea value={medicine.purpose || ""} onChange={(event) => update(index, "purpose", event.target.value)} /></label><label className="grid gap-2 text-sm font-medium">How to take<Textarea value={medicine.how_to_take || ""} onChange={(event) => update(index, "how_to_take", event.target.value)} /></label><label className="grid gap-2 text-sm font-medium">Food instructions<Textarea value={medicine.food_instructions || ""} onChange={(event) => update(index, "food_instructions", event.target.value)} /></label><label className="grid gap-2 text-sm font-medium">Safety warnings<Textarea value={[...(medicine.serious_warnings || []), ...(medicine.counseling_points || [])].join("\n")} onChange={(event) => update(index, "counseling_points", event.target.value.split("\n").filter(Boolean))} /></label></CardContent></Card>) : <Card><CardContent className="p-6 text-sm text-muted-foreground">Upload a prescription before generating counseling.</CardContent></Card>}
        {medicines.length ? <div className="flex flex-wrap items-center gap-3"><Button onClick={saveReviewed}><Check data-icon="inline-start" />Save reviewed summary</Button><Button variant="outline" onClick={() => { saveReviewed(); localStorage.setItem("counselingShared", "true") }}><Send data-icon="inline-start" />Share with patient</Button>{saved ? <span className="text-sm text-muted-foreground">Reviewed version saved.</span> : null}</div> : null}
      </main>
    </>
  )
}
