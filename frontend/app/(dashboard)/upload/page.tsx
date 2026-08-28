import { PageHeader } from "@/components/page-header"
import { PrescriptionUploader } from "@/components/upload/prescription-uploader"

export default function UploadPage() {
  return (
    <>
      <PageHeader
        title="Upload Prescription"
        description="Scan a prescription image to extract and analyze medicines with AI."
      />
      <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        <PrescriptionUploader />
      </main>
    </>
  )
}
