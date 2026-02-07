"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import type { CategoryBreakdownItem } from "@/lib/dtos/dashboard";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

interface CategoryDonutChartProps {
  data: CategoryBreakdownItem[];
}

export default function CategoryDonutChart({
  data,
}: CategoryDonutChartProps) {
  const chartConfig = data.reduce<Record<string, { label: string; color: string }>>(
    (acc, item) => {
      acc[item.id] = { label: item.category, color: item.color };
      return acc;
    },
    {}
  );

  return (
    <ChartContainer
      config={chartConfig}
      className="h-[clamp(220px,28vw,280px)] w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
          <Tooltip content={<ChartTooltipContent hideLabel />} cursor={{ fill: "var(--muted)", opacity: 0.15 }} />
          <Pie
            data={data}
            dataKey="total"
            nameKey="category"
            innerRadius={64}
            outerRadius={100}
            paddingAngle={3}
            stroke="var(--border)"
            strokeWidth={1}
          >
            {data.map((entry) => (
              <Cell key={entry.id} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
