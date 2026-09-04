"use client"

import { Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

type CategoryPoint = {
  category: string
  value: number
  fill?: string
}

const chartConfig = {
  value: { label: "Share" },
  antibiotics: { label: "Antibiotics", color: "var(--chart-1)" },
  cardiovascular: { label: "Cardiovascular", color: "var(--chart-2)" },
  diabetes: { label: "Diabetes", color: "var(--chart-3)" },
  pain: { label: "Pain Relief", color: "var(--chart-4)" },
  other: { label: "Other", color: "var(--chart-5)" },
} satisfies ChartConfig

export function CategoryChart({ data = [] }: { data?: CategoryPoint[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Medicine Categories</CardTitle>
        <CardDescription>Distribution across therapeutic areas</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[280px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent nameKey="category" hideLabel />}
            />
            <Pie data={data} dataKey="value" nameKey="category" innerRadius={60} strokeWidth={4} />
            <ChartLegend
              content={<ChartLegendContent nameKey="category" />}
              className="flex-wrap gap-2"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
