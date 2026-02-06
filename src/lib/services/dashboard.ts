import { and, desc, eq, gte, lte } from "drizzle-orm";
import { eachMonthOfInterval, format, startOfMonth } from "date-fns";
import { db } from "@/db";
import { expenses, subscriptions } from "@/db/schema";
import type {
  CategoryBreakdownItem,
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

const timeRanges: TimeRangeValue[] = [
  "last-month",
  "last-3-months",
  "last-6-months",
  "last-year",
];

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

function monthKey(date: Date) {
  return format(startOfMonth(date), "yyyy-MM");
}

function formatMonthLabel(date: Date, timeZone: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    timeZone,
  }).format(date);
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function buildCategoryBreakdown(
  items: { category: string; amount: string | number }[],
): CategoryBreakdownItem[] {
  const totals = new Map<string, number>();

  for (const item of items) {
    const key = item.category.trim() || "Uncategorized";
    totals.set(key, (totals.get(key) ?? 0) + toNumber(item.amount));
  }

  const entries = Array.from(totals.entries()).sort((a, b) => b[1] - a[1]);
  const usedIds = new Set<string>();

  return entries.map(([category, total], index) => {
    const baseId = slugify(category) || `category-${index + 1}`;
    let id = baseId;
    let suffix = 1;

    while (usedIds.has(id)) {
      id = `${baseId}-${suffix}`;
      suffix += 1;
    }

    usedIds.add(id);

    return {
      id,
      category,
      total,
      color: getChartColorForCategory(category),
    };
  });
}

function buildMonthlyExpenseTrend(
  items: { expenseDate: Date; amount: string | number }[],
  rangeStart: Date,
  rangeEnd: Date,
  timeZone: string,
): ExpenseTrendPoint[] {
  const buckets = eachMonthOfInterval({
    start: startOfMonth(rangeStart),
    end: startOfMonth(rangeEnd),
  });

  const totals = new Map<string, number>();
  for (const bucket of buckets) {
    totals.set(monthKey(bucket), 0);
  }

  for (const item of items) {
    const key = monthKey(item.expenseDate);
    if (!totals.has(key)) continue;
    totals.set(key, (totals.get(key) ?? 0) + toNumber(item.amount));
  }

  return buckets.map((bucket) => ({
    label: formatMonthLabel(bucket, timeZone),
    total: totals.get(monthKey(bucket)) ?? 0,
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
    category: string;
    isRecurring: boolean | null;
  }[],
  rangeStart: Date,
  rangeEnd: Date,
  timeZone: string,
  topSubscriptions: TopSubscriptionItem[],
): GraphRangeData {
  const expenseTrends = buildMonthlyExpenseTrend(
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

  const expenseRows = await db.query.expenses.findMany({
    where: and(
      eq(expenses.userId, userId),
      gte(expenses.expenseDate, maxRange.start),
      lte(expenses.expenseDate, maxRange.end),
    ),
    orderBy: [desc(expenses.expenseDate)],
  });

  const subscriptionRows = await db.query.subscriptions.findMany({
    where: and(
      eq(subscriptions.userId, userId),
      eq(subscriptions.active, true),
    ),
    orderBy: [desc(subscriptions.amount)],
    limit: 5,
  });

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
      },
    },
  };

  const averageRange = getRangeForTimeValue("last-6-months", now);
  const averageExpenses = expenseRows.filter(
    (expense) =>
      expense.expenseDate >= averageRange.start &&
      expense.expenseDate <= averageRange.end,
  );
  const averageMonthlyTotal = sumExpenses(averageExpenses) / 6;

  const averageCard = {
    label: "Average Monthly Expenses",
    value: averageMonthlyTotal,
  };

  const recentExpenses: RecentExpenseDTO[] = expenseRows
    .slice(0, 5)
    .map((expense) => ({
      id: expense.id,
      concept: expense.concept,
      amount: toNumber(expense.amount),
      category: expense.category,
      expenseDate: expense.expenseDate.toISOString(),
    }));

  const subscriptionList: SubscriptionDTO[] = subscriptionRows.map((item) => ({
    id: item.id,
    name: item.name,
    amount: toNumber(item.amount),
    category: item.category,
    active: Boolean(item.active),
  }));

  return {
    numberCard,
    averageCard,
    graphCard: graphCardData,
    recentExpenses,
    subscriptions: subscriptionList,
  };
}
