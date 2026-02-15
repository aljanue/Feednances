"use client";

import { useState, useRef, useEffect } from "react";
import { DollarSign, TrendingUp, Calculator, Receipt, HelpCircle, ChevronDown } from "lucide-react";
import type { ExpensesSummaryDTO } from "@/lib/dtos/expenses.dto";
import { formatCurrency } from "@/lib/utils/formatters";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import PercentageChangeBadge from "@/components/shared/percentage-change-badge";
import { cn } from "@/lib/utils";

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
    <TooltipProvider delayDuration={200}>
      {/* Desktop: always show all 4 cards in a grid */}
      <div className="hidden sm:grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <SummaryCard
            key={metric.key}
            summary={summary}
            metric={metric}
          />
        ))}
      </div>

      {/* Mobile: first card + expandable rest */}
      <div className="sm:hidden flex flex-col gap-3">
        <SummaryCard
          summary={summary}
          metric={firstMetric}
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
              <SummaryCard
                key={metric.key}
                summary={summary}
                metric={metric}
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
    </TooltipProvider>
  );
}

function SummaryCard({
  summary,
  metric,
}: {
  summary: ExpensesSummaryDTO;
  metric: (typeof metrics)[number];
}) {
  const { key, changeKey, diffKey, label, changeLabel, description, icon: Icon, isCurrency } = metric;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="p-6 border border-solid border-muted bg-card/60 backdrop-blur-sm shadow-sm rounded-xl flex flex-col gap-3 group cursor-help transition-all hover:bg-muted/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {label}
              </p>
              <HelpCircle className="size-3 text-muted-foreground/40 group-hover:text-primary/60 transition-colors" />
            </div>
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 text-primary group-hover:scale-110 transition-transform">
              <Icon className="size-4" />
            </div>
          </div>
          <p className="text-2xl font-bold tracking-tight text-foreground">
            {isCurrency ? formatCurrency(summary[key]) : summary[key].toLocaleString()}
          </p>
          <PercentageChangeBadge
            change={summary[changeKey]}
            absoluteDiff={summary[diffKey]}
            label={changeLabel}
            format={isCurrency ? "currency" : "number"}
          />
        </div>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="max-w-[200px] text-center">
        <p>{description}</p>
      </TooltipContent>
    </Tooltip>
  );
}