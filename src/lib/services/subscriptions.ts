import { getUserSubscriptions } from "@/lib/data/subscriptions.queries";
import { getExpensesByDateRange } from "@/lib/data/expenses.queries";
import type { SubscriptionsPageDataDTO, SubscriptionDetailDTO } from "@/lib/dtos/subscriptions.dto";
import { formatTimeAbbreviationByType } from "@/utils/format-data.utils";
import { calculateNextRun, normalizeToUTCMidnight } from "@/utils/subscriptions.utils";

function toNumber(value: string | number | null | undefined): number {
  if (value === null || value === undefined) return 0;
  return typeof value === "number" ? value : Number.parseFloat(value);
}

function percentChange(current: number, previous: number) {
  if (previous === 0) return null;
  return (current - previous) / previous;
}

// Convert a subscription to a normalized monthly cost based on its frequency
function getMonthlyCost(amount: number, frequencyValue: number, timeUnitValue: string): number {
  const value = frequencyValue || 1;
  switch (timeUnitValue.toLowerCase()) {
    case "d":
    case "days":
    case "day":
      return (amount / value) * 30.44; // average days in month
    case "w":
    case "weeks":
    case "week":
      return (amount / value) * 4.345; // average weeks in month
    case "m":
    case "months":
    case "month":
      return amount / value;
    case "y":
    case "years":
    case "year":
      return amount / (value * 12);
    default:
      return amount; // Fallback
  }
}

export async function getSubscriptionsPageData(userId: string): Promise<SubscriptionsPageDataDTO> {
  const subscriptionsRaw = await getUserSubscriptions(userId);

  // We need all expenses from the start of the previous year up to today
  // to calculate current month, past month, current year, and past year totals.
  const now = new Date();
  const startOfPreviousYear = new Date(Date.UTC(now.getUTCFullYear() - 1, 0, 1));

  const allExpenses = await getExpensesByDateRange(userId, startOfPreviousYear, now);
  const recurringExpenses = allExpenses.filter(e => e.isRecurring);

  const currentYear = now.getUTCFullYear();
  const currentMonth = now.getUTCMonth();

  const previousYear = currentYear - 1;
  const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const previousMonthYear = currentMonth === 0 ? previousYear : currentYear;

  let totalMonthlySpend = 0;
  let totalMonthlySpendLastMonth = 0;
  let yearToDateSpend = 0;
  let previousYearToDateSpend = 0;

  for (const expense of recurringExpenses) {
    const amount = toNumber(expense.amount);
    const expDate = expense.expenseDate;
    const expYear = expDate.getUTCFullYear();
    const expMonth = expDate.getUTCMonth();

    // Current Month
    if (expYear === currentYear && expMonth === currentMonth) {
      totalMonthlySpend += amount;
    }
    // Last Month
    if (expYear === previousMonthYear && expMonth === previousMonth) {
      totalMonthlySpendLastMonth += amount;
    }
    // Current Year (Accumulated so far)
    if (expYear === currentYear) {
      yearToDateSpend += amount;
    }
    // Previous Year (total)
    if (expYear === previousYear) {
      previousYearToDateSpend += amount;
    }
  }

  let activeCount = 0;
  let activeCountLastMonth = 0;
  let projectedRemainingYear = 0;
  let projectedRemainingPreviousYear = 0;
  
  const oneMonthAgo = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, now.getUTCDate()));
  const monthsRemainingCurrentYear = 11 - currentMonth;
  // For the previous year comparison, at the same point in time, how many months were left?
  // It's the exact same number of months remaining in that respective year.
  const monthsRemainingPreviousYear = 11 - currentMonth;

  const subscriptions: SubscriptionDetailDTO[] = subscriptionsRaw.map((sub) => {
    const amountNum = toNumber(sub.amount);
    const timeUnitVal = sub.timeUnit?.value ?? "m"; 

    if (sub.active) {
      activeCount++;
      const monthlyCost = getMonthlyCost(amountNum, sub.frequencyValue, timeUnitVal);

      // Add the projected cost from this active subscription for the remaining months of THIS year
      projectedRemainingYear += (monthlyCost * monthsRemainingCurrentYear);

      // Add scheduled runs until the end of the current month
      const endOfCurrentMonth = new Date(Date.UTC(currentYear, currentMonth + 1, 0, 23, 59, 59, 999));
      let nextRunTracker = normalizeToUTCMidnight(sub.nextRun);
      const nowMidnight = normalizeToUTCMidnight(now);
      let scheduledCount = 0;

      while (nextRunTracker.getTime() <= endOfCurrentMonth.getTime() && scheduledCount < 100) {
        // Only add if it hasn't already been processed (in case cron is slightly delayed but still within month)
        // Actually, if it's strictly >= today, we consider it scheduled.
        if (nextRunTracker.getTime() >= nowMidnight.getTime()) {
          totalMonthlySpend += amountNum;
        }
        nextRunTracker = calculateNextRun(sub.frequencyValue, timeUnitVal, nextRunTracker);
        scheduledCount++;
      }

      if (new Date(sub.startsAt) <= oneMonthAgo) {
        activeCountLastMonth++;
        // If it was active a year ago at this time, we would have projected it too
        // But for simplicity of comparison metric, we assume last month's active subs 
        // were the ones projected for the remainder of last year.
        projectedRemainingPreviousYear += (monthlyCost * monthsRemainingPreviousYear);
      }
    }

    return {
      id: sub.id,
      name: sub.name,
      amount: amountNum,
      category: {
        id: sub.category?.id || "uncategorized",
        name: sub.category?.name || "Uncategorized",
        hexColor: sub.category?.hexColor || null,
      },
      active: sub.active ?? true,
      nextRun: sub.nextRun.toISOString(),
      nextDate: sub.nextRun.toISOString(),
      startsAt: (sub.startsAt || sub.nextRun).toISOString(),
      timeUnitId: sub.timeUnitId,
      timeValue: sub.frequencyValue,
      timeType: sub.timeUnit ? formatTimeAbbreviationByType(sub.timeUnit.value) : "m",
    };
  });

  // Annual projected = actual recurring expenses accumulated so far THIS year + math projection of remaining months
  const annualProjected = yearToDateSpend + projectedRemainingYear;
  const annualProjectedLastMonth = previousYearToDateSpend + projectedRemainingPreviousYear;

  const spendChangeMonth = percentChange(totalMonthlySpend, totalMonthlySpendLastMonth) ?? undefined;
  const spendDiffMonth = totalMonthlySpendLastMonth ? totalMonthlySpend - totalMonthlySpendLastMonth : undefined;

  const activeChangeMonth = percentChange(activeCount, activeCountLastMonth) ?? undefined;
  const activeDiffMonth = activeCountLastMonth ? activeCount - activeCountLastMonth : undefined;

  const projectedChangeMonth = percentChange(annualProjected, annualProjectedLastMonth) ?? undefined;
  const projectedDiffMonth = annualProjectedLastMonth ? annualProjected - annualProjectedLastMonth : undefined;

  return {
    kpis: {
      totalMonthlySpend,
      spendChangeMonth,
      spendDiffMonth,
      activeSubscriptions: activeCount,
      activeChangeMonth,
      activeDiffMonth,
      annualProjected,
      projectedChangeMonth,
      projectedDiffMonth,
    },
    subscriptions,
  };
}
