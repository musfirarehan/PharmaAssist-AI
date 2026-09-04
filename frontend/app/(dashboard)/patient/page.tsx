"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { MessageSquareText, Pill, Upload } from "lucide-react"

import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Medicine = {
  name?: string
  active_ingredient?: string
  purpose?: string
  how_to_take?: string
  dosage?: string
  frequency?: string
}

export default function PatientPortalPage() {
  const [medicines, setMedicines] = useState<Medicine[]>([])

  useEffect(() => {
    const saved = localStorage.getItem("prescriptionResult")
    if (!saved) return

    try {
      const result = JSON.parse(saved)
      setMedicines(result?.data?.counseling?.medicines || [])
    } catch {
      setMedicines([])
    }
  }, [])

  return (
    <>
      <PageHeader
        title="My Medicines"
        description="Your patient-friendly prescription summary."
        actions={
          <Button nativeButton={false} render={<Link href="/chat" />}>
            <MessageSquareText data-icon="inline-start" />
            Ask a pharmacist
          </Button>
        }
      />
      <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        {medicines.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center gap-3 p-8 text-center">
              <Pill className="size-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                No analyzed prescription is available yet.
              </p>
              <Button nativeButton={false} render={<Link href="/upload" />}>
                <Upload data-icon="inline-start" />
                Upload prescription
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {medicines.map((medicine, index) => (
              <Card key={`${medicine.name}-${index}`}>
                <CardHeader>
                  <CardTitle className="text-base">{medicine.name || "Medicine"}</CardTitle>
                  {medicine.active_ingredient ? (
                    <p className="text-sm text-muted-foreground">{medicine.active_ingredient}</p>
                  ) : null}
                </CardHeader>
                <CardContent className="flex flex-col gap-3 text-sm">
                  <div>
                    <p className="font-medium text-foreground">Why it was prescribed</p>
                    <p className="text-muted-foreground">{medicine.purpose || "Please confirm with your pharmacist or doctor."}</p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">How to take it</p>
                    <p className="text-muted-foreground">{medicine.how_to_take || [medicine.dosage, medicine.frequency].filter(Boolean).join(" · ") || "Follow your prescription."}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </>
  )
}