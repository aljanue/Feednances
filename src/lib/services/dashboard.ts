import {
  differenceInCalendarMonths,
  eachDayOfInterval,
  eachMonthOfInterval,
  format,
  startOfDay,
  startOfMonth,
} from "date-fns";
import { getExpensesByDateRange } from "@/lib/data/expenses.queries";
import { getActiveSubscriptions } from "@/lib/data/subscriptions.queries";
import type {
  AverageCardDTO,
  CategoryBreakdownItem,
  CategoryDTO,
  DashboardDTO,
  ExpenseTrendPoint,
  FixedVariablePoint,
  GraphCardData,
  GraphRangeData,
  NumberCardDTO,
  RecentExpenseDTO,
  SubscriptionDTO,
  TimeRangeValue,
  TopSubscriptionItem,
} from "@/lib/dtos/dashboard";
import { getChartColorForCategory } from "@/lib/utils/chart-colors";
import {
  getMonthRange,
  getPreviousMonthRange,
  getPreviousYearRange,
  getRangeForTimeValue,
  getYearRange,
} from "@/lib/utils/date-range";
import { formatTimeAbbreviationByType } from "@/utils/format-data.utils";

const timeRanges: TimeRangeValue[] = [
  "last-month",
  "last-3-months",
  "last-6-months",
  "last-year",
];

// --- Helpers ---

function toNumber(value: string | number | null | undefined) {
  if (value === null || value === undefined) return 0;
  return typeof value === "number" ? value : Number.parseFloat(value);
}

function sumExpenses(items: { amount: string | number }[]) {
  return items.reduce((total, item) => total + toNumber(item.amount), 0);
}

function percentChange(current: number, previous: number) {
  if (previous === 0) return null;
  return (current - previous) / previous;
}

// --- Key Generators ---

function monthKey(date: Date) {
  return format(startOfMonth(date), "yyyy-MM");
}

function dayKey(date: Date) {
  return format(startOfDay(date), "yyyy-MM-dd");
}


// --- Formatters ---

function formatMonthLabel(date: Date, timeZone: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    timeZone,
  }).format(date);
}

function formatDayLabel(date: Date, timeZone: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    timeZone,
  }).format(date);
}


// --- Builders ---

interface ExpenseWithCategory {
  amount: string | number;
  category: { name: string; hexColor: string | null } | null;
}

function buildCategoryBreakdown(
  items: ExpenseWithCategory[],
): CategoryBreakdownItem[] {
  const totals = new Map<string, number>();
  const categoryColors = new Map<string, string>();

  for (const item of items) {
    const categoryName = item.category?.name?.trim() || "Uncategorized";
    totals.set(categoryName, (totals.get(categoryName) ?? 0) + toNumber(item.amount));
    
    if (item.category?.hexColor && !categoryColors.has(categoryName)) {
      categoryColors.set(categoryName, item.category.hexColor);
    }
  }

  const entries = Array.from(totals.entries()).sort((a, b) => b[1] - a[1]);
  return entries.map(([category, total]) => {
    return {
      id: category, // Use the name as ID to match nameKey in charts
      category,
      total,
      color: categoryColors.get(category) || getChartColorForCategory(category),
    };
  });
}

function buildExpenseTrend(
  items: { expenseDate: Date; amount: string | number }[],
  rangeStart: Date,
  rangeEnd: Date,
  timeZone: string,
): ExpenseTrendPoint[] {
  const buckets = eachDayOfInterval({ start: rangeStart, end: rangeEnd });
  const getKey = dayKey;
  const getLabel = (d: Date) => formatDayLabel(d, timeZone);

  const totals = new Map<string, number>();
  for (const bucket of buckets) {
    totals.set(getKey(bucket), 0);
  }

  for (const item of items) {
    const key = getKey(item.expenseDate);
    if (totals.has(key)) {
      totals.set(key, (totals.get(key) ?? 0) + toNumber(item.amount));
    }
  }

  return buckets.map((bucket) => ({
    label: getLabel(bucket),
    total: totals.get(getKey(bucket)) ?? 0,
  }));
}

function buildFixedVariableSeries(
  items: {
    expenseDate: Date;
    amount: string | number;
    isRecurring: boolean | null;
  }[],
  rangeStart: Date,
  rangeEnd: Date,
  timeZone: string,
): FixedVariablePoint[] {
  const buckets = eachMonthOfInterval({
    start: startOfMonth(rangeStart),
    end: startOfMonth(rangeEnd),
  });

  const totals = new Map<string, { fixed: number; variable: number }>();
  for (const bucket of buckets) {
    totals.set(monthKey(bucket), { fixed: 0, variable: 0 });
  }

  for (const item of items) {
    const key = monthKey(item.expenseDate);
    const bucket = totals.get(key);
    if (!bucket) continue;

    if (item.isRecurring) {
      bucket.fixed += toNumber(item.amount);
    } else {
      bucket.variable += toNumber(item.amount);
    }
  }

  return buckets.map((bucket) => {
    const key = monthKey(bucket);
    const bucketTotals = totals.get(key) ?? { fixed: 0, variable: 0 };
    return {
      label: formatMonthLabel(bucket, timeZone),
      fixed: bucketTotals.fixed,
      variable: bucketTotals.variable,
    };
  });
}

function buildTopSubscriptions(
  items: { name: string; amount: string | number }[],
): TopSubscriptionItem[] {
  return items.map((subscription) => ({
    name: subscription.name,
    total: toNumber(subscription.amount),
  }));
}

function buildGraphRangeData(
  items: {
    expenseDate: Date;
    amount: string | number;
    category: { name: string; hexColor: string | null } | null;
    isRecurring: boolean | null;
  }[],
  rangeStart: Date,
  rangeEnd: Date,
  timeZone: string,
  topSubscriptions: TopSubscriptionItem[],
): GraphRangeData {
  const expenseTrends = buildExpenseTrend(
    items,
    rangeStart,
    rangeEnd,
    timeZone,
  );
  const categoryBreakdown = buildCategoryBreakdown(items);
  const fixedVariable = buildFixedVariableSeries(
    items,
    rangeStart,
    rangeEnd,
    timeZone,
  );

  const totalExpenses = sumExpenses(items);
  const totalTopSubscriptions = topSubscriptions.reduce(
    (sum, item) => sum + item.total,
    0,
  );

  return {
    expenseTrends,
    categoryBreakdown,
    fixedVariable,
    topSubscriptions,
    totals: {
      expenseTrends: totalExpenses,
      categoryBreakdown: totalExpenses,
      fixedVariable: totalExpenses,
      topSubscriptions: totalTopSubscriptions,
    },
  };
}

// --- Main Service ---

export async function getDashboardData(
  userId: string,
  timeZone = "UTC",
): Promise<DashboardDTO> {
  const now = new Date();
  let safeTimeZone = timeZone;
  try {
    Intl.DateTimeFormat("en-US", { timeZone: safeTimeZone }).format(now);
  } catch {
    safeTimeZone = "UTC";
  }

  const previousYearRange = getPreviousYearRange(now);
  const maxRange = {
    start: previousYearRange.start,
    end: now,
  };

  const expenseRows = await getExpensesByDateRange(
    userId,
    maxRange.start,
    maxRange.end
  );

  const subscriptionRows = await getActiveSubscriptions(userId, 5);

  const topSubscriptions = buildTopSubscriptions(subscriptionRows);

  const graphCardData = timeRanges.reduce<GraphCardData>((acc, range) => {
    const bounds = getRangeForTimeValue(range, now);
    const filtered = expenseRows.filter(
      (expense) =>
        expense.expenseDate >= bounds.start &&
        expense.expenseDate <= bounds.end,
    );

    acc[range] = buildGraphRangeData(
      filtered,
      bounds.start,
      bounds.end,
      safeTimeZone,
      topSubscriptions,
    );

    return acc;
  }, {} as GraphCardData);

  const monthRange = getMonthRange(now);
  const prevMonthRange = getPreviousMonthRange(now);
  const yearRange = getYearRange(now);
  const prevYearRange = getPreviousYearRange(now);

  const monthExpenses = expenseRows.filter(
    (expense) =>
      expense.expenseDate >= monthRange.start &&
      expense.expenseDate <= monthRange.end,
  );
  const prevMonthExpenses = expenseRows.filter(
    (expense) =>
      expense.expenseDate >= prevMonthRange.start &&
      expense.expenseDate <= prevMonthRange.end,
  );
  const yearExpenses = expenseRows.filter(
    (expense) =>
      expense.expenseDate >= yearRange.start &&
      expense.expenseDate <= yearRange.end,
  );
  const prevYearExpenses = expenseRows.filter(
    (expense) =>
      expense.expenseDate >= prevYearRange.start &&
      expense.expenseDate <= prevYearRange.end,
  );

  const monthSubscriptions = monthExpenses.filter(
    (expense) => expense.isRecurring,
  );
  const prevMonthSubscriptions = prevMonthExpenses.filter(
    (expense) => expense.isRecurring,
  );
  const yearSubscriptions = yearExpenses.filter(
    (expense) => expense.isRecurring,
  );
  const prevYearSubscriptions = prevYearExpenses.filter(
    (expense) => expense.isRecurring,
  );

  const numberCard: NumberCardDTO = {
    metrics: {
      total: {
        title: "Expenses This Year",
        value: sumExpenses(yearExpenses),
        period: "year",
        changeYear:
          percentChange(
            sumExpenses(yearExpenses),
            sumExpenses(prevYearExpenses),
          ) ?? undefined,
        diffYear: sumExpenses(prevYearExpenses)
          ? sumExpenses(yearExpenses) - sumExpenses(prevYearExpenses)
          : undefined,
      },
      monthly: {
        title: "Expenses This Month",
        value: sumExpenses(monthExpenses),
        period: "month",
        changeMonth:
          percentChange(
            sumExpenses(monthExpenses),
            sumExpenses(prevMonthExpenses),
          ) ?? undefined,
        diffMonth: sumExpenses(prevMonthExpenses)
          ? sumExpenses(monthExpenses) - sumExpenses(prevMonthExpenses)
          : undefined,
      },
      subsTotal: {
        title: "Subscription Expenses This Year",
        value: sumExpenses(yearSubscriptions),
        period: "year",
        changeYear:
          percentChange(
            sumExpenses(yearSubscriptions),
            sumExpenses(prevYearSubscriptions),
          ) ?? undefined,
        diffYear: sumExpenses(prevYearSubscriptions)
          ? sumExpenses(yearSubscriptions) - sumExpenses(prevYearSubscriptions)
          : undefined,
      },
      subsMonthly: {
        title: "Subscription Expenses This Month",
        value: sumExpenses(monthSubscriptions),
        period: "month",
        changeMonth:
          percentChange(
            sumExpenses(monthSubscriptions),
            sumExpenses(prevMonthSubscriptions),
          ) ?? undefined,
        diffMonth: sumExpenses(prevMonthSubscriptions)
          ? sumExpenses(monthSubscriptions) - sumExpenses(prevMonthSubscriptions)
          : undefined,
      },
    },
  };

  const averageRange = getRangeForTimeValue("last-6-months", now);
  const averageExpenses = expenseRows.filter(
    (expense) =>
      expense.expenseDate >= averageRange.start &&
      expense.expenseDate <= averageRange.end,
  );

  const firstExpenseDate =
    averageExpenses[averageExpenses.length - 1]?.expenseDate ?? now;

  const monthsActive = Math.max(
    1,
    Math.min(6, differenceInCalendarMonths(now, firstExpenseDate) + 1),
  );

  const averageMonthlyTotal = sumExpenses(averageExpenses) / monthsActive;

  const currentMonthTotal = sumExpenses(monthExpenses);

  const percentageDiff =
    averageMonthlyTotal === 0
      ? 0
      : ((currentMonthTotal - averageMonthlyTotal) / averageMonthlyTotal) * 100;

  const averageCard: AverageCardDTO = {
    label: "Average Monthly Expenses",
    value: averageMonthlyTotal,
    currentMonthTotal: currentMonthTotal,
    percentageDiff: percentageDiff,
  };

  const recentExpenses: RecentExpenseDTO[] = expenseRows
    .slice(0, 5)
    .map((expense) => {
      // Map null category to a default structure for DTO
      const categoryFunc = (cat: typeof expense.category): CategoryDTO => {
        if (!cat) {
          return { id: "unknown", name: "Uncategorized", hexColor: null };
        }
        return {
          id: cat.id,
          name: cat.name,
          hexColor: cat.hexColor || null,
        };
      };

      return {
        id: expense.id,
        concept: expense.concept,
        amount: toNumber(expense.amount),
        category: categoryFunc(expense.category),
        expenseDate: expense.expenseDate.toISOString(),
        isRecurring: Boolean(expense.isRecurring),
      };
    });

  const subscriptionList: SubscriptionDTO[] = subscriptionRows.map((item) => {
    const categoryFunc = (cat: typeof item.category): CategoryDTO => {
      if (!cat) {
        return { id: "unknown", name: "Uncategorized", hexColor: null };
      }
      return {
        id: cat.id,
        name: cat.name,
        hexColor: cat.hexColor || null,
      };
    };

    return {
      id: item.id,
      name: item.name,
      amount: toNumber(item.amount),
      category: categoryFunc(item.category),
      active: Boolean(item.active),
      nextDate: item.nextRun.toISOString(),
      timeValue: item.frequencyValue,
      timeType: item.timeUnit ? formatTimeAbbreviationByType(item.timeUnit.value) : item.timeUnitId,
    };
  });

  return {
    numberCard,
    averageCard,
    graphCard: graphCardData,
    recentExpenses,
    subscriptions: subscriptionList,
  };
}
