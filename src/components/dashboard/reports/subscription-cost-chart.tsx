"use client";

import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { SubscriptionCostItem } from "@/lib/dtos/reports.dto";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { formatCurrency } from "@/lib/utils/formatters";

interface SubscriptionCostChartProps {
  data: SubscriptionCostItem[];
}

export default function SubscriptionCostChart({ data }: SubscriptionCostChartProps) {
  const chartConfig = data.reduce<Record<string, { label: string; color: string }>>(
    (acc, item) => {
      acc[item.name] = { label: item.name, color: item.color };
      return acc;
    },
    {},
  );

  const totalCost = data.reduce((sum, item) => sum + item.amount, 0);

  return (
    <ChartContainer config={chartConfig} className="h-full w-full">
      <div className="flex flex-col gap-4 h-full">
        <div className="h-[clamp(160px,22vw,240px)]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ left: 4, right: 12, top: 4, bottom: 4 }}
              barSize={18}
            >
              <XAxis
                type="number"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
              />
              <YAxis
                dataKey="name"
                type="category"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
                width={100}
              />
              <Tooltip
                content={<ChartTooltipContent hideLabel />}
                cursor={{ fill: "var(--muted)", opacity: 0.15 }}
              />
              <Bar dataKey="amount" name="Monthly cost" radius={[0, 6, 6, 0]}>
                {data.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Summary footer */}
        <div className="flex items-center justify-between px-2 pt-2 border-t border-border/50">
          <span className="text-xs text-muted-foreground">
            {data.length} active subscription{data.length !== 1 ? "s" : ""}
          </span>
          <span className="text-sm font-semibold tabular-nums">
            {formatCurrency(totalCost)}/mo
          </span>
        </div>
      </div>
    </ChartContainer>
  );
}
