"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

import type { ExpenseTrendPoint } from "@/lib/dtos/dashboard";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

const chartConfig = {
  total: {
    label: "Expenses",
    color: "var(--chart-1)",
  },
};

interface ExpenseTrendAreaChartProps {
  data: ExpenseTrendPoint[];
}

export default function ExpenseTrendAreaChart({
  data,
}: ExpenseTrendAreaChartProps) {
  const showXAxisLabels = data.length <= 16;
  return (
    <ChartContainer
      config={chartConfig}
      className="h-[clamp(200px,26vw,260px)] w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ left: 12, right: 12, top: 8 }}>
          <defs>
            <linearGradient id="expensesGradient" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-total)"
                stopOpacity={0.35}
              />
              <stop
                offset="95%"
                stopColor="var(--color-total)"
                stopOpacity={0.02}
              />
            </linearGradient>
          </defs>
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
            tick={showXAxisLabels ? { fill: "var(--muted-foreground)", fontSize: 12 } : false}
          />
          <Tooltip content={<ChartTooltipContent />} cursor={{ fill: "var(--muted)", opacity: 0.15 }} />
          <Area
            type="monotone"
            dataKey="total"
            stroke="var(--color-total)"
            fill="url(#expensesGradient)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
