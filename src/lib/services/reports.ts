import { getDaysInMonth } from "date-fns";
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
  utcDate,
  localParts,
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
  ReportsChartFilter,
  ReportsActiveChartFilter,
  ReportsActiveChartFilters,
  ReportsChartFilters,
  ReportsPreset,
} from "@/lib/dtos/reports.dto";

// --- UTC-safe interval helpers ---

function eachDayUTC(start: Date, end: Date): Date[] {
  const days: Date[] = [];
  const m = start.getUTCMonth();
  let d = start.getUTCDate();
  const y = start.getUTCFullYear();
  const endTime = end.getTime();
  while (true) {
    const date = utcDate(y, m, d);
    if (date.getTime() > endTime) break;
    days.push(date);
    d++;
  }
  return days;
}

function eachMonthUTC(start: Date, end: Date): Date[] {
  const months: Date[] = [];
  const y = start.getUTCFullYear();
  let m = start.getUTCMonth();
  const endTime = end.getTime();
  while (true) {
    const date = utcDate(y, m, 1);
    if (date.getTime() > endTime) break;
    months.push(date);
    m++;
  }
  return months;
}

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

// --- Chart filter resolver ---

const VALID_PRESETS = new Set<string>([
  "this-month", "last-month", "last-7", "last-30", "last-90", "this-year",
]);

function resolveChartFilterRange(
  filter: ReportsChartFilter | undefined,
  now: Date,
  timeZone: string,
): { start: Date; end: Date; preset: ReportsPreset | "custom" } {
  const { year: y, month: m, day: d } = localParts(now, timeZone);

  // Custom date range
  if (filter?.dateFrom && filter?.dateTo) {
    const [fy, fm, fd] = filter.dateFrom.split("-").map(Number);
    const [ty, tm, td] = filter.dateTo.split("-").map(Number);
    return {
      start: utcDate(fy, fm - 1, fd),
      end: utcDate(ty, tm - 1, td),
      preset: "custom",
    };
  }

  // Preset range
  const preset = filter?.preset && VALID_PRESETS.has(filter.preset)
    ? (filter.preset as ReportsPreset)
    : "this-month";

  switch (preset) {
    case "last-7":
      return { start: utcDate(y, m, d - 6), end: utcDate(y, m, d), preset };
    case "last-30":
      return { start: utcDate(y, m, d - 29), end: utcDate(y, m, d), preset };
    case "last-90":
      return { start: utcDate(y, m, d - 89), end: utcDate(y, m, d), preset };
    case "last-month": {
      const pm = m === 0 ? 11 : m - 1;
      const py = m === 0 ? y - 1 : y;
      const lastDay = new Date(Date.UTC(py, pm + 1, 0)).getUTCDate();
      return { start: utcDate(py, pm, 1), end: utcDate(py, pm, lastDay), preset };
    }
    case "this-year":
      return { start: utcDate(y, 0, 1), end: utcDate(y, m, d), preset };
    case "this-month":
    default:
      return { start: utcDate(y, m, 1), end: utcDate(y, m, d), preset: "this-month" };
  }
}

function resolveFilterOutput(
  filter: ReportsChartFilter | undefined,
  now: Date,
  timeZone: string,
): { start: Date; end: Date; active: ReportsActiveChartFilter } {
  const { start, end, preset } = resolveChartFilterRange(filter, now, timeZone);
  return {
    start,
    end,
    active: {
      preset,
      dateFrom: start.toISOString().slice(0, 10),
      dateTo: end.toISOString().slice(0, 10),
    },
  };
}

// --- Main Service ---

export async function getReportsData(
  userId: string,
  timeZone = "UTC",
  chartFilters?: ReportsChartFilters,
): Promise<ReportsDTO> {
  const now = new Date();

  let safeTimeZone = timeZone;
  try {
    Intl.DateTimeFormat("en-US", { timeZone: safeTimeZone }).format(now);
  } catch {
    safeTimeZone = "UTC";
  }

  // Date ranges — fixed ranges for KPIs/pace
  const monthRange = getMonthRange(now, safeTimeZone);
  const prevMonthRange = getPreviousMonthRange(now, safeTimeZone);
  const yearRange = getYearRange(now, safeTimeZone);
  const prevYearRange = getPreviousYearRange(now, safeTimeZone);

  // Per-panel filtered ranges
  const dsFilter = resolveFilterOutput(chartFilters?.["daily-spending"], now, safeTimeZone);
  const csFilter = resolveFilterOutput(chartFilters?.["category-spending"], now, safeTimeZone);
  const teFilter = resolveFilterOutput(chartFilters?.["top-expenses"], now, safeTimeZone);

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
    getCategorySpending(userId, csFilter.start, csFilter.end),
    getDailySpending(userId, dsFilter.start, dsFilter.end),
    getTopExpenses(userId, teFilter.start, teFilter.end, 5),
    getActiveSubscriptions(userId),
    getRecurringVsOneTimeMonthly(userId, yearRange.start, yearRange.end),
    getRecurringTotal(userId, monthRange.start, monthRange.end),
  ]);

  // --- KPIs ---
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

  const { day: daysElapsed } = localParts(now, safeTimeZone);
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
  const monthBuckets = eachMonthUTC(yearRange.start, yearRange.end);

  const monthlyComparison: MonthlyComparisonPoint[] = monthBuckets.map((d) => {
    const m = d.getUTCMonth();
    const currentKey = `${d.getUTCFullYear()}-${String(m + 1).padStart(2, "0")}`;
    const prevDate = utcDate(currentYear - 1, m, 1);
    const prevKey = `${prevDate.getUTCFullYear()}-${String(prevDate.getUTCMonth() + 1).padStart(2, "0")}`;
    return {
      month: formatMonthLabel(d, safeTimeZone),
      current: currentYearMonthMap.get(currentKey) ?? 0,
      previous: prevYearMonthMap.get(prevKey) ?? 0,
    };
  });

  // --- Category Spending (uses its own filter) ---
  const categoryTotal = categoryData.reduce((sum, r) => sum + toNumber(r.total), 0);
  const categorySpending: CategorySpendingItem[] = categoryData.map((r) => ({
    name: r.categoryName?.trim() || "Uncategorized",
    total: toNumber(r.total),
    color: r.hexColor || getChartColorForCategory(r.categoryName || "Uncategorized"),
    percentage: categoryTotal > 0 ? (toNumber(r.total) / categoryTotal) * 100 : 0,
  }));

  // --- Daily Spending (uses its own filter) ---
  const dailyMap = new Map(
    dailyData.map((r) => [r.date, toNumber(r.total)]),
  );
  const dayBuckets = eachDayUTC(dsFilter.start, dsFilter.end);
  const dailySpending: DailySpendingPoint[] = dayBuckets.map((d) => {
    const key = d.toISOString().slice(0, 10);
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

  // --- Top Expenses (uses its own filter) ---
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
    const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
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

  // --- Per-panel active filters ---
  const chartFiltersOutput: ReportsActiveChartFilters = {
    "daily-spending": dsFilter.active,
    "category-spending": csFilter.active,
    "top-expenses": teFilter.active,
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
    chartFilters: chartFiltersOutput,
  };
}
