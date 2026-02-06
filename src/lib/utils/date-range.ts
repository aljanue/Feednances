import {
  endOfDay,
  endOfMonth,
  startOfDay,
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
        start: startOfDay(subMonths(now, 1)),
        end: endOfDay(now),
      };
    case "last-3-months":
      return {
        start: startOfDay(subMonths(now, 3)),
        end: endOfDay(now),
      };
    case "last-6-months":
      return {
        start: startOfDay(subMonths(now, 6)),
        end: endOfDay(now),
      };
    case "last-year":
      return {
        start: startOfDay(subYears(now, 1)),
        end: endOfDay(now),
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
