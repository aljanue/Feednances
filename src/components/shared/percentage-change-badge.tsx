"use client";

import { useState } from "react";
import { TrendingDown, TrendingUp, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils/formatters";

interface PercentageChangeBadgeProps {
  /** Fractional change value, e.g. 0.15 = +15%, -0.05 = -5%. null means no data. */
  change: number | null | undefined;
  /** Raw absolute difference, e.g. 23.5 or -10. null = no data. */
  absoluteDiff?: number | null;
  /** Label shown after the badge, e.g. "vs last month" */
  label: string;
  /** How to format the absolute value. Defaults to "number". */
  format?: "currency" | "number";
}

function formatAbsolute(value: number, fmt: "currency" | "number"): string {
  const sign = value >= 0 ? "+" : "";
  if (fmt === "currency") {
    return `${sign}${formatCurrency(value)}`;
  }
  return `${sign}${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

export default function PercentageChangeBadge({
  change,
  absoluteDiff,
  label,
  format = "number",
}: PercentageChangeBadgeProps) {
  const [showAbsolute, setShowAbsolute] = useState(false);

  if (change === null || change === undefined) {
    return (
      <span className="text-xs text-muted-foreground/60">
        No previous data
      </span>
    );
  }

  const isIncrease = change > 0;
  const isDecrease = change < 0;

  const percentText = `${Math.abs(change * 100).toFixed(1)}%`;

  const hasAbsolute = absoluteDiff !== null && absoluteDiff !== undefined;
  const absoluteText = hasAbsolute ? formatAbsolute(absoluteDiff, format) : null;

  const displayText = showAbsolute && absoluteText ? absoluteText : percentText;
  const canToggle = hasAbsolute;

  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={canToggle ? () => setShowAbsolute((v) => !v) : undefined}
        className={cn(
          "flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold transition-all",
          isIncrease
            ? "bg-rose-500/15 text-rose-600 dark:text-rose-400"
            : isDecrease
            ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
            : "bg-secondary text-muted-foreground",
          canToggle && "cursor-pointer hover:ring-1 hover:ring-current/20 active:scale-95",
          !canToggle && "cursor-default",
        )}
      >
        {isIncrease ? (
          <TrendingUp className="size-3" />
        ) : isDecrease ? (
          <TrendingDown className="size-3" />
        ) : (
          <Minus className="size-3" />
        )}
        {displayText}
      </button>
      <span className="text-[10px] text-muted-foreground/60">{label}</span>
    </div>
  );
}

