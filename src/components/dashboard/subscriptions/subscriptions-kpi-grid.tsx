"use client";

import { CreditCard, TrendingUp, CalendarDays } from "lucide-react";
import { formatCurrency } from "@/lib/utils/formatters";
import MetricCard from "@/components/shared/metric-card";
import PercentageChangeBadge from "@/components/shared/percentage-change-badge";
import type { SubscriptionsPageDataDTO } from "@/lib/dtos/subscriptions.dto";

interface SubscriptionsKpiGridProps {
  kpis: SubscriptionsPageDataDTO["kpis"];
}

export default function SubscriptionsKpiGrid({
  kpis,
}: SubscriptionsKpiGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <MetricCard
        icon={TrendingUp}
        label="Total Monthly Spend"
        value={formatCurrency(kpis.totalMonthlySpend)}
        tooltip="Your total estimated monthly cost based on active recurring subscriptions."
      >
        <div className="mt-2 text-left">
          <PercentageChangeBadge
            change={kpis.spendChangeMonth}
            absoluteDiff={kpis.spendDiffMonth}
            label="vs last month"
            format="currency"
          />
        </div>
      </MetricCard>

      <MetricCard
        icon={CreditCard}
        label="Active Subscriptions"
        value={kpis.activeSubscriptions.toString()}
        tooltip="The number of subscriptions currently running and billing."
      >
        <div className="mt-2 text-left">
          <PercentageChangeBadge
            change={kpis.activeChangeMonth}
            absoluteDiff={kpis.activeDiffMonth}
            label="vs last month"
            format="number"
          />
        </div>
      </MetricCard>

      <MetricCard
        icon={CalendarDays}
        label="Annual Projected"
        value={formatCurrency(kpis.annualProjected)}
        tooltip="Estimated total cost for the year based on your current monthly spend."
      >
        <div className="mt-2 text-left">
          <PercentageChangeBadge
            change={kpis.projectedChangeMonth}
            absoluteDiff={kpis.projectedDiffMonth}
            label="vs last month"
            format="currency"
          />
        </div>
      </MetricCard>
    </div>
  );
}
