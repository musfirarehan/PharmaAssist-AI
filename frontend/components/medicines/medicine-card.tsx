import {
  Pill,
  Clock,
  CalendarDays,
  Sparkles,
  AlertTriangle,
  Activity,
} from "lucide-react"

import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card"

import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"


function DetailPill({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Pill
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-2.5 rounded-lg border border-border bg-muted/30 p-3">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-accent text-accent-foreground">
        <Icon className="size-4" />
      </div>

      <div className="flex min-w-0 flex-col">
        <span className="text-xs text-muted-foreground">
          {label}
        </span>

        <span className="text-sm font-medium text-foreground">
          {value || "Not available"}
        </span>
      </div>
    </div>
  )
}


export function MedicineCard({
  medicine,
}: {
  medicine: any
}) {

  /*
   * Normalize data coming from the backend.
   * This prevents the UI from crashing when a field
   * is missing or has a slightly different format.
   */

  const name =
    medicine?.name ||
    "Unknown medicine"


  const dosage =
    medicine?.dosage ||
    ""


  const purpose =
    medicine?.purpose ||
    "Please confirm the medicine's purpose with your pharmacist or doctor."


  const howToTake =
    medicine?.how_to_take ||
    medicine?.instructions ||
    "Take exactly as prescribed by your doctor."


  const foodInstructions =
    medicine?.food_instructions ||
    medicine?.food_interactions ||
    "No specific food instructions available."


  const storage =
    medicine?.storage ||
    "Follow the storage instructions on the medicine packaging."


  /*
   * Warnings can be:
   *
   * ["Warning 1", "Warning 2"]
   *
   * OR
   *
   * "Warning"
   *
   * OR missing entirely.
   */

  const warnings = Array.isArray(medicine?.serious_warnings)
    ? medicine.serious_warnings
    : Array.isArray(medicine?.warnings)
      ? medicine.warnings
      : medicine?.serious_warnings || medicine?.warnings
        ? [
            medicine.serious_warnings ||
              medicine.warnings,
          ]
        : []


  /*
   * Side effects can be:
   *
   * ["Diarrhea", "Nausea"]
   *
   * OR
   *
   * [
   *   { effect: "Diarrhea", severity: "common" }
   * ]
   */

  const rawSideEffects =
    medicine?.common_side_effects ||
    medicine?.side_effects ||
    []


  const sideEffects = Array.isArray(rawSideEffects)
    ? rawSideEffects
    : [rawSideEffects]


  /*
   * Convert every side effect into a safe display string.
   */

  const normalizedSideEffects = sideEffects
    .map((effect: any) => {

      if (typeof effect === "string") {
        return effect
      }

      if (effect && typeof effect === "object") {
        return effect.effect || null
      }

      return null
    })
    .filter(Boolean)


  return (
    <Card>

      {/* HEADER */}

      <CardHeader className="gap-0">

        <div className="flex items-start justify-between gap-4">

          <div className="flex items-center gap-3">

            <div className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Pill className="size-6" />
            </div>

            <div className="flex flex-col">

              <div className="flex items-center gap-2">

                <h3 className="text-lg font-semibold text-foreground">
                  {name}
                </h3>

                {dosage && (
                  <span className="text-sm text-muted-foreground">
                    {dosage}
                  </span>
                )}

              </div>

              <p className="text-sm text-muted-foreground">
                {purpose}
              </p>

            </div>

          </div>


          <Badge
            variant="outline"
            className="shrink-0 border-transparent bg-accent text-accent-foreground font-medium"
          >
            AI Analyzed
          </Badge>

        </div>

      </CardHeader>


      {/* CONTENT */}

      <CardContent className="flex flex-col gap-5">


        {/* MEDICINE DETAILS */}

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">

          <DetailPill
            icon={Pill}
            label="Dosage"
            value={dosage || "Not detected"}
          />


          <DetailPill
            icon={Clock}
            label="How to take"
            value={howToTake}
          />


          <DetailPill
            icon={CalendarDays}
            label="Food"
            value={foodInstructions}
          />


          <DetailPill
            icon={Activity}
            label="Storage"
            value={storage}
          />

        </div>


        {/* AI EXPLANATION */}

        <div className="rounded-xl border border-transparent bg-accent/40 p-4">

          <div className="mb-2 flex items-center gap-2">

            <Sparkles className="size-4 text-primary" />

            <span className="text-sm font-semibold text-foreground">
              Medicine Purpose
            </span>

          </div>

          <p className="text-sm leading-relaxed text-foreground/80">
            {purpose}
          </p>

        </div>


        <Separator />


        {/* WARNINGS + SIDE EFFECTS */}

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">


          {/* WARNINGS */}

          <div className="flex flex-col gap-3">

            <div className="flex items-center gap-2">

              <AlertTriangle className="size-4 text-destructive" />

              <span className="text-sm font-semibold text-foreground">
                Warnings
              </span>

            </div>


            {warnings.length > 0 ? (

              <ul className="flex flex-col gap-2">

                {warnings.map(
                  (warning: any, index: number) => (

                    <li
                      key={`${warning}-${index}`}
                      className="flex gap-2 rounded-lg border border-destructive/15 bg-destructive/5 p-2.5 text-sm text-foreground/80"
                    >

                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-destructive" />

                      <span>
                        {typeof warning === "string"
                          ? warning
                          : warning?.warning ||
                            warning?.message ||
                            "Please consult your pharmacist or doctor."
                        }
                      </span>

                    </li>

                  )
                )}

              </ul>

            ) : (

              <p className="text-sm text-muted-foreground">
                No specific warnings were provided.
              </p>

            )}

          </div>


          {/* SIDE EFFECTS */}

          <div className="flex flex-col gap-3">

            <div className="flex items-center gap-2">

              <Activity className="size-4 text-muted-foreground" />

              <span className="text-sm font-semibold text-foreground">
                Common Side Effects
              </span>

            </div>


            {normalizedSideEffects.length > 0 ? (

              <div className="flex flex-wrap gap-2">

                {normalizedSideEffects.map(
                  (effect: string, index: number) => (

                    <Badge
                      key={`${effect}-${index}`}
                    >
                      {effect}
                    </Badge>

                  )
                )}

              </div>

            ) : (

              <p className="text-sm text-muted-foreground">
                No common side effects provided.
              </p>

            )}

          </div>

        </div>


        {/* COUNSELING POINTS */}

        {Array.isArray(medicine?.counseling_points) &&
          medicine.counseling_points.length > 0 && (

            <>
              <Separator />

              <div className="flex flex-col gap-3">

                <div className="flex items-center gap-2">

                  <Sparkles className="size-4 text-primary" />

                  <span className="text-sm font-semibold text-foreground">
                    Important Counseling Points
                  </span>

                </div>


                <ul className="flex flex-col gap-2">

                  {medicine.counseling_points.map(
                    (point: any, index: number) => (

                      <li
                        key={index}
                        className="rounded-lg bg-muted/40 p-3 text-sm text-foreground/80"
                      >
                        {typeof point === "string"
                          ? point
                          : point?.text || String(point)}
                      </li>

                    )
                  )}

                </ul>

              </div>

            </>
          )}

      </CardContent>

    </Card>
  )
}