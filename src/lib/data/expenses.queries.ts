import { db } from "@/db";
import { expenses, categories } from "@/db/schema";
import {
  and,
  asc,
  avg,
  count,
  desc,
  eq,
  gte,
  ilike,
  lte,
  sum,
  type SQL,
} from "drizzle-orm";
import {
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfDay,
  subMonths,
} from "date-fns";
import type {
  ExpenseSortField,
  SortDirection,
} from "@/lib/dtos/expenses.dto";

export async function getExpensesByDateRange(
  userId: string,
  startDate: Date,
  endDate: Date,
) {
  return await db.query.expenses.findMany({
    where: and(
      eq(expenses.userId, userId),
      gte(expenses.expenseDate, startDate),
      lte(expenses.expenseDate, endDate),
    ),
    with: {
      category: true,
    },
    orderBy: [desc(expenses.expenseDate)],
  });
}

export async function createExpense(data: typeof expenses.$inferInsert) {
  return await db.insert(expenses).values(data).returning();
}

export async function getLatestExpenseForUser(userId: string) {
  return await db.query.expenses.findFirst({
    where: eq(expenses.userId, userId),
    orderBy: [desc(expenses.date)],
  });
}

export async function deleteExpense(id: string) {
  return await db.delete(expenses).where(eq(expenses.id, id)).returning();
}

export async function updateExpense(
  id: string,
  data: {
    concept?: string;
    amount?: string;
    categoryId?: string;
    expenseDate?: Date;
  },
) {
  return await db
    .update(expenses)
    .set(data)
    .where(eq(expenses.id, id))
    .returning();
}

// --- Filter & Sort helpers ---

interface PaginatedFilters {
  search?: string;
  categoryId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  sortBy?: ExpenseSortField;
  sortDir?: SortDirection;
}

function buildWhereConditions(userId: string, filters: PaginatedFilters) {
  const conditions: SQL[] = [eq(expenses.userId, userId)];

  if (filters.search) {
    conditions.push(ilike(expenses.concept, `%${filters.search}%`));
  }
  if (filters.categoryId) {
    conditions.push(eq(expenses.categoryId, filters.categoryId));
  }
  if (filters.dateFrom) {
    conditions.push(gte(expenses.expenseDate, filters.dateFrom));
  }
  if (filters.dateTo) {
    conditions.push(lte(expenses.expenseDate, filters.dateTo));
  }

  return and(...conditions);
}

const sortColumnMap = {
  expenseDate: expenses.expenseDate,
  amount: expenses.amount,
  concept: expenses.concept,
};

function buildOrderBy(sortBy: ExpenseSortField = "expenseDate", sortDir: SortDirection = "desc") {
  if (sortBy === "category") {
    const categoryName = categories.name;
    return sortDir === "asc" ? asc(categoryName) : desc(categoryName);
  }
  
  const column = sortColumnMap[sortBy as keyof typeof sortColumnMap] || expenses.expenseDate;
  return sortDir === "asc" ? asc(column) : desc(column);
}

export async function getExpensesPaginated(
  userId: string,
  page: number,
  pageSize: number,
  filters: PaginatedFilters = {},
) {
  const offset = (page - 1) * pageSize;
  const whereClause = buildWhereConditions(userId, filters);
  const orderClause = buildOrderBy(filters.sortBy, filters.sortDir);

  const [items, totalResult] = await Promise.all([
    db
      .select({
        id: expenses.id,
        concept: expenses.concept,
        amount: expenses.amount,
        date: expenses.date,
        expenseDate: expenses.expenseDate,
        userId: expenses.userId,
        categoryId: expenses.categoryId,
        isRecurring: expenses.isRecurring,
        category: {
          id: categories.id,
          name: categories.name,
          hexColor: categories.hexColor,
        },
      })
      .from(expenses)
      .leftJoin(categories, eq(expenses.categoryId, categories.id))
      .where(whereClause)
      .orderBy(orderClause)
      .limit(pageSize)
      .offset(offset),
    db
      .select({ total: count() })
      .from(expenses)
      .where(whereClause),
  ]);

  const total = totalResult[0]?.total ?? 0;

  return { items, total, totalPages: Math.ceil(total / pageSize) };
}

export async function getExpensesSummary(userId: string) {
  const now = new Date();
  const y = now.getUTCFullYear();
  const m = now.getUTCMonth(); // 0-indexed
  const d = now.getUTCDate();

  // Helper: create a Date at UTC midnight for a given year/month/day
  const utcDate = (year: number, month: number, day: number) =>
    new Date(Date.UTC(year, month, day));

  // Last day of a given month (0-indexed)
  const lastDay = (year: number, month: number) =>
    new Date(Date.UTC(year, month + 1, 0)).getUTCDate();

  // Current month: 1st → today
  const monthStart = utcDate(y, m, 1);
  const monthEnd = utcDate(y, m, d);

  // Current year: Jan 1 → today
  const yearStart = utcDate(y, 0, 1);
  const yearEnd = utcDate(y, m, d);

  // Previous month — full natural month (1st → last day)
  const pm = m === 0 ? 11 : m - 1;
  const py = m === 0 ? y - 1 : y;
  const prevMonthStart = utcDate(py, pm, 1);
  const prevMonthEnd = utcDate(py, pm, lastDay(py, pm));

  // Previous year — same day-of-year window (Jan 1 → same month/day)
  const prevYearStart = utcDate(y - 1, 0, 1);
  const prevYearEnd = utcDate(y - 1, m, Math.min(d, lastDay(y - 1, m)));

  const userFilter = eq(expenses.userId, userId);

  const [
    monthAgg,
    prevMonthAgg,
    yearAgg,
    prevYearAgg,
    allAgg,
    prevMonthAllAgg,
  ] = await Promise.all([
    // Current month
    db
      .select({ total: sum(expenses.amount) })
      .from(expenses)
      .where(and(userFilter, gte(expenses.expenseDate, monthStart), lte(expenses.expenseDate, monthEnd))),
    // Previous month
    db
      .select({ total: sum(expenses.amount) })
      .from(expenses)
      .where(and(userFilter, gte(expenses.expenseDate, prevMonthStart), lte(expenses.expenseDate, prevMonthEnd))),
    // Current year-to-date
    db
      .select({ total: sum(expenses.amount) })
      .from(expenses)
      .where(and(userFilter, gte(expenses.expenseDate, yearStart), lte(expenses.expenseDate, yearEnd))),
    // Previous year same period
    db
      .select({ total: sum(expenses.amount) })
      .from(expenses)
      .where(and(userFilter, gte(expenses.expenseDate, prevYearStart), lte(expenses.expenseDate, prevYearEnd))),
    // All-time avg + count
    db
      .select({ avg: avg(expenses.amount), count: count() })
      .from(expenses)
      .where(userFilter),
    // Previous month avg + count (for comparison)
    db
      .select({ avg: avg(expenses.amount), count: count() })
      .from(expenses)
      .where(and(userFilter, gte(expenses.expenseDate, prevMonthStart), lte(expenses.expenseDate, prevMonthEnd))),
  ]);

  return {
    monthTotal: Number(monthAgg[0]?.total ?? 0),
    prevMonthTotal: Number(prevMonthAgg[0]?.total ?? 0),
    yearTotal: Number(yearAgg[0]?.total ?? 0),
    prevYearTotal: Number(prevYearAgg[0]?.total ?? 0),
    averageExpense: Number(allAgg[0]?.avg ?? 0),
    prevMonthAverage: Number(prevMonthAllAgg[0]?.avg ?? 0),
    expenseCount: allAgg[0]?.count ?? 0,
    prevMonthCount: prevMonthAllAgg[0]?.count ?? 0,
  };
}

