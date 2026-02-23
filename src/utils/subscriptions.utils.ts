import { addDays, addMonths, addWeeks, addYears } from "date-fns";

export function calculateNextRun(
  value: number | string,
  type: string,
  currentRunDate?: Date,
): Date {
  const baseDate = currentRunDate ? new Date(currentRunDate) : new Date();

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
  const now = new Date();
  let next = new Date(startsAt);
  const pastRuns: Date[] = [];

  // Safety break to prevent infinite loops if inputs are messed up.
  let iterations = 0;
  while (next < now && iterations < 1000) {
    pastRuns.push(new Date(next));
    next = calculateNextRun(value, type, next);
    iterations++;
  }
  return { nextRun: next, pastRuns };
}
