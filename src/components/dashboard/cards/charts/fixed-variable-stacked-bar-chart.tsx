"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { FixedVariablePoint } from "@/lib/dtos/dashboard";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

const chartConfig = {
  fixed: { label: "Fixed", color: "var(--chart-2)" },
  variable: { label: "Variable", color: "var(--chart-4)" },
};

interface FixedVariableStackedBarChartProps {
  data: FixedVariablePoint[];
}

export default function FixedVariableStackedBarChart({
  data,
}: FixedVariableStackedBarChartProps) {
  return (
    <ChartContainer
      config={chartConfig}
      className="h-[clamp(200px,26vw,260px)] w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ left: 8, right: 12, top: 6 }}
          barSize={24}
        >
          <CartesianGrid
            vertical={false}
            strokeDasharray="3 3"
            stroke="var(--border)"
          />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
          />
          <Tooltip content={<ChartTooltipContent indicator="line" />} cursor={{ fill: "var(--muted)", opacity: 0.15 }} />
          <Bar
            dataKey="fixed"
            stackId="expenses"
            fill="var(--color-fixed)"
            radius={[0, 0, 6, 6]}
          />
          <Bar
            dataKey="variable"
            stackId="expenses"
            fill="var(--color-variable)"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
