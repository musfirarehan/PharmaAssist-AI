import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { statusStyles, type PrescriptionStatus } from "@/lib/data"

export function StatusBadge({ status }: { status: PrescriptionStatus }) {
  const config = statusStyles[status]
  return (
    <Badge variant="outline" className={cn("font-medium", config.className)}>
      {config.label}
    </Badge>
  )
}
