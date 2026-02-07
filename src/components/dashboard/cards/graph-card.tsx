"use client";

import { useMemo, useState } from "react";
import { LineChart } from "lucide-react";

import type { GraphCardData, TimeRangeValue } from "@/lib/dtos/dashboard";
import { formatCurrency } from "@/lib/utils/formatters";
import EllipsisMenu, { EllipsisMenuItem } from "./ellipsis-menu";
import TimeRangeSelect from "./time-range-select";
import CategoryDonutChart from "./charts/category-donut-chart";
import ExpenseTrendAreaChart from "./charts/expense-trend-area-chart";
import FixedVariableStackedBarChart from "./charts/fixed-variable-stacked-bar-chart";
import TopSubscriptionsHorizontalBarChart from "./charts/top-subscriptions-horizontal-bar-chart";
import EmptyState from "./empty-state";

type ChartKey = "area" | "donut" | "stacked" | "top";

interface GraphCardProps {
  dataByRange: GraphCardData;
  defaultRange?: TimeRangeValue;
}

export default function GraphCard({
  dataByRange,
  defaultRange = "last-3-months",
}: GraphCardProps) {
  const [chartKey, setChartKey] = useState<ChartKey>("area");
  const [timeRange, setTimeRange] = useState<TimeRangeValue>(defaultRange);

  const rangeData = dataByRange[timeRange] ?? dataByRange[defaultRange];

  const chartMeta = useMemo(
    () => ({
      area: {
        label: "Expense Trends",
        value: formatCurrency(rangeData.totals.expenseTrends),
        title: "Expense Trends",
      },
      donut: {
        label: "Category Breakdown",
        value: formatCurrency(rangeData.totals.categoryBreakdown),
        title: "Category Breakdown",
      },
      stacked: {
        label: "Fixed vs. Variable",
        value: formatCurrency(rangeData.totals.fixedVariable),
        title: "Fixed vs. Variable",
      },
      top: {
        label: "Top 5 Subscriptions",
        value: formatCurrency(rangeData.totals.topSubscriptions),
        title: "Top 5 Most Expensive Subscriptions",
      },
    }),
    [rangeData],
  );

  const menuItems: EllipsisMenuItem[] = [
    {
      label: "Expense Trends",
      onSelect: () => setChartKey("area"),
    },
    {
      label: "Category Breakdown",
      onSelect: () => setChartKey("donut"),
    },
    {
      label: "Fixed vs. Variable",
      onSelect: () => setChartKey("stacked"),
    },
    {
      label: "Top 5 Most Expensive Subscriptions",
      onSelect: () => setChartKey("top"),
    },
  ];

  const meta = chartMeta[chartKey];
  const isEmpty = useMemo(() => {
    if (chartKey === "area") {
      return rangeData.expenseTrends.every((point) => point.total === 0);
    }
    if (chartKey === "donut") {
      return rangeData.categoryBreakdown.length === 0;
    }
    if (chartKey === "stacked") {
      return rangeData.fixedVariable.every(
        (point) => point.fixed === 0 && point.variable === 0,
      );
    }
    return rangeData.topSubscriptions.length === 0;
  }, [chartKey, rangeData]);

  const emptyCopy = useMemo(() => {
    if (chartKey === "donut") {
      return {
        title: "No category data",
        description: "Add expenses to see category breakdowns.",
      };
    }
    if (chartKey === "stacked") {
      return {
        title: "No fixed vs. variable data",
        description: "Track recurring and one-time expenses to compare.",
      };
    }
    if (chartKey === "top") {
      return {
        title: "No subscriptions yet",
        description: "Add subscriptions to highlight your top spend.",
      };
    }
    return {
      title: "No spending data",
      description: "Log your first expense to populate trends.",
    };
  }, [chartKey]);

  return (
    <div className="h-full w-full min-h-0 flex flex-col gap-5">
      <GraphCardHeader label={meta.label} value={meta.value}>
        <GraphCardControls
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
          menuItems={menuItems}
        />
      </GraphCardHeader>

      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden">
        <div className="min-h-50 w-full flex-1">
          {isEmpty ? (
            <EmptyState
              title={emptyCopy.title}
              description={emptyCopy.description}
              icon={LineChart}
              className="h-full"
            />
          ) : (
            <GraphCardChart chartKey={chartKey} rangeData={rangeData} />
          )}
        </div>
      </div>
    </div>
  );
}

function GraphCardHeader({
  label,
  value,
  children,
}: {
  label: string;
  value: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col-reverse sm:flex-row sm:items-end justify-between gap-x-4 gap-y-6">
      <div className="space-y-1">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
          {label}
        </p>
        <p className="text-3xl font-bold leading-none tracking-tighter tabular-nums">
          {value}
        </p>
      </div>
      {children}
    </div>
  );
}

function GraphCardControls({
  timeRange,
  onTimeRangeChange,
  menuItems,
}: {
  timeRange: TimeRangeValue;
  onTimeRangeChange: (value: TimeRangeValue) => void;
  menuItems: EllipsisMenuItem[];
}) {
  return (
    <div className="flex items-center justify-end">
      <div className="flex items-center gap-1 bg-secondary/50 p-1 rounded-xl border border-border/40 shadow-sm">
        <TimeRangeSelect value={timeRange} onValueChange={onTimeRangeChange} />
        <div className="w-px h-4 bg-border/60 mx-1" />
        <EllipsisMenu items={menuItems} />
      </div>
    </div>
  );
}

function GraphCardChart({
  chartKey,
  rangeData,
}: {
  chartKey: ChartKey;
  rangeData: GraphCardData[TimeRangeValue];
}) {
  if (chartKey === "area") {
    return <ExpenseTrendAreaChart data={rangeData.expenseTrends} />;
  }
  if (chartKey === "donut") {
    return <CategoryDonutChart data={rangeData.categoryBreakdown} />;
  }
  if (chartKey === "stacked") {
    return <FixedVariableStackedBarChart data={rangeData.fixedVariable} />;
  }
  return <TopSubscriptionsHorizontalBarChart data={rangeData.topSubscriptions} />;
}
