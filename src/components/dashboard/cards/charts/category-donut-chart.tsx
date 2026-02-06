"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

const data = [
  { category: "Housing", value: 4200 },
  { category: "Food", value: 2100 },
  { category: "Transport", value: 1200 },
  { category: "Utilities", value: 900 },
  { category: "Entertainment", value: 650 },
];

const chartConfig = {
  housing: { label: "Housing", color: "var(--chart-1)" },
  food: { label: "Food", color: "var(--chart-2)" },
  transport: { label: "Transport", color: "var(--chart-3)" },
  utilities: { label: "Utilities", color: "var(--chart-4)" },
  entertainment: { label: "Entertainment", color: "var(--chart-5)" },
};

export default function CategoryDonutChart() {
  return (
    <ChartContainer
      config={chartConfig}
      className="h-[clamp(220px,28vw,280px)] w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
          <Tooltip content={<ChartTooltipContent hideLabel />} />
          <Pie
            data={data}
            dataKey="value"
            nameKey="category"
            innerRadius={64}
            outerRadius={100}
            paddingAngle={3}
            stroke="var(--border)"
            strokeWidth={1}
          >
            {data.map((entry) => {
              const key = entry.category.toLowerCase();
              return (
                <Cell key={entry.category} fill={`var(--color-${key})`} />
              );
            })}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
