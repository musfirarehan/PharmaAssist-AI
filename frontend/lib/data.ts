export type PrescriptionStatus = "analyzed" | "processing" | "review"

export type Prescription = {
  id: string
  patient: string
  initials: string
  doctor: string
  date: string
  medicines: number
  status: PrescriptionStatus
}

export type Medicine = {
  name: string
  purpose: string
  how_to_take: string
  food_interactions: string
  side_effects: {
  effect: string
  severity: string
}[]
  storage: string
  warnings: string
  dosage?: string
  frequency?: string
  duration?: string
  instructions?: string
}

export type Reminder = {
  id: string
  medicine: string
  dose: string
  time: string
  period: "Morning" | "Afternoon" | "Evening" | "Night"
  patient: string
  taken: boolean
  withFood: boolean
}

export const statusStyles: Record<
  PrescriptionStatus,
  { label: string; className: string }
> = {
  analyzed: {
    label: "Analyzed",
    className: "bg-accent text-accent-foreground border-transparent",
  },
  processing: {
    label: "Processing",
    className: "bg-secondary text-secondary-foreground border-transparent",
  },
  review: {
    label: "Needs Review",
    className:
      "bg-destructive/10 text-destructive border-transparent",
  },
}
