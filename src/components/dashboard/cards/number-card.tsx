"use client";

import { useMemo, useState } from "react";

import EllipsisMenu, { EllipsisMenuItem } from "./ellipsis-menu";

export default function NumberCard() {
  type MetricKey = "total" | "monthly" | "subsTotal" | "subsMonthly";

  const metrics = useMemo(
    () => ({
      total: {
        title: "Expenses This Year",
        value: "$1,234.56",
        period: "year",
        changeMonth: "+5.4%",
        changeMonthTone: "text-green-500",
        changeYear: "+12.8%",
        changeYearTone: "text-green-500",
      },
      monthly: {
        title: "Expenses This Month",
        value: "$312.40",
        period: "month",
        changeMonth: "-2.1%",
        changeMonthTone: "text-red-500",
        changeYear: "+3.7%",
        changeYearTone: "text-green-500",
      },
      subsTotal: {
        title: "Subscription Expenses This Year",
        value: "$540.00",
        period: "year",
        changeMonth: "+1.2%",
        changeMonthTone: "text-green-500",
        changeYear: "+6.4%",
        changeYearTone: "text-green-500",
      },
      subsMonthly: {
        title: "Subscription Expenses This Month",
        value: "$45.00",
        period: "month",
        changeMonth: "+0.6%",
        changeMonthTone: "text-green-500",
        changeYear: "+2.3%",
        changeYearTone: "text-green-500",
      },
    }),
    []
  );

  const [metricKey, setMetricKey] = useState<MetricKey>("total");
  const metric = metrics[metricKey];

  const menuItems: EllipsisMenuItem[] = [
    { label: "Yearly Expenses", onSelect: () => setMetricKey("total") },
    { label: "Monthly Expenses", onSelect: () => setMetricKey("monthly") },
    {
      label: "Yearly Subscription Expenses",
      onSelect: () => setMetricKey("subsTotal"),
    },
    {
      label: "Monthly Subscription Expenses",
      onSelect: () => setMetricKey("subsMonthly"),
    },
  ];

  return (
    <div className="h-full w-full flex flex-col gap-6 justify-between">
      <div className="flex items-center justify-between gap-6">
        <h2 className="text-xs uppercase text-muted-foreground font-semibold">
          {metric.title}
        </h2>
        <EllipsisMenu items={menuItems} />
      </div>
      <p className="text-5xl font-bold">{metric.value}</p>
      <div className="pt-6 mt-2 border-t border-solid border-muted">
        {metric.period === "month" ? (
          <p className="text-sm text-muted-foreground">
            Compared to last month:{" "}
            <span className={metric.changeMonthTone}>
              {metric.changeMonth}
            </span>
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            Compared to last year:{" "}
            <span className={metric.changeYearTone}>
              {metric.changeYear}
            </span>
          </p>
        )}
      </div>
    </div>
  );
}
