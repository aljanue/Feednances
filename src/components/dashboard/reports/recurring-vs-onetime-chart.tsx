"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { RecurringVsOneTimePoint } from "@/lib/dtos/reports.dto";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

const chartConfig = {
  recurring: { label: "Recurring", color: "var(--chart-2)" },
  oneTime: { label: "One-Time", color: "var(--chart-3)" },
};

interface RecurringVsOneTimeChartProps {
  data: RecurringVsOneTimePoint[];
}

export default function RecurringVsOneTimeChart({ data }: RecurringVsOneTimeChartProps) {
  return (
    <ChartContainer config={chartConfig} className="h-[clamp(220px,28vw,300px)] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ left: 8, right: 12, top: 8, bottom: 4 }} barSize={20}>
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
            dataKey="recurring"
            name="Recurring"
            stackId="expenses"
            fill="var(--color-recurring)"
            radius={[0, 0, 6, 6]}
          />
          <Bar
            dataKey="oneTime"
            name="One-Time"
            stackId="expenses"
            fill="var(--color-oneTime)"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
