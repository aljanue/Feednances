"use client";

import { Info } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { ReactNode } from "react";

interface MetricCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  tooltip?: string;
  /** Optional slot for badge, subtitle, or any footer content */
  children?: ReactNode;
  className?: string;
}

/**
 * Unified KPI / metric card used by both the expenses summary
 * and the reports KPI grid. Provides consistent layout, icon treatment,
 * hover, and optional tooltip via info icon.
 */
export default function MetricCard({
  icon: Icon,
  label,
  value,
  tooltip,
  children,
  className,
}: MetricCardProps) {
  const card = (
    <div
      className={cn(
        "relative overflow-hidden border border-border/50 bg-card/60 backdrop-blur-sm rounded-xl",
        "p-5 flex flex-col gap-2.5 group",
        "transition-all duration-300 hover:border-primary/20 hover:shadow-sm",
        className,
      )}
    >
      {/* Header: label + icon */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
            {label}
          </p>
          {tooltip && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="p-0.5 rounded-full text-muted-foreground/40 hover:text-muted-foreground transition-colors"
                >
                  <Info className="h-3 w-3" />
                </button>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                className="max-w-[220px] text-xs leading-relaxed"
              >
                {tooltip}
              </TooltipContent>
            </Tooltip>
          )}
        </div>
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:scale-110 transition-transform">
          <Icon className="size-4" />
        </div>
      </div>

      {/* Value */}
      <p className="text-2xl font-bold tracking-tight tabular-nums text-foreground">
        {value}
      </p>

      {/* Footer slot (badge, subtitle, etc.) */}
      {children && <div>{children}</div>}
    </div>
  );

  if (tooltip) {
    return <TooltipProvider delayDuration={200}>{card}</TooltipProvider>;
  }

  return card;
}
