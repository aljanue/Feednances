import { eachDayOfInterval, eachMonthOfInterval, format, startOfDay, getDaysInMonth } from "date-fns";
import {
  getMonthlyExpenseTotals,
  getCategorySpending,
  getDailySpending,
  getExpenseAggregates,
  getTopExpenses,
  getRecurringVsOneTimeMonthly,
  getRecurringTotal,
} from "@/lib/data/reports.queries";
import { getActiveSubscriptions } from "@/lib/data/subscriptions.queries";
import { getChartColorForCategory } from "@/lib/utils/chart-colors";
import {
  getMonthRange,
  getPreviousMonthRange,
  getYearRange,
  getPreviousYearRange,
} from "@/lib/utils/date-range";
import type {
  ReportsDTO,
  ReportKPI,
  MonthlyComparisonPoint,
  CategorySpendingItem,
  DailySpendingPoint,
  SubscriptionCostItem,
  TopExpenseItem,
  RecurringVsOneTimePoint,
  SpendingPaceDTO,
} from "@/lib/dtos/reports.dto";

// --- Helpers ---

function toNumber(v: string | number | null | undefined): number {
  if (v === null || v === undefined) return 0;
  return typeof v === "number" ? v : Number.parseFloat(v);
}

function percentChange(current: number, previous: number): number | null {
  if (previous === 0) return null;
  return (current - previous) / previous;
}

function formatMonthLabel(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat("en-US", { month: "short", timeZone }).format(date);
}

function formatDayLabel(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone }).format(date);
}

// --- Main Service ---

export async function getReportsData(
  userId: string,
  timeZone = "UTC",
): Promise<ReportsDTO> {
  const now = new Date();

  let safeTimeZone = timeZone;
  try {
    Intl.DateTimeFormat("en-US", { timeZone: safeTimeZone }).format(now);
  } catch {
    safeTimeZone = "UTC";
  }

  // Date ranges
  const monthRange = getMonthRange(now, safeTimeZone);
  const prevMonthRange = getPreviousMonthRange(now, safeTimeZone);
  const yearRange = getYearRange(now, safeTimeZone);
  const prevYearRange = getPreviousYearRange(now, safeTimeZone);

  // Parallel data fetching — 12 queries
  const [
    currentMonthAgg,
    prevMonthAgg,
    currentYearAgg,
    prevYearAgg,
    monthlyCurrentYear,
    monthlyPreviousYear,
    categoryData,
    dailyData,
    topExpensesData,
    subscriptions,
    recurringVsOneTimeRaw,
    currentMonthRecurringTotal,
  ] = await Promise.all([
    getExpenseAggregates(userId, monthRange.start, monthRange.end),
    getExpenseAggregates(userId, prevMonthRange.start, prevMonthRange.end),
    getExpenseAggregates(userId, yearRange.start, yearRange.end),
    getExpenseAggregates(userId, prevYearRange.start, prevYearRange.end),
    getMonthlyExpenseTotals(userId, yearRange.start, yearRange.end),
    getMonthlyExpenseTotals(userId, prevYearRange.start, prevYearRange.end),
    getCategorySpending(userId, yearRange.start, yearRange.end),
    getDailySpending(userId, monthRange.start, monthRange.end),
    getTopExpenses(userId, monthRange.start, monthRange.end, 5),
    getActiveSubscriptions(userId),
    getRecurringVsOneTimeMonthly(userId, yearRange.start, yearRange.end),
    getRecurringTotal(userId, monthRange.start, monthRange.end),
  ]);

  // --- KPIs (8 total) ---
  const monthlySpend: ReportKPI = {
    title: "Spent This Month",
    value: currentMonthAgg.total,
    change: percentChange(currentMonthAgg.total, prevMonthAgg.total),
    diff: prevMonthAgg.total ? currentMonthAgg.total - prevMonthAgg.total : null,
    period: "month",
  };

  const yearlySpend: ReportKPI = {
    title: "Spent This Year",
    value: currentYearAgg.total,
    change: percentChange(currentYearAgg.total, prevYearAgg.total),
    diff: prevYearAgg.total ? currentYearAgg.total - prevYearAgg.total : null,
    period: "year",
  };

  const avgTransaction: ReportKPI = {
    title: "Avg Transaction",
    value: currentMonthAgg.avg,
    change: percentChange(currentMonthAgg.avg, prevMonthAgg.avg),
    diff: prevMonthAgg.avg ? currentMonthAgg.avg - prevMonthAgg.avg : null,
    period: "month",
  };

  const subscriptionMonthlyTotal = subscriptions.reduce(
    (sum, s) => sum + toNumber(s.amount),
    0,
  );

  const subscriptionsCost: ReportKPI = {
    title: "Active Subscriptions",
    value: subscriptionMonthlyTotal,
    change: null,
    diff: null,
    period: "month",
    subtitle: `${subscriptions.length} subscription${subscriptions.length !== 1 ? "s" : ""}`,
  };

  const transactionCount: ReportKPI = {
    title: "Transactions",
    value: currentMonthAgg.count,
    change: percentChange(currentMonthAgg.count, prevMonthAgg.count),
    diff: prevMonthAgg.count ? currentMonthAgg.count - prevMonthAgg.count : null,
    period: "month",
  };

  const daysElapsed = now.getUTCDate();
  const dailyAvgValue = daysElapsed > 0 ? currentMonthAgg.total / daysElapsed : 0;
  const prevDaysInMonth = getDaysInMonth(prevMonthRange.start);
  const prevDailyAvg = prevDaysInMonth > 0 ? prevMonthAgg.total / prevDaysInMonth : 0;

  const dailyAverage: ReportKPI = {
    title: "Daily Average",
    value: dailyAvgValue,
    change: percentChange(dailyAvgValue, prevDailyAvg),
    diff: prevDailyAvg ? dailyAvgValue - prevDailyAvg : null,
    period: "month",
  };

  const largestExpense: ReportKPI = {
    title: "Largest Expense",
    value: currentMonthAgg.max,
    change: percentChange(currentMonthAgg.max, prevMonthAgg.max),
    diff: prevMonthAgg.max ? currentMonthAgg.max - prevMonthAgg.max : null,
    period: "month",
  };

  const recurringRatioValue =
    currentMonthAgg.total > 0
      ? currentMonthRecurringTotal / currentMonthAgg.total
      : 0;
  const prevRecurringRatio =
    prevMonthAgg.total > 0
      ? 0 // We don't have prev recurring total readily, so we skip change
      : 0;

  const recurringRatio: ReportKPI = {
    title: "Recurring Ratio",
    value: recurringRatioValue,
    change: null,
    diff: null,
    period: "month",
    subtitle: `${(recurringRatioValue * 100).toFixed(1)}% of monthly spend is recurring`,
  };

  // --- Monthly Comparison ---
  const currentYearMonthMap = new Map(
    monthlyCurrentYear.map((r) => [r.month, toNumber(r.total)]),
  );
  const prevYearMonthMap = new Map(
    monthlyPreviousYear.map((r) => [r.month, toNumber(r.total)]),
  );

  const currentYear = yearRange.start.getUTCFullYear();
  const monthBuckets = eachMonthOfInterval({
    start: yearRange.start,
    end: yearRange.end,
  });

  const monthlyComparison: MonthlyComparisonPoint[] = monthBuckets.map((d) => {
    const m = d.getUTCMonth();
    const currentKey = format(d, "yyyy-MM");
    const prevKey = format(new Date(Date.UTC(currentYear - 1, m, 1)), "yyyy-MM");
    return {
      month: formatMonthLabel(d, safeTimeZone),
      current: currentYearMonthMap.get(currentKey) ?? 0,
      previous: prevYearMonthMap.get(prevKey) ?? 0,
    };
  });

  // --- Category Spending ---
  const categoryTotal = categoryData.reduce((sum, r) => sum + toNumber(r.total), 0);
  const categorySpending: CategorySpendingItem[] = categoryData.map((r) => ({
    name: r.categoryName?.trim() || "Uncategorized",
    total: toNumber(r.total),
    color: r.hexColor || getChartColorForCategory(r.categoryName || "Uncategorized"),
    percentage: categoryTotal > 0 ? (toNumber(r.total) / categoryTotal) * 100 : 0,
  }));

  // --- Daily Spending ---
  const dailyMap = new Map(
    dailyData.map((r) => [r.date, toNumber(r.total)]),
  );
  const dayBuckets = eachDayOfInterval({
    start: monthRange.start,
    end: monthRange.end,
  });
  const dailySpending: DailySpendingPoint[] = dayBuckets.map((d) => {
    const key = format(startOfDay(d), "yyyy-MM-dd");
    return {
      date: key,
      label: formatDayLabel(d, safeTimeZone),
      total: dailyMap.get(key) ?? 0,
    };
  });

  // --- Subscription Costs ---
  const subscriptionCosts: SubscriptionCostItem[] = subscriptions.map((s) => ({
    name: s.name,
    amount: toNumber(s.amount),
    category: s.category?.name || "Uncategorized",
    color: s.category?.hexColor || getChartColorForCategory(s.name),
    percentage:
      subscriptionMonthlyTotal > 0
        ? (toNumber(s.amount) / subscriptionMonthlyTotal) * 100
        : 0,
  }));

  // --- Top Expenses ---
  const topExpenses: TopExpenseItem[] = topExpensesData.map((e) => ({
    concept: e.concept,
    amount: toNumber(e.amount),
    category: e.categoryName || "Uncategorized",
    categoryColor: e.categoryColor || null,
    date: e.expenseDate.toISOString(),
  }));

  // --- Recurring vs One-Time ---
  const recurringMap = new Map<string, { recurring: number; oneTime: number }>();
  for (const row of recurringVsOneTimeRaw) {
    const existing = recurringMap.get(row.month) ?? { recurring: 0, oneTime: 0 };
    if (row.isRecurring) {
      existing.recurring = toNumber(row.total);
    } else {
      existing.oneTime = toNumber(row.total);
    }
    recurringMap.set(row.month, existing);
  }

  const recurringVsOneTime: RecurringVsOneTimePoint[] = monthBuckets.map((d) => {
    const key = format(d, "yyyy-MM");
    const data = recurringMap.get(key) ?? { recurring: 0, oneTime: 0 };
    return {
      month: formatMonthLabel(d, safeTimeZone),
      recurring: data.recurring,
      oneTime: data.oneTime,
    };
  });

  // --- Spending Pace ---
  const totalDaysInMonth = getDaysInMonth(now);
  const projectedSpend = daysElapsed > 0
    ? (currentMonthAgg.total / daysElapsed) * totalDaysInMonth
    : 0;

  const spendingPace: SpendingPaceDTO = {
    daysElapsed,
    totalDays: totalDaysInMonth,
    currentSpend: currentMonthAgg.total,
    projectedSpend,
    lastMonthTotal: prevMonthAgg.total,
    dailyAverage: dailyAvgValue,
  };

  return {
    kpis: {
      monthlySpend,
      yearlySpend,
      avgTransaction,
      subscriptionsCost,
      transactionCount,
      dailyAverage,
      largestExpense,
      recurringRatio,
    },
    monthlyComparison,
    categorySpending,
    dailySpending,
    subscriptionCosts,
    topExpenses,
    recurringVsOneTime,
    spendingPace,
  };
}
