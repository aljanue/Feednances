import type { CategoryDTO } from "@/lib/dtos/dashboard";
import type {
  ExpenseRowDTO,
  ExpensesFilterParams,
  ExpensesPageDTO,
  ExpensesSummaryDTO,
} from "@/lib/dtos/expenses.dto";
import {
  getExpensesPaginated,
  getExpensesSummary,
} from "@/lib/data/expenses.queries";
import { getActiveCategories } from "@/lib/data/categories.queries";

function toNumber(value: string | number | null | undefined) {
  if (value === null || value === undefined) return 0;
  return typeof value === "number" ? value : Number.parseFloat(value);
}

function percentChange(current: number, previous: number): number | null {
  if (previous === 0) return null;
  return (current - previous) / previous;
}

function mapCategory(
  cat: { id: string; name: string; hexColor: string | null } | null,
): CategoryDTO {
  if (!cat) {
    return { id: "unknown", name: "Uncategorized", hexColor: null };
  }
  return { id: cat.id, name: cat.name, hexColor: cat.hexColor || null };
}

export async function getExpensesPageData(
  userId: string,
  page = 1,
  pageSize = 10,
  filters: ExpensesFilterParams = {},
): Promise<ExpensesPageDTO> {
  const [summary, paginated, allCategories] = await Promise.all([
    getExpensesSummary(userId),
    getExpensesPaginated(userId, page, pageSize, {
      search: filters.search,
      categoryId: filters.categoryId,
      dateFrom: filters.dateFrom ? new Date(filters.dateFrom) : undefined,
      dateTo: filters.dateTo ? new Date(filters.dateTo) : undefined,
      sortBy: filters.sortBy,
      sortDir: filters.sortDir,
    }),
    getActiveCategories(userId),
  ]);

  const avgRounded = Math.round(summary.averageExpense * 100) / 100;

  const monthPctChange = percentChange(summary.monthTotal, summary.prevMonthTotal);
  const yearPctChange = percentChange(summary.yearTotal, summary.prevYearTotal);
  const avgPctChange = percentChange(avgRounded, summary.prevMonthAverage);
  const countPctChange = percentChange(summary.expenseCount, summary.prevMonthCount);

  const summaryDTO: ExpensesSummaryDTO = {
    monthTotal: summary.monthTotal,
    yearTotal: summary.yearTotal,
    averageExpense: avgRounded,
    expenseCount: summary.expenseCount,
    monthChange: monthPctChange,
    monthDiff: monthPctChange !== null ? summary.monthTotal - summary.prevMonthTotal : null,
    yearChange: yearPctChange,
    yearDiff: yearPctChange !== null ? summary.yearTotal - summary.prevYearTotal : null,
    averageChange: avgPctChange,
    averageDiff: avgPctChange !== null ? avgRounded - summary.prevMonthAverage : null,
    countChange: countPctChange,
    countDiff: countPctChange !== null ? summary.expenseCount - summary.prevMonthCount : null,
  };

  const expenses: ExpenseRowDTO[] = paginated.items.map((expense) => ({
    id: expense.id,
    concept: expense.concept,
    amount: toNumber(expense.amount),
    expenseDate: expense.expenseDate.toISOString(),
    category: mapCategory(expense.category),
    isRecurring: Boolean(expense.isRecurring),
  }));

  const categories: CategoryDTO[] = allCategories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    hexColor: cat.hexColor || null,
  }));

  return {
    summary: summaryDTO,
    expenses,
    totalPages: paginated.totalPages,
    currentPage: page,
    categories,
    filters,
  };
}
