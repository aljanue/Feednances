import { db } from "@/db";
import { expenses, categories } from "@/db/schema";
import { and, avg, count, eq, gte, lte, sum, sql, desc, max } from "drizzle-orm";

/**
 * Get monthly expense totals for a date range, grouped by month.
 */
export async function getMonthlyExpenseTotals(
  userId: string,
  startDate: Date,
  endDate: Date,
) {
  return await db
    .select({
      month: sql<string>`to_char(${expenses.expenseDate}, 'YYYY-MM')`,
      total: sum(expenses.amount),
    })
    .from(expenses)
    .where(
      and(
        eq(expenses.userId, userId),
        gte(expenses.expenseDate, startDate),
        lte(expenses.expenseDate, endDate),
      ),
    )
    .groupBy(sql`to_char(${expenses.expenseDate}, 'YYYY-MM')`)
    .orderBy(sql`to_char(${expenses.expenseDate}, 'YYYY-MM')`);
}

/**
 * Get spending totals grouped by category for a date range.
 */
export async function getCategorySpending(
  userId: string,
  startDate: Date,
  endDate: Date,
) {
  return await db
    .select({
      categoryId: expenses.categoryId,
      categoryName: categories.name,
      hexColor: categories.hexColor,
      total: sum(expenses.amount),
    })
    .from(expenses)
    .leftJoin(categories, eq(expenses.categoryId, categories.id))
    .where(
      and(
        eq(expenses.userId, userId),
        gte(expenses.expenseDate, startDate),
        lte(expenses.expenseDate, endDate),
      ),
    )
    .groupBy(expenses.categoryId, categories.name, categories.hexColor)
    .orderBy(desc(sum(expenses.amount)));
}

/**
 * Get daily expense totals for a date range.
 */
export async function getDailySpending(
  userId: string,
  startDate: Date,
  endDate: Date,
) {
  return await db
    .select({
      date: sql<string>`to_char(${expenses.expenseDate}, 'YYYY-MM-DD')`,
      total: sum(expenses.amount),
    })
    .from(expenses)
    .where(
      and(
        eq(expenses.userId, userId),
        gte(expenses.expenseDate, startDate),
        lte(expenses.expenseDate, endDate),
      ),
    )
    .groupBy(sql`to_char(${expenses.expenseDate}, 'YYYY-MM-DD')`)
    .orderBy(sql`to_char(${expenses.expenseDate}, 'YYYY-MM-DD')`);
}

/**
 * Get aggregate statistics for a date range.
 */
export async function getExpenseAggregates(
  userId: string,
  startDate: Date,
  endDate: Date,
) {
  const result = await db
    .select({
      total: sum(expenses.amount),
      avg: avg(expenses.amount),
      count: count(),
      max: max(expenses.amount),
    })
    .from(expenses)
    .where(
      and(
        eq(expenses.userId, userId),
        gte(expenses.expenseDate, startDate),
        lte(expenses.expenseDate, endDate),
      ),
    );

  return {
    total: Number(result[0]?.total ?? 0),
    avg: Number(result[0]?.avg ?? 0),
    count: result[0]?.count ?? 0,
    max: Number(result[0]?.max ?? 0),
  };
}

/**
 * Get the top N most expensive individual transactions for a date range.
 */
export async function getTopExpenses(
  userId: string,
  startDate: Date,
  endDate: Date,
  limit = 5,
) {
  return await db
    .select({
      concept: expenses.concept,
      amount: expenses.amount,
      expenseDate: expenses.expenseDate,
      categoryName: categories.name,
      categoryColor: categories.hexColor,
    })
    .from(expenses)
    .leftJoin(categories, eq(expenses.categoryId, categories.id))
    .where(
      and(
        eq(expenses.userId, userId),
        gte(expenses.expenseDate, startDate),
        lte(expenses.expenseDate, endDate),
      ),
    )
    .orderBy(desc(expenses.amount))
    .limit(limit);
}

/**
 * Get monthly totals split by recurring vs one-time expenses.
 */
export async function getRecurringVsOneTimeMonthly(
  userId: string,
  startDate: Date,
  endDate: Date,
) {
  return await db
    .select({
      month: sql<string>`to_char(${expenses.expenseDate}, 'YYYY-MM')`,
      isRecurring: expenses.isRecurring,
      total: sum(expenses.amount),
    })
    .from(expenses)
    .where(
      and(
        eq(expenses.userId, userId),
        gte(expenses.expenseDate, startDate),
        lte(expenses.expenseDate, endDate),
      ),
    )
    .groupBy(sql`to_char(${expenses.expenseDate}, 'YYYY-MM')`, expenses.isRecurring)
    .orderBy(sql`to_char(${expenses.expenseDate}, 'YYYY-MM')`);
}

/**
 * Get the total amount of recurring expenses for a date range.
 */
export async function getRecurringTotal(
  userId: string,
  startDate: Date,
  endDate: Date,
) {
  const result = await db
    .select({ total: sum(expenses.amount) })
    .from(expenses)
    .where(
      and(
        eq(expenses.userId, userId),
        eq(expenses.isRecurring, true),
        gte(expenses.expenseDate, startDate),
        lte(expenses.expenseDate, endDate),
      ),
    );

  return Number(result[0]?.total ?? 0);
}
