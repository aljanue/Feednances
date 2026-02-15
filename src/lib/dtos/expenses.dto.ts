import type { CategoryDTO } from "./dashboard";

export interface ExpensesSummaryDTO {
  monthTotal: number;
  yearTotal: number;
  averageExpense: number;
  expenseCount: number;
  /** Fractional change vs previous month, e.g. 0.15 = +15% */
  monthChange: number | null;
  /** Absolute diff vs previous month */
  monthDiff: number | null;
  /** Fractional change vs same period last year */
  yearChange: number | null;
  /** Absolute diff vs same period last year */
  yearDiff: number | null;
  /** Fractional change of average vs previous month */
  averageChange: number | null;
  /** Absolute diff of average vs previous month */
  averageDiff: number | null;
  /** Fractional change in expense count vs previous month */
  countChange: number | null;
  /** Absolute diff in count vs previous month */
  countDiff: number | null;
}

export interface ExpenseRowDTO {
  id: string;
  concept: string;
  amount: number;
  expenseDate: string;
  category: CategoryDTO;
  isRecurring: boolean;
}

export type ExpenseSortField = "expenseDate" | "amount" | "concept" | "category";
export type SortDirection = "asc" | "desc";

export interface ExpensesFilterParams {
  search?: string;
  categoryId?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: ExpenseSortField;
  sortDir?: SortDirection;
}

export interface ExpensesPageDTO {
  summary: ExpensesSummaryDTO;
  expenses: ExpenseRowDTO[];
  totalPages: number;
  currentPage: number;
  categories: CategoryDTO[];
  filters: ExpensesFilterParams;
}
