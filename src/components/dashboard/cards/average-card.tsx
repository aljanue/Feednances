import type { AverageCardDTO } from "@/lib/dtos/dashboard";
import { formatCurrency } from "@/lib/utils/formatters";
import PercentageChangeBadge from "@/components/shared/percentage-change-badge";

interface AverageCardProps {
  data: AverageCardDTO;
}

export default function AverageCard({ data }: AverageCardProps) {
  const absoluteDiff = data.value > 0 ? data.currentMonthTotal - data.value : null;

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
        </div>
      </div>

      {data.value > 0 && (
        <div className="flex flex-col gap-1.5">
          <PercentageChangeBadge
            change={data.percentageDiff / 100}
            absoluteDiff={absoluteDiff}
            label="vs current month"
            format="currency"
          />
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

