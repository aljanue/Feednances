"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { CopyCheck } from "lucide-react";
import { format, parseISO } from "date-fns";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import type { ReportsActiveChartFilters, ReportsPreset, FilterablePanelId } from "@/lib/dtos/reports.dto";
import { REPORTS_PRESET_LABELS, CHART_FILTER_PREFIXES, FILTERABLE_PANELS } from "@/lib/dtos/reports.dto";

interface ChartDateFilterProps {
  panelId: FilterablePanelId;
  allFilters: ReportsActiveChartFilters;
}

const ALL_PREFIXES = Object.values(CHART_FILTER_PREFIXES);

export default function ChartDateFilter({ panelId, allFilters }: ChartDateFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefix = CHART_FILTER_PREFIXES[panelId];
  const activeFilter = allFilters[panelId];

  /** Build a new URL and navigate without scrolling */
  const navigate = useCallback(
    (overrides: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(overrides)) {
        if (value === undefined || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      const qs = params.toString();
      router.replace(`/dashboard/reports${qs ? `?${qs}` : ""}`, { scroll: false });
    },
    [router, searchParams],
  );

  const handlePresetChange = useCallback(
    (value: string) => {
      navigate({
        [`${prefix}_preset`]: value,
        [`${prefix}_from`]: undefined,
        [`${prefix}_to`]: undefined,
      });
    },
    [navigate, prefix],
  );

  const handleCustomRange = useCallback(
    (range: { from?: Date; to?: Date } | undefined) => {
      if (range?.from && range?.to) {
        navigate({
          [`${prefix}_preset`]: undefined,
          [`${prefix}_from`]: format(range.from, "yyyy-MM-dd"),
          [`${prefix}_to`]: format(range.to, "yyyy-MM-dd"),
        });
      }
    },
    [navigate, prefix],
  );

  /** Apply this panel's filter to all other panels */
  const handleApplyAll = useCallback(() => {
    const overrides: Record<string, string | undefined> = {};
    for (const p of ALL_PREFIXES) {
      if (activeFilter.preset === "custom") {
        overrides[`${p}_preset`] = undefined;
        overrides[`${p}_from`] = activeFilter.dateFrom;
        overrides[`${p}_to`] = activeFilter.dateTo;
      } else {
        overrides[`${p}_preset`] = activeFilter.preset;
        overrides[`${p}_from`] = undefined;
        overrides[`${p}_to`] = undefined;
      }
    }
    navigate(overrides);
  }, [navigate, activeFilter]);

  /** Check if this panel's filter is different from any other panel */
  const canApplyAll = useMemo(() => {
    return FILTERABLE_PANELS.some((otherPanelId) => {
      if (otherPanelId === panelId) return false;
      const otherFilter = allFilters[otherPanelId];
      if (!otherFilter) return false;
      
      if (activeFilter.preset !== "custom" && activeFilter.preset === otherFilter.preset) {
        return false;
      }
      
      if (activeFilter.preset === "custom" && otherFilter.preset === "custom") {
        return (
          activeFilter.dateFrom !== otherFilter.dateFrom ||
          activeFilter.dateTo !== otherFilter.dateTo
        );
      }
      
      return true; // Presets are different
    });
  }, [allFilters, panelId, activeFilter]);

  const isCustom = activeFilter.preset === "custom";

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <Select
        value={isCustom ? "" : activeFilter.preset}
        onValueChange={handlePresetChange}
      >
        <SelectTrigger className="w-[140px] h-7 text-[11px] border-border/40 bg-muted/30 rounded-md shadow-none focus:ring-0">
          <SelectValue placeholder="Preset range" />
        </SelectTrigger>
        <SelectContent className="bg-popover/95 backdrop-blur-md">
          {(Object.entries(REPORTS_PRESET_LABELS) as [ReportsPreset, string][]).map(
            ([key, label]) => (
              <SelectItem key={key} value={key} className="text-xs">
                {label}
              </SelectItem>
            ),
          )}
        </SelectContent>
      </Select>

      <span className="text-muted-foreground/30 text-[10px] select-none">or</span>

      <DatePickerWithRange
        date={{
          from: activeFilter.dateFrom ? parseISO(activeFilter.dateFrom) : undefined,
          to: activeFilter.dateTo ? parseISO(activeFilter.dateTo) : undefined,
        }}
        onSelect={(range) => {
          if (range?.from) {
            handleCustomRange({ from: range.from, to: range.to });
          }
        }}
        className="w-full sm:w-auto"
        compact
      />

      {canApplyAll && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleApplyAll}
          className="h-7 px-2.5 text-[11px] text-primary/80 hover:text-primary hover:bg-primary/10 gap-1.5 shrink-0 transition-colors w-full sm:w-auto justify-start"
        >
          <CopyCheck className="size-3.5" />
          Apply all
        </Button>
      )}
    </div>
  );
}
