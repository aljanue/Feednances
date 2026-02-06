"use client";

import * as React from "react";
import type { TooltipProps } from "recharts";

import { cn } from "@/lib/utils";

export type ChartConfig = Record<
  string,
  {
    label?: string;
    color?: string;
  }
>;

interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  config: ChartConfig;
}

const ChartContainer = React.forwardRef<HTMLDivElement, ChartContainerProps>(
  ({ config, className, children, style, ...props }, ref) => {
    const chartStyle = Object.entries(config).reduce(
      (acc, [key, value]) => {
        if (value.color) {
          acc[`--color-${key}`] = value.color;
        }
        return acc;
      },
      {} as Record<string, string>
    );

    return (
      <div
        ref={ref}
        data-slot="chart"
        className={cn("flex w-full flex-col", className)}
        style={{ ...chartStyle, ...style }}
        {...props}
      >
        {children}
      </div>
    );
  }
);
ChartContainer.displayName = "ChartContainer";

interface ChartTooltipContentProps extends TooltipProps<number, string> {
  indicator?: "dot" | "line";
  hideLabel?: boolean;
}

function ChartTooltipContent({
  active,
  payload,
  label,
  indicator = "dot",
  hideLabel = false,
}: ChartTooltipContentProps) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="rounded-lg border bg-background p-2 text-xs shadow-sm">
      {!hideLabel && (
        <div className="mb-2 text-[11px] font-medium text-muted-foreground">
          {label}
        </div>
      )}
      <div className="space-y-1">
        {payload.map((item) => {
          const key = String(item.dataKey ?? item.name ?? "");
          const payloadFill =
            typeof item.payload === "object" && item.payload !== null
              ? (item.payload as { fill?: string }).fill
              : undefined;
          const color = item.color || payloadFill || `var(--color-${key})`;

          return (
            <div key={key} className="flex items-center gap-2">
              <span
                className={cn(
                  "inline-flex size-2 items-center justify-center rounded-full",
                  indicator === "line" && "h-0.5 w-3 rounded-none"
                )}
                style={{ backgroundColor: color }}
              />
              <span className="text-muted-foreground">
                {item.name ?? key}
              </span>
              <span className="ml-auto font-medium text-foreground">
                {item.value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export { ChartContainer, ChartTooltipContent };
