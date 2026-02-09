import {
  endOfDay,
  endOfMonth,
  startOfMonth,
  startOfYear,
  subMonths,
  subYears,
} from "date-fns";

import type { TimeRangeValue } from "@/lib/dtos/dashboard";

export interface DateRange {
  start: Date;
  end: Date;
}

export function getRangeForTimeValue(
  value: TimeRangeValue,
  now: Date,
): DateRange {
  switch (value) {
    case "last-month":
      return {
        start: startOfMonth(now),
        end: endOfMonth(now),
      };
    case "last-3-months":
      return {
        start: startOfMonth(subMonths(now, 2)),
        end: endOfMonth(now),
      };
    case "last-6-months":
      return {
        start: startOfMonth(subMonths(now, 5)),
        end: endOfMonth(now),
      };
    case "last-year":
      return {
        start: startOfMonth(subMonths(now, 11)),
        end: endOfMonth(now),
      };
  }
}

export function getMonthRange(now: Date): DateRange {
  return {
    start: startOfMonth(now),
    end: endOfDay(now),
  };
}

export function getPreviousMonthRange(now: Date): DateRange {
  const previous = subMonths(now, 1);
  return {
    start: startOfMonth(previous),
    end: endOfMonth(previous),
  };
}

export function getYearRange(now: Date): DateRange {
  return {
    start: startOfYear(now),
    end: endOfDay(now),
  };
}

export function getPreviousYearRange(now: Date): DateRange {
  const previous = subYears(now, 1);
  return {
    start: startOfYear(previous),
    end: endOfDay(subYears(now, 1)),
  };
}
