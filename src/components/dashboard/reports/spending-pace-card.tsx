"use client";

import type { SpendingPaceDTO } from "@/lib/dtos/reports.dto";
import { formatCurrency } from "@/lib/utils/formatters";
import { cn } from "@/lib/utils";
import { useUserPreferences } from "@/components/dashboard/user-preferences-provider";

interface SpendingPaceCardProps {
  data: SpendingPaceDTO;
}

export default function SpendingPaceCard({ data }: SpendingPaceCardProps) {
  const { currency } = useUserPreferences();
  const { daysElapsed, totalDays, currentSpend, projectedSpend, lastMonthTotal, dailyAverage } = data;
  const progressPercent = totalDays > 0 ? (daysElapsed / totalDays) * 100 : 0;


  const paceRatio = lastMonthTotal > 0 ? projectedSpend / lastMonthTotal : 0;
  const isOverPace = paceRatio > 1;
  const isUnderPace = paceRatio > 0 && paceRatio <= 1;


  const gaugePercent = Math.min(paceRatio * 50, 100);
  const angle = (gaugePercent / 100) * 180;


  const radius = 80;
  const circumference = Math.PI * radius;
  const strokeDash = (angle / 180) * circumference;

  return (
    <div className="flex flex-col items-center gap-6 py-2">

      <div className="relative w-[200px] h-[110px]">
        <svg viewBox="0 0 200 110" className="w-full h-full overflow-visible">

          <path
            d="M 10 100 A 80 80 0 0 1 190 100"
            fill="none"
            stroke="var(--muted)"
            strokeWidth="12"
            strokeLinecap="round"
            opacity={0.3}
          />

          <path
            d="M 10 100 A 80 80 0 0 1 190 100"
            fill="none"
            stroke={isOverPace ? "var(--destructive)" : "var(--primary)"}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={`${strokeDash} ${circumference}`}
            className="transition-all duration-700 ease-out"
          />

          <text
            x="100"
            y="78"
            textAnchor="middle"
            className="fill-foreground text-2xl font-bold"
            style={{ fontSize: 22 }}
          >
            {paceRatio > 0 ? `${(paceRatio * 100).toFixed(0)}%` : "—"}
          </text>
          <text
            x="100"
            y="96"
            textAnchor="middle"
            className="fill-muted-foreground"
            style={{ fontSize: 10 }}
          >
            of last month
          </text>
        </svg>
      </div>


      <div className="grid grid-cols-2 gap-4 w-full">
        <StatBox
          label="Current Spend"
          value={formatCurrency(currentSpend, currency)}
          sublabel={`Day ${daysElapsed} of ${totalDays}`}
        />
        <StatBox
          label="Projected Total"
          value={formatCurrency(projectedSpend, currency)}
          sublabel={
            isOverPace
              ? "Over last month's pace"
              : isUnderPace
                ? "Under last month's pace"
                : "No comparison data"
          }
          highlight={isOverPace ? "destructive" : isUnderPace ? "positive" : undefined}
        />
        <StatBox
          label="Daily Average"
          value={formatCurrency(dailyAverage, currency)}
          sublabel="per day this month"
        />
        <StatBox
          label="Last Month"
          value={formatCurrency(lastMonthTotal, currency)}
          sublabel="total spend"
        />
      </div>
    </div>
  );
}

function StatBox({
  label,
  value,
  sublabel,
  highlight,
}: {
  label: string;
  value: string;
  sublabel: string;
  highlight?: "positive" | "destructive";
}) {
  return (
    <div className="flex flex-col gap-0.5 p-3 rounded-lg bg-muted/20 border border-border/30">
      <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.15em]">
        {label}
      </span>
      <span className="text-lg font-bold tabular-nums tracking-tight">{value}</span>
      <span
        className={cn(
          "text-[10px] text-muted-foreground",
          highlight === "positive" && "text-emerald-500",
          highlight === "destructive" && "text-red-400",
        )}
      >
        {sublabel}
      </span>
    </div>
  );
}
