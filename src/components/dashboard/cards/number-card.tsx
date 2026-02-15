"use client";

import { useMemo, useState } from "react";

import EllipsisMenu, { EllipsisMenuItem } from "./ellipsis-menu";
import PercentageChangeBadge from "@/components/shared/percentage-change-badge";
import type { NumberCardDTO, NumberCardMetricKey } from "@/lib/dtos/dashboard";
import { formatCurrency } from "@/lib/utils/formatters";

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

  const [metricKey, setMetricKey] = useState<NumberCardMetricKey>("monthly");
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
          diffMonth={metric.diffMonth}
          diffYear={metric.diffYear}
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
  diffMonth,
  diffYear,
}: {
  value: number;
  period: "month" | "year";
  changeMonth?: number;
  changeYear?: number;
    diffMonth?: number;
    diffYear?: number;
}) {
  const changeValue = period === "month" ? changeMonth : changeYear;
  const diffValue = period === "month" ? diffMonth : diffYear;
  const periodLabel = period === "month" ? "vs last month" : "vs last year";

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
        Not enough data to compare with {period === "month" ? "last month" : "last year"}.
      </p>
    );
  }

  return (
    <div className="mt-2">
      <PercentageChangeBadge
        change={changeValue}
        absoluteDiff={diffValue}
        label={periodLabel}
        format="currency"
      />
    </div>
  );
}