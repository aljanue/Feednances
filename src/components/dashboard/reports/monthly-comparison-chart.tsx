"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import type { MonthlyComparisonPoint } from "@/lib/dtos/reports.dto";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

const chartConfig = {
  current: { label: "This Year", color: "var(--primary)" },
  previous: { label: "Last Year", color: "var(--muted-foreground)" },
};

interface MonthlyComparisonChartProps {
  data: MonthlyComparisonPoint[];
}

export default function MonthlyComparisonChart({ data }: MonthlyComparisonChartProps) {
  return (
    <ChartContainer config={chartConfig} className="h-[clamp(240px,30vw,320px)] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ left: 8, right: 12, top: 8, bottom: 4 }} barGap={4}>
          <CartesianGrid
            vertical={false}
            strokeDasharray="3 3"
            stroke="var(--border)"
          />
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
          <Tooltip
            content={<ChartTooltipContent indicator="line" />}
            cursor={{ fill: "var(--muted)", opacity: 0.15 }}
          />
          <Legend
            verticalAlign="top"
            align="right"
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: 12, color: "var(--muted-foreground)", paddingBottom: 8 }}
          />
          <Bar
            dataKey="previous"
            name="Last Year"
            fill="var(--color-previous)"
            radius={[4, 4, 4, 4]}
            barSize={16}
            opacity={0.5}
          />
          <Bar
            dataKey="current"
            name="This Year"
            fill="var(--color-current)"
            radius={[4, 4, 4, 4]}
            barSize={16}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
