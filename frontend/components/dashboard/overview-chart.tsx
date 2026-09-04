"use client"

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

type ActivityPoint = {
  month: string
  prescriptions: number
  medicines: number
}

const chartConfig = {
  prescriptions: {
    label: "Prescriptions",
    color: "var(--chart-1)",
  },
  medicines: {
    label: "Medicines",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export function OverviewChart({ data = [] }: { data?: ActivityPoint[] }) {
  return (
    <Card className="xl:col-span-2">
      <CardHeader>
        <CardTitle>Analysis Activity</CardTitle>
        <CardDescription>
          Prescriptions and medicines processed over the last 7 months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[280px] w-full">
          <AreaChart data={data} margin={{ left: 4, right: 4 }}>
            <defs>
              <linearGradient id="fillPrescriptions" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-prescriptions)"
                  stopOpacity={0.35}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-prescriptions)"
                  stopOpacity={0.02}
                />
              </linearGradient>
              <linearGradient id="fillMedicines" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-medicines)"
                  stopOpacity={0.35}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-medicines)"
                  stopOpacity={0.02}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="4 4" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="medicines"
              type="monotone"
              stroke="var(--color-medicines)"
              strokeWidth={2}
              fill="url(#fillMedicines)"
              stackId="a"
            />
            <Area
              dataKey="prescriptions"
              type="monotone"
              stroke="var(--color-prescriptions)"
              strokeWidth={2}
              fill="url(#fillPrescriptions)"
              stackId="b"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
