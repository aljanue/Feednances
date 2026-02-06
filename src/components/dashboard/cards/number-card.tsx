"use client";

import { useMemo, useState } from "react";

import EllipsisMenu, { EllipsisMenuItem } from "./ellipsis-menu";
import type { NumberCardDTO, NumberCardMetricKey } from "@/lib/dtos/dashboard";
import { formatCurrency, formatPercent } from "@/lib/utils/formatters";

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

  const changeValue = metric.period === "month"
    ? metric.changeMonth
    : metric.changeYear;
  const changeLabel = metric.period === "month" ? "last month" : "last year";
  const changeTone = changeValue !== undefined && changeValue !== null && changeValue < 0
    ? "text-red-500"
    : "text-green-500";

  return (
    <div className="h-full w-full flex flex-col gap-6 justify-between">
      <div className="flex items-center justify-between gap-6">
        <h2 className="text-xs uppercase text-muted-foreground font-semibold">
          {metric.title}
        </h2>
        <EllipsisMenu items={menuItems} />
      </div>
      <p className="text-5xl font-bold">{formatCurrency(metric.value)}</p>
      <div className="pt-6 mt-2 border-t border-solid border-muted">
        <p className="text-sm text-muted-foreground">
          Compared to {changeLabel}:{" "}
          {changeValue === undefined || changeValue === null ? (
            <span className="text-muted-foreground">N/A</span>
          ) : (
            <span className={changeTone}>{formatPercent(changeValue)}</span>
          )}
        </p>
      </div>
    </div>
  );
}
