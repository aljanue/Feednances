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

import type { TopSubscriptionItem } from "@/lib/dtos/dashboard";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

const chartConfig = {
  total: { label: "Monthly Cost", color: "var(--chart-3)" },
};

interface TopSubscriptionsHorizontalBarChartProps {
  data: TopSubscriptionItem[];
}

export default function TopSubscriptionsHorizontalBarChart({
  data,
}: TopSubscriptionsHorizontalBarChartProps) {
  return (
    <ChartContainer
      config={chartConfig}
      className="h-[clamp(200px,26vw,260px)] w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ left: 12, right: 12, top: 8 }}
          barSize={18}
        >
          <CartesianGrid
            horizontal={false}
            strokeDasharray="3 3"
            stroke="var(--border)"
          />
          <XAxis
            type="number"
            tickLine={false}
            axisLine={false}
            tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
          />
          <YAxis
            type="category"
            dataKey="name"
            tickLine={false}
            axisLine={false}
            width={90}
            tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
          />
          <Tooltip content={<ChartTooltipContent />} />
          <Bar
            dataKey="total"
            fill="var(--color-total)"
            radius={[0, 6, 6, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
