"use client";

import { useState, useRef, useEffect } from "react";
import { DollarSign, TrendingUp, Calculator, Receipt, ChevronDown } from "lucide-react";
import type { ExpensesSummaryDTO } from "@/lib/dtos/expenses.dto";
import { formatCurrency } from "@/lib/utils/formatters";
import PercentageChangeBadge from "@/components/shared/percentage-change-badge";
import MetricCard from "@/components/shared/metric-card";
import { cn } from "@/lib/utils";
import { useUserPreferences } from "@/components/dashboard/user-preferences-provider";

interface ExpensesDataSummaryProps {
  summary: ExpensesSummaryDTO;
}

const metrics = [
  {
    key: "monthTotal" as const,
    changeKey: "monthChange" as const,
    diffKey: "monthDiff" as const,
    label: "This Month",
    changeLabel: "vs last month",
    description: "Total spending recorded in the current calendar month.",
    icon: DollarSign,
    isCurrency: true,
  },
  {
    key: "yearTotal" as const,
    changeKey: "yearChange" as const,
    diffKey: "yearDiff" as const,
    label: "This Year",
    changeLabel: "vs last year",
    description: "Cumulative spending for the entire current year.",
    icon: TrendingUp,
    isCurrency: true,
  },
  {
    key: "averageExpense" as const,
    changeKey: "averageChange" as const,
    diffKey: "averageDiff" as const,
    label: "Avg. per Expense",
    changeLabel: "vs last month",
    description: "The average cost calculated across all your recorded expenses.",
    icon: Calculator,
    isCurrency: true,
  },
  {
    key: "expenseCount" as const,
    changeKey: "countChange" as const,
    diffKey: "countDiff" as const,
    label: "Total Expenses",
    changeLabel: "vs last month",
    description: "The complete count of all expense entries in your history.",
    icon: Receipt,
    isCurrency: false,
  },
];

export default function ExpensesDataSummary({
  summary,
}: ExpensesDataSummaryProps) {
  const { currency } = useUserPreferences();
  const [expanded, setExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [expanded, summary]);

  const [firstMetric, ...restMetrics] = metrics;

  return (
    <>
      {/* Desktop: always show all 4 cards in a grid */}
      <div className="hidden sm:grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <SummaryMetric
            key={metric.key}
            summary={summary}
            metric={metric}
            currency={currency}
          />
        ))}
      </div>

      {/* Mobile: first card + expandable rest */}
      <div className="sm:hidden flex flex-col gap-3">
        <SummaryMetric
          summary={summary}
          metric={firstMetric}
          currency={currency}
        />

        {/* Animated collapsible container */}
        <div
          className="overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out"
          style={{
            maxHeight: expanded ? `${contentHeight}px` : "0px",
            opacity: expanded ? 1 : 0,
          }}
        >
          <div ref={contentRef} className="flex flex-col gap-3">
            {restMetrics.map((metric) => (
              <SummaryMetric
                key={metric.key}
                summary={summary}
                metric={metric}
                currency={currency}
              />
            ))}
          </div>
        </div>

        {/* Expand / Collapse toggle */}
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          {expanded ? "Show less" : "Show more"}
          <ChevronDown
            className={cn(
              "size-3.5 transition-transform duration-300",
              expanded && "rotate-180",
            )}
          />
        </button>
      </div>
    </>
  );
}

function SummaryMetric({
  summary,
  metric,
  currency,
}: {
  summary: ExpensesSummaryDTO;
  metric: (typeof metrics)[number];
    currency: string;
}) {
  const { key, changeKey, diffKey, label, changeLabel, description, icon, isCurrency } = metric;

  const displayValue = isCurrency
    ? formatCurrency(summary[key], currency)
    : summary[key].toLocaleString();

  return (
    <MetricCard
      icon={icon}
      label={label}
      value={displayValue}
      tooltip={description}
    >
      <PercentageChangeBadge
        change={summary[changeKey]}
        absoluteDiff={summary[diffKey]}
        label={changeLabel}
        format={isCurrency ? "currency" : "number"}
      />
    </MetricCard>
  );
}