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
