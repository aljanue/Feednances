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
import { cn } from "@/lib/utils";
import PercentageChangeBadge from "@/components/shared/percentage-change-badge";

interface ReportKpiGridProps {
  kpis: ReportsDTO["kpis"];
}

const kpiMeta = [
  { key: "monthlySpend" as const, icon: Calendar, gradient: "from-emerald-500/20 to-emerald-500/5", isCurrency: true },
  { key: "yearlySpend" as const, icon: DollarSign, gradient: "from-blue-500/20 to-blue-500/5", isCurrency: true },
  { key: "avgTransaction" as const, icon: Activity, gradient: "from-amber-500/20 to-amber-500/5", isCurrency: true },
  { key: "subscriptionsCost" as const, icon: CreditCard, gradient: "from-purple-500/20 to-purple-500/5", isCurrency: true },
  { key: "transactionCount" as const, icon: Hash, gradient: "from-cyan-500/20 to-cyan-500/5", isCurrency: false },
  { key: "dailyAverage" as const, icon: Gauge, gradient: "from-rose-500/20 to-rose-500/5", isCurrency: true },
  { key: "largestExpense" as const, icon: ArrowUpRight, gradient: "from-orange-500/20 to-orange-500/5", isCurrency: true },
  { key: "recurringRatio" as const, icon: Repeat, gradient: "from-indigo-500/20 to-indigo-500/5", isCurrency: false },
];

export default function ReportKpiGrid({ kpis }: ReportKpiGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {kpiMeta.map(({ key, icon: Icon, gradient, isCurrency }) => {
        const kpi = kpis[key];

        let displayValue: string;
        if (key === "recurringRatio") {
          displayValue = `${(kpi.value * 100).toFixed(1)}%`;
        } else if (key === "transactionCount") {
          displayValue = kpi.value.toLocaleString("es-ES");
        } else if (isCurrency) {
          displayValue = formatCurrency(kpi.value);
        } else {
          displayValue = kpi.value.toLocaleString("es-ES");
        }

        const badgeFormat = isCurrency ? "currency" : "number";

        return (
          <div
            key={key}
            className="relative overflow-hidden p-5 border border-solid border-muted bg-card rounded-lg flex flex-col gap-2.5 group transition-all duration-300 hover:border-primary/30"
          >
            {/* Background gradient accent */}
            <div
              className={cn(
                "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                gradient,
              )}
            />

            <div className="relative flex items-center justify-between">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
                {kpi.title}
              </p>
              <div className="p-1.5 rounded-lg bg-muted/50">
                <Icon className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
            </div>

            <div className="relative">
              <p className="text-2xl font-bold tracking-tighter tabular-nums">
                {displayValue}
              </p>
            </div>

            <div className="relative">
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
            </div>
          </div>
        );
      })}
    </div>
  );
}
