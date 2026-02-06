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

import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

const data = [
  { month: "Jan", fixed: 4200, variable: 1600 },
  { month: "Feb", fixed: 4100, variable: 1900 },
  { month: "Mar", fixed: 4300, variable: 1500 },
  { month: "Apr", fixed: 4400, variable: 2100 },
  { month: "May", fixed: 4150, variable: 1750 },
  { month: "Jun", fixed: 4500, variable: 2300 },
];

const chartConfig = {
  fixed: { label: "Fixed", color: "var(--chart-2)" },
  variable: { label: "Variable", color: "var(--chart-4)" },
};

export default function FixedVariableStackedBarChart() {
  return (
    <ChartContainer
      config={chartConfig}
      className="h-[clamp(200px,26vw,260px)] w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ left: 8, right: 12, top: 6 }} barSize={24}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis
            dataKey="month"
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
          <Tooltip content={<ChartTooltipContent indicator="line" />} />
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
