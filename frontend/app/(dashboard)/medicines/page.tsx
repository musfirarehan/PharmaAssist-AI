"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import {
  Download,
  MessageSquareText,
  FileText,
  User,
  Stethoscope,
} from "lucide-react"

import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MedicineCard } from "@/components/medicines/medicine-card"


export default function MedicinesPage() {

  const [medicines, setMedicines] = useState<any[]>([])
  const [patient, setPatient] = useState("Not detected")
  const [doctor, setDoctor] = useState("Not detected")
  const [hospital, setHospital] = useState("Not detected")


  useEffect(() => {

  const saved = localStorage.getItem(
    "prescriptionResult"
  )


  if (!saved) {
    console.log("No prescription found")
    return
  }


  const result = JSON.parse(saved)


  console.log(
    "FULL MEDICINES DATA:",
    JSON.stringify(result, null, 2)
  )


  const ocr =
    result?.data?.ocr_result


  const counseling =
    result?.data?.counseling


  console.log(
    "COUNSELING:",
    counseling
  )


  console.log(
    "MEDICINES ARRAY:",
    counseling?.medicines
  )


  setMedicines(
    counseling?.medicines || []
  )


  setPatient(
    ocr?.patient_name || "Not detected"
  )


  setDoctor(
    ocr?.doctor_name || "Not detected"
  )


  setHospital(
    ocr?.hospital || "Not detected"
  )


}, [])


  const summary = [
    {
      icon: FileText,
      label: "Hospital",
      value: hospital,
    },
    {
      icon: User,
      label: "Patient",
      value: patient,
    },
    {
      icon: Stethoscope,
      label: "Prescriber",
      value: doctor,
    },
  ]


  return (
    <>
      <PageHeader
        title="Medicine Details"
        description="AI-generated breakdown of every medicine in the prescription."
        actions={
          <>
            <Button variant="outline">
              <Download data-icon="inline-start" />
              Export summary
            </Button>


            <Link href="/chat">
              <Button>
                <MessageSquareText data-icon="inline-start" />
                Ask about these
              </Button>
            </Link>

          </>
        }
      />


      <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">


        <Card>

          <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex flex-wrap gap-6">

              {summary.map((item)=>(
                <div
                  key={item.label}
                  className="flex items-center gap-3"
                >

                  <div className="flex size-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">

                    <item.icon className="size-5"/>

                  </div>


                  <div className="flex flex-col">

                    <span className="text-xs text-muted-foreground">
                      {item.label}
                    </span>


                    <span className="text-sm font-medium">
                      {item.value}
                    </span>

                  </div>

                </div>
              ))}

            </div>


            <div className="rounded-lg bg-accent/50 px-4 py-2 text-sm font-medium">

              {medicines.length} medicines analyzed

            </div>


          </CardContent>

        </Card>



        <div className="flex flex-col gap-6">

          {
            medicines.length > 0
            ?
            medicines.map((medicine,index)=>(

              <MedicineCard
                key={index}
                medicine={medicine}
              />

            ))
            :
            <Card>
              <CardContent className="p-6 text-muted-foreground">
                No prescription data found. Upload a prescription first.
              </CardContent>
            </Card>
          }


        </div>


      </main>

    </>
  )
}