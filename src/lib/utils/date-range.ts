import type { TimeRangeValue } from "@/lib/dtos/dashboard";

export interface DateRange {
  start: Date;
  end: Date;
}

// --- UTC-safe helpers for PostgreSQL `date` column comparisons ---

/** Create a Date at UTC midnight for year/month (0-indexed)/day */
function utcDate(year: number, month: number, day: number): Date {
  return new Date(Date.UTC(year, month, day));
}

/** Last calendar day of a month (0-indexed) */
function lastDayOfMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
}

/** UTC midnight for the 1st of now's month */
function utcStartOfMonth(now: Date): Date {
  return utcDate(now.getUTCFullYear(), now.getUTCMonth(), 1);
}

/** UTC midnight for the last day of now's month */
function utcEndOfMonth(now: Date): Date {
  const y = now.getUTCFullYear();
  const m = now.getUTCMonth();
  return utcDate(y, m, lastDayOfMonth(y, m));
}

/** UTC midnight for today */
function utcToday(now: Date): Date {
  return utcDate(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
}

/** UTC midnight for Jan 1 of now's year */
function utcStartOfYear(now: Date): Date {
  return utcDate(now.getUTCFullYear(), 0, 1);
}

// --- Public range functions ---

export function getRangeForTimeValue(
  value: TimeRangeValue,
  now: Date,
): DateRange {
  const y = now.getUTCFullYear();
  const m = now.getUTCMonth();

  switch (value) {
    case "last-month":
      return {
        start: utcStartOfMonth(now),
        end: utcEndOfMonth(now),
      };
    case "last-3-months": {
      const sm = m - 2;
      return {
        start: utcDate(y, sm, 1),
        end: utcEndOfMonth(now),
      };
    }
    case "last-6-months": {
      const sm = m - 5;
      return {
        start: utcDate(y, sm, 1),
        end: utcEndOfMonth(now),
      };
    }
    case "last-year": {
      const sm = m - 11;
      return {
        start: utcDate(y, sm, 1),
        end: utcEndOfMonth(now),
      };
    }
  }
}

export function getMonthRange(now: Date): DateRange {
  return {
    start: utcStartOfMonth(now),
    end: utcToday(now),
  };
}

export function getPreviousMonthRange(now: Date): DateRange {
  const y = now.getUTCFullYear();
  const m = now.getUTCMonth();
  const pm = m === 0 ? 11 : m - 1;
  const py = m === 0 ? y - 1 : y;
  return {
    start: utcDate(py, pm, 1),
    end: utcDate(py, pm, lastDayOfMonth(py, pm)),
  };
}

export function getYearRange(now: Date): DateRange {
  return {
    start: utcStartOfYear(now),
    end: utcToday(now),
  };
}

export function getPreviousYearRange(now: Date): DateRange {
  const y = now.getUTCFullYear();
  const m = now.getUTCMonth();
  const d = now.getUTCDate();
  return {
    start: utcDate(y - 1, 0, 1),
    end: utcDate(y - 1, m, Math.min(d, lastDayOfMonth(y - 1, m))),
  };
}
