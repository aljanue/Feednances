import { addDays, addMonths, addWeeks, addYears } from "date-fns";

export function normalizeToUTCMidnight(date: Date | string | number): Date {
  const d = new Date(date);
  return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0));
}
export function calculateNextRun(
  value: number | string,
  type: string,
  currentRunDate?: Date,
): Date {
  const baseDate = currentRunDate ? normalizeToUTCMidnight(currentRunDate) : normalizeToUTCMidnight(new Date());

  const numericValue = parseInt(value.toString(), 10);

  if (isNaN(numericValue)) {
    console.error("❌ Invalid periodValue:", value);
    return addDays(baseDate, 30);
  }

  switch (type.toLowerCase()) {
    case "day":
      return addDays(baseDate, numericValue);
    case "week":
      return addWeeks(baseDate, numericValue);
    case "month":
      return addMonths(baseDate, numericValue);
    case "year":
      return addYears(baseDate, numericValue);
    default:
      return addDays(baseDate, 30);
  }
}

export function calculateFutureNextRuns(
  value: number | string,
  type: string,
  startsAt: Date
): { nextRun: Date; pastRuns: Date[] } {
  const now = normalizeToUTCMidnight(new Date());
  let next = normalizeToUTCMidnight(startsAt);
  const pastRuns: Date[] = [];

  let iterations = 0;
  while (next <= now && iterations < 1000) {
    pastRuns.push(new Date(next));
    next = calculateNextRun(value, type, next);
    iterations++;
  }
  return { nextRun: next, pastRuns };
}
