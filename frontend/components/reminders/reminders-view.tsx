"use client"

import { useEffect, useMemo, useState } from "react"
import { Check, CheckCircle2, Clock, Pill, ShieldAlert, SkipForward, Utensils } from "lucide-react"
import { toast } from "sonner"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { buildApiUrl } from "@/lib/api"
import { cn } from "@/lib/utils"

type Dose = {
  id: number
  medicine: string
  dose: string
  scheduled_time: string
  food_instructions: string
  status: "upcoming" | "due" | "taken" | "snoozed" | "skipped" | "missed"
  actual_time?: string
  snoozed_until?: string
}

type PendingSchedule = {
  id: number
  medicine: string
  dose: string
  frequency: string
  duration: string
  food_instructions: string
  times: string[]
}

function authHeaders() {
  const token = localStorage.getItem("authToken")
  return token ? { Authorization: `Bearer ${token}` } : {}
}

function formatTime(value: string) {
  const match = value.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i)
  if (!match) return value
  const hour = Number(match[1])
  const minute = match[2]
  const suffix = match[3]
  return suffix ? `${hour}:${minute} ${suffix.toUpperCase()}` : value
}

function displayDoseTime(item: Dose) {
  if (item.status === "snoozed" && item.snoozed_until) {
    return formatTime(item.snoozed_until.slice(11, 16))
  }
  return formatTime(item.scheduled_time)
}

export function RemindersView() {
  const [items, setItems] = useState<Dose[]>([])
  const [pending, setPending] = useState<PendingSchedule[]>([])
  const [adherence, setAdherence] = useState({ total: 0, taken: 0, missed: 0, percent: 0 })
  const [loading, setLoading] = useState(true)
  const [role, setRole] = useState("patient")

  const load = async () => {
    setLoading(true)
    try {
      const profile = JSON.parse(localStorage.getItem("profile") || "null")
      setRole(profile?.role || "patient")
      const headers = authHeaders()
      const result = JSON.parse(localStorage.getItem("prescriptionResult") || "null")
      const ocrMedicines = result?.data?.ocr_result?.medicines || []
      const prescriptionKey = JSON.stringify(ocrMedicines)
      const initializedKey = `reminders:${profile?.id || "current"}:${prescriptionKey}`

      if (ocrMedicines.length && !localStorage.getItem(initializedKey)) {
        const response = await fetch(buildApiUrl("/v1/reminders/schedules"), {
          method: "POST",
          headers: { ...headers, "Content-Type": "application/json" },
          body: JSON.stringify({ medicines: ocrMedicines }),
        })
        const payload = await response.json().catch(() => null)
        if (response.ok && payload?.success) localStorage.setItem(initializedKey, "created")
      }

      const [todayResponse, adherenceResponse] = await Promise.all([
        fetch(buildApiUrl("/v1/reminders/today"), { headers }),
        fetch(buildApiUrl("/v1/reminders/adherence"), { headers }),
      ])
      const today = await todayResponse.json().catch(() => null)
      const adherencePayload = await adherenceResponse.json().catch(() => null)
      setItems(today?.data || [])
      setAdherence(adherencePayload?.data || { total: 0, taken: 0, missed: 0, percent: 0 })

      if ((profile?.role || "patient") === "pharmacist") {
        const pendingResponse = await fetch(buildApiUrl("/v1/reminders/pending"), { headers })
        const pendingPayload = await pendingResponse.json().catch(() => null)
        setPending(pendingPayload?.data || [])
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const act = async (id: number, action: "taken" | "snooze" | "skip") => {
    try {
      const response = await fetch(buildApiUrl(`/v1/reminders/doses/${id}`), {
        method: "PATCH",
        headers: { ...authHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      })
      const payload = await response.json().catch(() => null)
      if (!response.ok || !payload?.success) throw new Error(payload?.error || "Could not update dose")
      setItems((current) => current.map((item) => item.id === id ? payload.data : item))
      toast.success(action === "taken" ? "Dose marked as taken" : action === "snooze" ? "Dose snoozed for 10 minutes" : "Dose skipped")
      await load()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update dose")
    }
  }

  const verify = async (schedule: PendingSchedule, approved: boolean) => {
    try {
      const response = await fetch(buildApiUrl(`/v1/reminders/schedules/${schedule.id}/verify?approved=${approved}`), {
        method: "PATCH",
        headers: { ...authHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({ medicine: schedule.medicine, dose: schedule.dose, frequency: schedule.frequency, duration: schedule.duration, times: schedule.times, food_instructions: schedule.food_instructions }),
      })
      const payload = await response.json().catch(() => null)
      if (!response.ok || !payload?.success) throw new Error(payload?.error || "Could not review schedule")
      toast.success(approved ? "Schedule approved" : "Schedule rejected")
      await load()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not review schedule")
    }
  }

  const dueDose = items.find((item) => item.status === "due")
  const upcomingDose = items.find((item) => item.status === "upcoming" || item.status === "snoozed")
  const { taken, total, percent } = useMemo(() => ({ taken: adherence.taken, total: adherence.total, percent: adherence.percent }), [adherence])

  return (
    <div className="flex flex-col gap-6">
      {role === "pharmacist" && pending.length > 0 ? <Card><CardHeader><CardTitle>Schedules awaiting verification</CardTitle></CardHeader><CardContent className="flex flex-col gap-3">{pending.map((schedule) => <div key={schedule.id} className="grid gap-3 rounded-lg border p-4 sm:grid-cols-2"><Input aria-label="Medicine" value={schedule.medicine} onChange={(event) => setPending((current) => current.map((item) => item.id === schedule.id ? { ...item, medicine: event.target.value } : item))} /><Input aria-label="Dose" value={schedule.dose} onChange={(event) => setPending((current) => current.map((item) => item.id === schedule.id ? { ...item, dose: event.target.value } : item))} /><Input aria-label="Frequency" value={schedule.frequency} onChange={(event) => setPending((current) => current.map((item) => item.id === schedule.id ? { ...item, frequency: event.target.value } : item))} /><Input aria-label="Duration" value={schedule.duration} onChange={(event) => setPending((current) => current.map((item) => item.id === schedule.id ? { ...item, duration: event.target.value } : item))} /><Input className="sm:col-span-2" aria-label="Scheduled times" value={schedule.times.join(", ")} onChange={(event) => setPending((current) => current.map((item) => item.id === schedule.id ? { ...item, times: event.target.value.split(",").map((time) => time.trim()).filter(Boolean) } : item))} /><Input className="sm:col-span-2" aria-label="Food instructions" value={schedule.food_instructions} onChange={(event) => setPending((current) => current.map((item) => item.id === schedule.id ? { ...item, food_instructions: event.target.value } : item))} /><div className="flex gap-2 sm:col-span-2"><Button size="sm" onClick={() => verify(schedule, true)}><Check data-icon="inline-start" />Approve</Button><Button size="sm" variant="outline" onClick={() => verify(schedule, false)}>Reject</Button></div></div>)}</CardContent></Card> : null}

      {dueDose ? <Card className="border-primary bg-accent/30"><CardContent className="flex flex-col gap-3 p-5"><p className="text-sm font-medium text-primary">Time to take your medicine</p><p className="text-lg font-semibold">{dueDose.medicine} — {dueDose.dose}</p><p className="text-sm text-muted-foreground">{dueDose.food_instructions || "Follow the prescription instructions."}</p><div className="flex flex-wrap gap-2"><Button onClick={() => act(dueDose.id, "taken")}><Check data-icon="inline-start" />Taken</Button><Button variant="outline" onClick={() => act(dueDose.id, "snooze")}><Clock data-icon="inline-start" />Snooze 10 min</Button><Button variant="outline" onClick={() => act(dueDose.id, "skip")}><SkipForward data-icon="inline-start" />Skip</Button></div></CardContent></Card> : null}
      {!dueDose && upcomingDose ? <Card className="border-primary/50 bg-accent/20"><CardContent className="flex flex-col gap-1 p-5"><p className="text-sm font-medium text-primary">Upcoming medication</p><p className="text-lg font-semibold">{upcomingDose.medicine}</p><p className="text-sm">{upcomingDose.dose}</p><p className="text-sm text-muted-foreground">Due at {displayDoseTime(upcomingDose)}</p></CardContent></Card> : null}

      {!loading && items.length === 0 ? <Card><CardContent className="p-5 text-sm text-muted-foreground">No verified medication reminders are available. A pharmacist must verify incomplete prescription schedules before they become active.</CardContent></Card> : null}

      <div className="grid gap-4 md:grid-cols-3"><Card className="md:col-span-2"><CardContent className="flex flex-col gap-4"><div><p className="text-sm text-muted-foreground">This week&apos;s adherence</p><p className="text-2xl font-semibold">{taken} of {total} doses taken · {percent}%</p></div><Progress value={percent} /></CardContent></Card><Card><CardContent className="flex h-full flex-col justify-center gap-1"><p className="text-sm text-muted-foreground">Missed doses</p><p className="text-2xl font-semibold">{adherence.missed}</p></CardContent></Card></div>

      <section className="flex flex-col gap-3"><h2 className="text-lg font-semibold">Today&apos;s Medications</h2>{items.map((item) => <Card key={item.id} className={cn(item.status === "taken" && "bg-accent/30", item.status === "missed" && "border-destructive")}><CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center"><div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"><Pill className="size-5" /></div><div className="min-w-0 flex-1"><p className="text-lg font-semibold">{displayDoseTime(item)}</p><p className="truncate font-medium">{item.medicine}</p><p className="text-sm text-muted-foreground">{item.dose}{item.food_instructions ? ` · ${item.food_instructions}` : ""}{item.actual_time ? ` · Taken at ${formatTime(item.actual_time.slice(11, 16))}` : ""}</p></div><div className="flex flex-wrap items-center gap-2 sm:justify-end"><span className={cn("rounded-full px-2.5 py-1 text-xs font-medium", item.status === "taken" ? "bg-accent text-accent-foreground" : item.status === "missed" ? "bg-destructive/10 text-destructive" : item.status === "due" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground")}>{item.status === "snoozed" ? "Upcoming" : item.status[0].toUpperCase() + item.status.slice(1)}</span>{item.status === "due" || item.status === "upcoming" || item.status === "snoozed" ? <Button size="sm" onClick={() => act(item.id, "taken")}><Check data-icon="inline-start" />Take now</Button> : null}</div></CardContent></Card>)}</section>
      {items.some((item) => item.status === "missed") ? <p className="flex items-center gap-2 text-sm text-destructive"><ShieldAlert className="size-4" />Missed doses need pharmacist attention.</p> : null}
    </div>
  )
}
