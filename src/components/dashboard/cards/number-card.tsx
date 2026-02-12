"use client";

import { useMemo, useState } from "react";
import { TrendingDown, TrendingUp, Minus } from "lucide-react";

import EllipsisMenu, { EllipsisMenuItem } from "./ellipsis-menu";
import type { NumberCardDTO, NumberCardMetricKey } from "@/lib/dtos/dashboard";
import { formatCurrency } from "@/lib/utils/formatters";
import { cn } from "@/lib/utils";

interface NumberCardProps {
  data: NumberCardDTO;
}

const metricLabels: Record<NumberCardMetricKey, string> = {
  total: "Yearly Expenses",
  monthly: "Monthly Expenses",
  subsTotal: "Yearly Subscription Expenses",
  subsMonthly: "Monthly Subscription Expenses",
};

export default function NumberCard({ data }: NumberCardProps) {
  const metrics = useMemo(() => data.metrics, [data]);

  const [metricKey, setMetricKey] = useState<NumberCardMetricKey>("total");
  const metric = metrics[metricKey];

  const menuItems: EllipsisMenuItem[] = (
    Object.keys(metricLabels) as NumberCardMetricKey[]
  ).map((key) => ({
    label: metricLabels[key],
    onSelect: () => setMetricKey(key),
  }));

  return (
    <div className="h-full w-full flex flex-col gap-2 justify-between">
      <NumberCardHeader title={metric.title} menuItems={menuItems} />
      <div className="flex flex-col gap-2">
        <NumberCardValue value={metric.value} />
        <NumberCardChange
          value={metric.value}
          period={metric.period}
          changeMonth={metric.changeMonth}
          changeYear={metric.changeYear}
        />
      </div>
    </div>
  );
}

function NumberCardHeader({
  title,
  menuItems,
}: {
  title: string;
  menuItems: EllipsisMenuItem[];
}) {
  return (
    <div className="flex items-center justify-between gap-6">
      <h2 className="text-xs uppercase text-muted-foreground font-semibold">
        {title}
      </h2>
      <EllipsisMenu items={menuItems} />
    </div>
  );
}

function NumberCardValue({ value }: { value: number }) {
  return <p className="text-5xl font-bold">{formatCurrency(value)}</p>;
}

function NumberCardChange({
  value,
  period,
  changeMonth,
  changeYear,
}: {
  value: number;
  period: "month" | "year";
  changeMonth?: number;
  changeYear?: number;
}) {
  const changeValue = period === "month" ? changeMonth : changeYear;
  const periodLabel = period === "month" ? "last month" : "last year";

  const isIncrease = changeValue !== undefined && changeValue > 0;
  const isDecrease = changeValue !== undefined && changeValue < 0;

  const percentValue =
    changeValue !== undefined
      ? Math.abs(changeValue * 100).toFixed(1)
      : "0.0";

  if (value === 0) {
    return (
      <p className="text-sm italic text-muted-foreground mt-2">
        No expenses yet. Add your first transaction to start tracking.
      </p>
    );
  }

  if (changeValue === undefined || changeValue === null) {
    return (
      <p className="text-sm text-muted-foreground mt-2">
        Not enough data to compare with {periodLabel}.
      </p>
    );
  }

  return (
    <div className="flex items-center gap-2 mt-2">
      <div
        className={cn(
          "flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold",
          isIncrease
            ? "bg-rose-500/15 text-rose-600 dark:text-rose-400"
            : isDecrease
            ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
            : "bg-secondary text-muted-foreground"
        )}
      >
        {isIncrease ? (
          <TrendingUp className="h-3 w-3" />
        ) : isDecrease ? (
          <TrendingDown className="h-3 w-3" />
        ) : (
          <Minus className="h-3 w-3" />
        )}
        {percentValue}%
      </div>
      <span className="text-sm text-muted-foreground">vs {periodLabel}</span>
    </div>
  );
}