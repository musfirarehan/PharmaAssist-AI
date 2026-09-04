"use client"

import { useEffect, useState } from "react"
import { MessageSquareText } from "lucide-react"

import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type CounselingMedicine = {
  name?: string
  purpose?: string
  how_to_take?: string
  food_instructions?: string
  common_side_effects?: string[]
  counseling_points?: string[]
}

export default function PatientCounselingPage() {
  const [medicines, setMedicines] = useState<CounselingMedicine[]>([])

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
      <PageHeader title="AI Medication Counseling" description="Patient-friendly guidance from your analyzed prescription." actions={<Button onClick={() => window.location.href = "/chat"}><MessageSquareText data-icon="inline-start" />Ask the AI pharmacist</Button>} />
      <main className="flex flex-1 flex-col gap-4 p-4 md:p-6">
        {medicines.length ? medicines.map((medicine, index) => (
          <Card key={`${medicine.name}-${index}`}>
            <CardHeader><CardTitle className="text-base">{medicine.name || "Medicine"}</CardTitle></CardHeader>
            <CardContent className="grid gap-4 text-sm sm:grid-cols-2">
              <div><p className="font-medium">Purpose</p><p className="text-muted-foreground">{medicine.purpose || "Please confirm with your pharmacist or doctor."}</p></div>
              <div><p className="font-medium">How to take</p><p className="text-muted-foreground">{medicine.how_to_take || "Follow the prescription."}</p></div>
              <div><p className="font-medium">Food instructions</p><p className="text-muted-foreground">{medicine.food_instructions || "Please confirm with your pharmacist or doctor."}</p></div>
              <div><p className="font-medium">Common side effects</p><p className="text-muted-foreground">{medicine.common_side_effects?.join(", ") || "Please confirm with your pharmacist or doctor."}</p></div>
            </CardContent>
          </Card>
        )) : <Card><CardContent className="p-6 text-sm text-muted-foreground">Upload a prescription to generate medication counseling.</CardContent></Card>}
      </main>
    </>
  )
}