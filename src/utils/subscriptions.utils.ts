import { addDays, addMonths, addWeeks, addYears } from "date-fns";

export function calculateNextRun(value: number, type: string, currentRunDate?: Date): Date {
  const baseDate = currentRunDate ? new Date(currentRunDate) : new Date();
  
  switch (type.toLowerCase()) {
    case 'day': return addDays(baseDate, value);
    case 'week': return addWeeks(baseDate, value);
    case 'month': return addMonths(baseDate, value);
    case 'year': return addYears(baseDate, value);
    default: return addDays(baseDate, 30);
  }
}