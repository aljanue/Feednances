"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { CategorySpendingItem } from "@/lib/dtos/reports.dto";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { formatCurrency } from "@/lib/utils/formatters";

interface CategorySpendingChartProps {
  data: CategorySpendingItem[];
}

export default function CategorySpendingChart({ data }: CategorySpendingChartProps) {
  const chartConfig = data.reduce<Record<string, { label: string; color: string }>>(
    (acc, item) => {
      acc[item.name] = { label: item.name, color: item.color };
      return acc;
    },
    {},
  );

  return (
    <ChartContainer config={chartConfig} className="h-full w-full">
      <div className="flex flex-col lg:flex-row items-center gap-6 h-full">
        {/* Donut */}
        <div className="w-full lg:w-1/2 h-[220px] lg:h-full min-h-[220px] flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
              <Tooltip
                content={<ChartTooltipContent hideLabel />}
                cursor={{ fill: "var(--muted)", opacity: 0.15 }}
              />
              <Pie
                data={data}
                dataKey="total"
                nameKey="name"
                innerRadius={56}
                outerRadius={90}
                paddingAngle={3}
                stroke="var(--border)"
                strokeWidth={1}
              >
                {data.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="w-full lg:w-1/2 flex flex-col gap-2 overflow-y-auto max-h-[200px] lg:max-h-full pr-2">
          {data.map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between gap-3 py-1.5 px-2 rounded-md hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span
                  className="h-2.5 w-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-foreground truncate">
                  {item.name}
                </span>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="text-sm font-medium tabular-nums">
                  {formatCurrency(item.total)}
                </span>
                <span className="text-xs text-muted-foreground tabular-nums w-10 text-right">
                  {item.percentage.toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ChartContainer>
  );
}
