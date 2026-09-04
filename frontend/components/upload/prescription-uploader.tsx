"use client"

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import {
  UploadCloud,
  FileImage,
  X,
  ScanLine,
  CheckCircle2,
  Loader2,
  Sparkles,
  ShieldCheck,
} from "lucide-react"

import { toast } from "sonner"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { buildApiUrl } from "@/lib/api"
import { cn } from "@/lib/utils"


type Stage =
  | "idle"
  | "uploading"
  | "processing"
  | "done"
  | "error"


export function PrescriptionUploader() {

  const router = useRouter()

  const [stage,setStage] =
    useState<Stage>("idle")

  const [fileName,setFileName] =
    useState<string | null>(null)

  const [dragging,setDragging] =
    useState(false)

  const [result,setResult] =
    useState<any>(null)

  const inputRef =
    useRef<HTMLInputElement>(null)



  const reset = ()=>{

    setStage("idle")
    setFileName(null)
    setResult(null)

  }



  const uploadPrescription =
    async(file:File)=>{

    try{

      setFileName(file.name)

      setStage("uploading")


      const formData =
        new FormData()


      formData.append(
        "file",
        file
      )


      setStage("processing")


      const response = await fetch(buildApiUrl("/v1/upload-prescription"), {
        method: "POST",
        body: formData,
      })

      const data = await response.json().catch(() => null)

      if (!response.ok || !data || data.success === false) {
        const message =
          data?.message || data?.error || "Failed to process prescription"
        throw new Error(message)
      }

      localStorage.setItem("prescriptionResult", JSON.stringify(data))

      const ocrMedicines = data?.data?.ocr_result?.medicines || []
      const profile = JSON.parse(localStorage.getItem("profile") || "null")
      const reminderKey = `reminders:${profile?.id || "current"}:${JSON.stringify(ocrMedicines)}`
      if (ocrMedicines.length && !localStorage.getItem(reminderKey)) {
        const reminderResponse = await fetch(buildApiUrl("/v1/reminders/schedules"), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(localStorage.getItem("authToken")
              ? { Authorization: `Bearer ${localStorage.getItem("authToken")}` }
              : {}),
          },
          body: JSON.stringify({ medicines: ocrMedicines }),
        })
        if (reminderResponse.ok) localStorage.setItem(reminderKey, "created")
      }

      setResult(data)
      setStage("done")

      const medicineCount = data?.data?.ocr_result?.medicines?.length ?? 0

      toast.success("Prescription analyzed", {
        description: `${medicineCount} medicines detected`,
      })


    }
    catch(error){

      console.error(error)

      setStage("error")


      const message = error instanceof Error ? error.message : "Unable to analyze prescription"

      toast.error("Processing failed", {
        description: message,
      })

    }

  }



  const handleFile =
    (files:FileList|null)=>{

      if(!files || files.length===0)
        return


      const file =
        files[0]


      if(!file.type.startsWith("image/")){

        toast.error(
          "Invalid file",
          {
            description:
            "Please upload PNG/JPG image"
          }
        )

        return
      }


      uploadPrescription(file)

    }



  return (

<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">


<Card className="lg:col-span-2">

<CardContent>


{
stage==="idle" && (

<div
className={cn(
"flex min-h-[340px] cursor-pointer flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed p-8 text-center",
dragging &&
"border-primary bg-accent/40"
)}

onClick={()=>
inputRef.current?.click()
}


onDragOver={(e)=>{
e.preventDefault()
setDragging(true)
}}


onDragLeave={()=>
setDragging(false)
}


onDrop={(e)=>{

e.preventDefault()

setDragging(false)

handleFile(
e.dataTransfer.files
)

}}

>


<div className="flex size-16 items-center justify-center rounded-2xl bg-accent">

<UploadCloud className="size-8"/>

</div>


<p className="font-medium">

Upload prescription image

</p>


<p className="text-sm text-muted-foreground">

PNG or JPG up to 10MB

</p>


<Button>

<FileImage/>

Select Image

</Button>


<input
ref={inputRef}
type="file"
accept="image/*"
hidden
onChange={(e)=>
handleFile(e.target.files)
}
/>


</div>

)

}



{
stage!=="idle" && (

<div className="flex min-h-[340px] flex-col gap-5">


<div className="flex items-center gap-3 border rounded-xl p-3">

<FileImage/>

<div className="flex-1">

<p className="font-medium">

{fileName}

</p>


<p className="text-sm text-muted-foreground">

{
stage==="uploading"
?
"Uploading..."
:
stage==="processing"
?
"Running OCR and AI analysis..."
:
"Completed"
}

</p>


</div>


<Button
variant="ghost"
size="icon"
onClick={reset}
>

<X/>

</Button>


</div>



{
stage==="processing" && (

<div className="flex justify-center py-10">

<Loader2 className="animate-spin size-10"/>

</div>

)

}



{
stage==="done" && (

<div className="rounded-xl bg-accent p-5">


<div className="flex items-center gap-3">

<CheckCircle2/>

<div>

<p className="font-medium">

{
result.data.ocr_result.medicines.length
}
 medicines detected

</p>


<p className="text-sm">

AI counseling generated successfully

</p>


</div>


</div>



<Button
  className="mt-4"
  onClick={() => router.push(localStorage.getItem("portal") === "patient" ? "/patient" : "/medicines")}
>

<Sparkles/>

View Results

</Button>


</div>

)

}



</div>

)

}



</CardContent>

</Card>




<Card>

<CardContent className="space-y-5">


<div className="flex gap-2 items-center">

<ShieldCheck/>

<h2 className="font-semibold">

Best Results

</h2>

</div>


<ul className="space-y-3 text-sm">

<li>
1. Capture clear prescription image
</li>

<li>
2. Avoid shadows and blur
</li>

<li>
3. Upload complete prescription
</li>

<li>
4. Verify AI results with pharmacist
</li>

</ul>


<Separator/>


<p className="text-sm text-muted-foreground">

AI assisted counseling. Always verify critical medical decisions.

</p>


</CardContent>

</Card>


</div>

)

}