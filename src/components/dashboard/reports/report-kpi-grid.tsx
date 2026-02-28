"use client";

import {
  DollarSign,
  Calendar,
  Activity,
  CreditCard,
  Hash,
  Gauge,
  ArrowUpRight,
  Repeat,
} from "lucide-react";
import type { ReportsDTO } from "@/lib/dtos/reports.dto";
import { formatCurrency } from "@/lib/utils/formatters";
import MetricCard from "@/components/shared/metric-card";
import PercentageChangeBadge from "@/components/shared/percentage-change-badge";
import { useUserPreferences } from "@/components/dashboard/user-preferences-provider";

interface ReportKpiGridProps {
  kpis: ReportsDTO["kpis"];
}

const kpiMeta = [
  { key: "monthlySpend" as const, icon: Calendar, isCurrency: true, tooltip: "Total amount spent during the current calendar month." },
  { key: "yearlySpend" as const, icon: DollarSign, isCurrency: true, tooltip: "Cumulative spending for the entire current year." },
  { key: "avgTransaction" as const, icon: Activity, isCurrency: true, tooltip: "Average cost per transaction this month." },
  { key: "subscriptionsCost" as const, icon: CreditCard, isCurrency: true, tooltip: "Total monthly cost of all active subscriptions." },
  { key: "transactionCount" as const, icon: Hash, isCurrency: false, tooltip: "Total number of expense entries this month." },
  { key: "dailyAverage" as const, icon: Gauge, isCurrency: true, tooltip: "Average daily spending this month so far." },
  { key: "largestExpense" as const, icon: ArrowUpRight, isCurrency: true, tooltip: "The single largest transaction recorded this month." },
  { key: "recurringRatio" as const, icon: Repeat, isCurrency: false, tooltip: "Percentage of monthly spending that comes from recurring expenses." },
];

export default function ReportKpiGrid({ kpis }: ReportKpiGridProps) {
  const { currency } = useUserPreferences();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {kpiMeta.map(({ key, icon, isCurrency, tooltip }) => {
        const kpi = kpis[key];

        let displayValue: string;
        if (key === "recurringRatio") {
          displayValue = `${(kpi.value * 100).toFixed(1)}%`;
        } else if (key === "transactionCount") {
          displayValue = kpi.value.toLocaleString();
        } else if (isCurrency) {
          displayValue = formatCurrency(kpi.value, currency);
        } else {
          displayValue = kpi.value.toLocaleString();
        }

        const badgeFormat = isCurrency ? "currency" : "number";

        return (
          <MetricCard
            key={key}
            icon={icon}
            label={kpi.title}
            value={displayValue}
            tooltip={tooltip}
          >
            {kpi.subtitle ? (
              <p className="text-[11px] text-muted-foreground">
                {kpi.subtitle}
              </p>
            ) : kpi.change !== null ? (
              <PercentageChangeBadge
                change={kpi.change}
                absoluteDiff={kpi.diff}
                label={`vs last ${kpi.period}`}
                format={badgeFormat}
              />
            ) : (
              <p className="text-[11px] text-muted-foreground italic">
                {key === "subscriptionsCost"
                  ? `${kpis.subscriptionsCost.value > 0 ? "Monthly cost" : "No active subscriptions"}`
                  : "Not enough data"}
              </p>
            )}
          </MetricCard>
        );
      })}
    </div>
  );
}
