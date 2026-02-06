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
  { name: "CloudSuite", value: 420 },
  { name: "StreamPlus", value: 320 },
  { name: "DesignPro", value: 280 },
  { name: "SecurityHub", value: 240 },
  { name: "MarketWatch", value: 210 },
];

const chartConfig = {
  value: { label: "Monthly Cost", color: "var(--chart-3)" },
};

export default function TopSubscriptionsHorizontalBarChart() {
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
          <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="var(--border)" />
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
            dataKey="value"
            fill="var(--color-value)"
            radius={[0, 6, 6, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
