"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

const data = [
  { month: "Jan", expenses: 8200 },
  { month: "Feb", expenses: 9100 },
  { month: "Mar", expenses: 7600 },
  { month: "Apr", expenses: 10300 },
  { month: "May", expenses: 9800 },
  { month: "Jun", expenses: 11200 },
];

const chartConfig = {
  expenses: {
    label: "Expenses",
    color: "var(--chart-1)",
  },
};

export default function ExpenseTrendAreaChart() {
  return (
    <ChartContainer
      config={chartConfig}
      className="h-[clamp(200px,26vw,260px)] w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ left: 12, right: 12, top: 8 }}>
          <defs>
            <linearGradient id="expensesGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-expenses)" stopOpacity={0.35} />
              <stop offset="95%" stopColor="var(--color-expenses)" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
          />
          <Tooltip content={<ChartTooltipContent />} />
          <Area
            type="monotone"
            dataKey="expenses"
            stroke="var(--color-expenses)"
            fill="url(#expensesGradient)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
