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

export const stats = [
  {
    key: "prescriptions",
    label: "Prescriptions Analyzed",
    value: "1,284",
    change: "+12.5%",
    trend: "up" as const,
    hint: "vs last month",
  },
  {
    key: "medicines",
    label: "Medicines Explained",
    value: "3,942",
    change: "+8.2%",
    trend: "up" as const,
    hint: "vs last month",
  },
  {
    key: "reminders",
    label: "Active Reminders",
    value: "512",
    change: "+3.1%",
    trend: "up" as const,
    hint: "vs last month",
  },
  {
    key: "interactions",
    label: "Interactions Flagged",
    value: "47",
    change: "-5.4%",
    trend: "down" as const,
    hint: "vs last month",
  },
]

export const prescriptions: Prescription[] = [
  {
    id: "RX-20841",
    patient: "Amelia Hughes",
    initials: "AH",
    doctor: "Dr. Priya Nair",
    date: "Aug 2, 2026",
    medicines: 4,
    status: "analyzed",
  },
  {
    id: "RX-20840",
    patient: "Marcus Bennett",
    initials: "MB",
    doctor: "Dr. Liam Carter",
    date: "Aug 2, 2026",
    medicines: 2,
    status: "processing",
  },
  {
    id: "RX-20838",
    patient: "Sofia Alvarez",
    initials: "SA",
    doctor: "Dr. Priya Nair",
    date: "Aug 1, 2026",
    medicines: 5,
    status: "review",
  },
  {
    id: "RX-20835",
    patient: "David Chen",
    initials: "DC",
    doctor: "Dr. Noah Willis",
    date: "Aug 1, 2026",
    medicines: 3,
    status: "analyzed",
  },
  {
    id: "RX-20833",
    patient: "Grace Miller",
    initials: "GM",
    doctor: "Dr. Liam Carter",
    date: "Jul 31, 2026",
    medicines: 1,
    status: "analyzed",
  },
]

export const medicines: Medicine[] = [
  {
    id: "med-1",
    name: "Amoxicillin",
    generic: "Amoxicillin trihydrate",
    strength: "500 mg",
    form: "Capsule",
    dosage: "1 capsule",
    frequency: "3 times daily",
    duration: "7 days",
    quantity: "21 capsules",
    purpose: "Bacterial infection",
    explanation:
      "Amoxicillin is a penicillin-type antibiotic used to treat a wide range of bacterial infections. It works by stopping the growth of bacteria. Take it at evenly spaced intervals and complete the full course even if symptoms improve.",
    warnings: [
      "Do not use if allergic to penicillin antibiotics.",
      "May reduce effectiveness of oral contraceptives.",
    ],
    sideEffects: ["Nausea", "Diarrhea", "Skin rash", "Headache"],
    interaction: "low",
  },
  {
    id: "med-2",
    name: "Metformin",
    generic: "Metformin hydrochloride",
    strength: "850 mg",
    form: "Tablet",
    dosage: "1 tablet",
    frequency: "2 times daily",
    duration: "Ongoing",
    quantity: "60 tablets",
    purpose: "Type 2 diabetes",
    explanation:
      "Metformin helps control blood sugar levels in type 2 diabetes by improving the body's response to insulin. Take with meals to reduce stomach upset. Regular monitoring of blood glucose is recommended.",
    warnings: [
      "Avoid excessive alcohol while taking this medication.",
      "Report persistent muscle pain or unusual tiredness to a doctor.",
    ],
    sideEffects: ["Stomach upset", "Metallic taste", "Loss of appetite"],
    interaction: "moderate",
  },
  {
    id: "med-3",
    name: "Atorvastatin",
    generic: "Atorvastatin calcium",
    strength: "20 mg",
    form: "Tablet",
    dosage: "1 tablet",
    frequency: "Once daily",
    duration: "Ongoing",
    quantity: "30 tablets",
    purpose: "High cholesterol",
    explanation:
      "Atorvastatin lowers LDL cholesterol and triglycerides while raising HDL cholesterol, reducing the risk of heart disease. It is typically taken in the evening. Combine with a healthy diet for best results.",
    warnings: [
      "Avoid grapefruit juice, which can increase side effects.",
      "May interact with metformin — monitor for muscle symptoms.",
    ],
    sideEffects: ["Muscle aches", "Joint pain", "Nausea"],
    interaction: "moderate",
  },
  {
    id: "med-4",
    name: "Ibuprofen",
    generic: "Ibuprofen",
    strength: "400 mg",
    form: "Tablet",
    dosage: "1 tablet",
    frequency: "As needed",
    duration: "Max 5 days",
    quantity: "20 tablets",
    purpose: "Pain & inflammation",
    explanation:
      "Ibuprofen is a nonsteroidal anti-inflammatory drug (NSAID) used to relieve pain, reduce inflammation, and lower fever. Take with food or milk to protect the stomach and use the lowest effective dose.",
    warnings: [
      "Do not combine with other NSAIDs.",
      "Use caution with a history of stomach ulcers or kidney issues.",
    ],
    sideEffects: ["Stomach pain", "Heartburn", "Dizziness"],
    interaction: "high",
  },
]

export const reminders: Reminder[] = [
  {
    id: "rem-1",
    medicine: "Metformin 850 mg",
    dose: "1 tablet",
    time: "08:00",
    period: "Morning",
    patient: "Amelia Hughes",
    taken: true,
    withFood: true,
  },
  {
    id: "rem-2",
    medicine: "Amoxicillin 500 mg",
    dose: "1 capsule",
    time: "08:30",
    period: "Morning",
    patient: "Amelia Hughes",
    taken: true,
    withFood: false,
  },
  {
    id: "rem-3",
    medicine: "Ibuprofen 400 mg",
    dose: "1 tablet",
    time: "13:00",
    period: "Afternoon",
    patient: "Marcus Bennett",
    taken: false,
    withFood: true,
  },
  {
    id: "rem-4",
    medicine: "Amoxicillin 500 mg",
    dose: "1 capsule",
    time: "16:00",
    period: "Afternoon",
    patient: "Amelia Hughes",
    taken: false,
    withFood: false,
  },
  {
    id: "rem-5",
    medicine: "Atorvastatin 20 mg",
    dose: "1 tablet",
    time: "21:00",
    period: "Night",
    patient: "Sofia Alvarez",
    taken: false,
    withFood: false,
  },
  {
    id: "rem-6",
    medicine: "Amoxicillin 500 mg",
    dose: "1 capsule",
    time: "22:00",
    period: "Night",
    patient: "Amelia Hughes",
    taken: false,
    withFood: false,
  },
]

export const prescriptionTrend = [
  { month: "Feb", prescriptions: 620, medicines: 1840 },
  { month: "Mar", prescriptions: 710, medicines: 2110 },
  { month: "Apr", prescriptions: 780, medicines: 2360 },
  { month: "May", prescriptions: 690, medicines: 2050 },
  { month: "Jun", prescriptions: 940, medicines: 2820 },
  { month: "Jul", prescriptions: 1080, medicines: 3240 },
  { month: "Aug", prescriptions: 1284, medicines: 3942 },
]

export const categoryBreakdown = [
  { category: "Antibiotics", value: 34, fill: "var(--color-antibiotics)" },
  { category: "Cardiovascular", value: 26, fill: "var(--color-cardiovascular)" },
  { category: "Diabetes", value: 18, fill: "var(--color-diabetes)" },
  { category: "Pain Relief", value: 14, fill: "var(--color-pain)" },
  { category: "Other", value: 8, fill: "var(--color-other)" },
]

export const adherenceData = [
  { day: "Mon", adherence: 92 },
  { day: "Tue", adherence: 88 },
  { day: "Wed", adherence: 95 },
  { day: "Thu", adherence: 90 },
  { day: "Fri", adherence: 84 },
  { day: "Sat", adherence: 78 },
  { day: "Sun", adherence: 86 },
]

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
