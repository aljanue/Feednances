import type { TimeRangeValue } from "@/lib/dtos/dashboard";

export interface DateRange {
  start: Date;
  end: Date;
}

// --- UTC-safe helpers for PostgreSQL `date` column comparisons ---

/** Create a Date at UTC midnight for year/month (0-indexed)/day */
export function utcDate(year: number, month: number, day: number): Date {
  return new Date(Date.UTC(year, month, day));
}

/** Last calendar day of a month (0-indexed) */
function lastDayOfMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
}

/**
 * Resolve the user's local year, month (0-indexed), and day from a timezone.
 * This prevents the off-by-one bug where UTC midnight is still "yesterday"
 * in the user's local time.
 */
export function localParts(now: Date, timeZone: string): { year: number; month: number; day: number } {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);

  const year = Number(parts.find((p) => p.type === "year")!.value);
  const month = Number(parts.find((p) => p.type === "month")!.value) - 1; // 0-indexed
  const day = Number(parts.find((p) => p.type === "day")!.value);
  return { year, month, day };
}

// --- Public range functions ---

export function getRangeForTimeValue(
  value: TimeRangeValue,
  now: Date,
  timeZone = "UTC",
): DateRange {
  const { year: y, month: m } = localParts(now, timeZone);
  const endOfMonth = utcDate(y, m, lastDayOfMonth(y, m));

  switch (value) {
    case "last-month":
      return {
        start: utcDate(y, m, 1),
        end: endOfMonth,
      };
    case "last-3-months": {
      return {
        start: utcDate(y, m - 2, 1),
        end: endOfMonth,
      };
    }
    case "last-6-months": {
      return {
        start: utcDate(y, m - 5, 1),
        end: endOfMonth,
      };
    }
    case "last-year": {
      return {
        start: utcDate(y, m - 11, 1),
        end: endOfMonth,
      };
    }
  }
}

export function getMonthRange(now: Date, timeZone = "UTC"): DateRange {
  const { year, month, day } = localParts(now, timeZone);
  return {
    start: utcDate(year, month, 1),
    end: utcDate(year, month, day),
  };
}

export function getPreviousMonthRange(now: Date, timeZone = "UTC"): DateRange {
  const { year: y, month: m } = localParts(now, timeZone);
  const pm = m === 0 ? 11 : m - 1;
  const py = m === 0 ? y - 1 : y;
  return {
    start: utcDate(py, pm, 1),
    end: utcDate(py, pm, lastDayOfMonth(py, pm)),
  };
}

export function getYearRange(now: Date, timeZone = "UTC"): DateRange {
  const { year, month, day } = localParts(now, timeZone);
  return {
    start: utcDate(year, 0, 1),
    end: utcDate(year, month, day),
  };
}

export function getPreviousYearRange(now: Date, timeZone = "UTC"): DateRange {
  const { year, month, day } = localParts(now, timeZone);
  return {
    start: utcDate(year - 1, 0, 1),
    end: utcDate(year - 1, month, Math.min(day, lastDayOfMonth(year - 1, month))),
  };
}
