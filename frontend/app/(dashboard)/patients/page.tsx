"use client"

import { useEffect, useState } from "react"
import { Users, Upload } from "lucide-react"
import Link from "next/link"

import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type PatientRecord = {
  name?: string
  date?: string
  hospital?: string
  diagnosis?: string
  medicines?: Array<{ name?: string }>
}

export default function PatientManagementPage() {
  const [patient, setPatient] = useState<PatientRecord | null>(null)

  useEffect(() => {
    try {
      const result = JSON.parse(localStorage.getItem("prescriptionResult") || "null")
      const ocr = result?.data?.ocr_result
      if (ocr) setPatient({ name: ocr.patient_name, date: ocr.date, hospital: ocr.hospital, diagnosis: ocr.diagnosis, medicines: ocr.medicines })
    } catch {
      setPatient(null)
    }
  }, [])

  return (
    <>
      <PageHeader title="Patient Management" description="Review patient information from analyzed prescriptions." />
      <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        {patient ? (
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Users className="size-5" />{patient.name || "Unnamed patient"}</CardTitle></CardHeader>
            <CardContent className="grid gap-3 text-sm sm:grid-cols-2">
              <p><span className="font-medium">Prescription date:</span> {patient.date || "Not detected"}</p>
              <p><span className="font-medium">Hospital:</span> {patient.hospital || "Not detected"}</p>
              <p><span className="font-medium">Diagnosis:</span> {patient.diagnosis || "Not detected"}</p>
              <p><span className="font-medium">Medicines:</span> {patient.medicines?.map((medicine) => medicine.name).filter(Boolean).join(", ") || "None detected"}</p>
            </CardContent>
          </Card>
        ) : (
          <Card><CardContent className="flex flex-col items-center gap-3 p-8 text-center"><Users className="size-8 text-muted-foreground" /><p className="text-sm text-muted-foreground">Upload a prescription to add a patient record.</p><Button nativeButton={false} render={<Link href="/upload" />}><Upload data-icon="inline-start" />Upload prescription</Button></CardContent></Card>
        )}
      </main>
    </>
  )
}
