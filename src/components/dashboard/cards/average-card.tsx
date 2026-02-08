import { TrendingDown, TrendingUp, Minus } from "lucide-react";
import type { AverageCardDTO } from "@/lib/dtos/dashboard";
import { formatCurrency } from "@/lib/utils/formatters";
import { cn } from "@/lib/utils";

interface AverageCardProps {
  data: AverageCardDTO;
}

export default function AverageCard({ data }: AverageCardProps) {
  const isOverAverage = data.percentageDiff > 0;
  const isEqual = data.percentageDiff === 0;

  const percentValue = Math.abs(data.percentageDiff).toFixed(1);

  return (
    <div className="h-full w-full min-h-0 flex flex-col justify-between gap-4">
      <div>
        <p className="text-xs font-medium text-muted-foreground uppercase mb-2">
          {data.label}
        </p>
        <div className="flex items-baseline gap-2">
          <p className="text-3xl font-semibold tracking-tight">
            {formatCurrency(data.value)}
          </p>
          <span className="text-sm text-muted-foreground font-medium">
          </span>
        </div>
      </div>

      {data.value > 0 && (
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-sm">
            <div
              className={cn(
                "flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold",
                isOverAverage
                  ? "bg-rose-500/15 text-rose-600 dark:text-rose-400"
                  : isEqual
                    ? "bg-secondary text-muted-foreground"
                    : "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
              )}
            >
              {isOverAverage ? (
                <TrendingUp className="h-3 w-3" />
              ) : isEqual ? (
                <Minus className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {percentValue}%
            </div>

            <span className="text-muted-foreground text-xs">
              vs current month
            </span>
          </div>

          <p className="text-xs text-muted-foreground">
            You spent <strong>{formatCurrency(data.currentMonthTotal)}</strong>{" "}
            this month.
          </p>
        </div>
      )}

      {data.value === 0 && (
        <p className="text-xs text-muted-foreground italic">
          Not enough data to calculate trends yet.
        </p>
      )}
    </div>
  );
}
