"use client";

import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ReceiptText, ArrowUpDown, ArrowUp, ArrowDown, X } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/dashboard/cards/empty-state";

import ExpensesFilterBar from "./expenses-filter-bar";
import ExpensesTablePagination from "./expenses-table-pagination";
import ExpenseRow from "./expense-row";

import type {
  ExpenseRowDTO,
  ExpensesFilterParams,
  ExpenseSortField,
  SortDirection,
} from "@/lib/dtos/expenses.dto";
import type { CategoryDTO } from "@/lib/dtos/dashboard";

interface ExpensesTableProps {
  expenses: ExpenseRowDTO[];
  currentPage: number;
  totalPages: number;
  categories: CategoryDTO[];
  filters: ExpensesFilterParams;
}

export default function ExpensesTable({
  expenses,
  currentPage,
  totalPages,
  categories,
  filters,
}: ExpensesTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const buildUrl = useCallback(
    (overrides: Record<string, string | undefined>, resetPage = true) => {
      const params = new URLSearchParams(searchParams.toString());

      if (resetPage) {
        params.delete("page");
      }

      for (const [key, value] of Object.entries(overrides)) {
        if (value === undefined || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }

      const qs = params.toString();
      return `/dashboard/expenses${qs ? `?${qs}` : ""}`;
    },
    [searchParams],
  );

  const navigateTo = useCallback(
    (overrides: Record<string, string | undefined>, resetPage = true) => {
      router.push(buildUrl(overrides, resetPage));
    },
    [router, buildUrl],
  );

  const handleSort = (field: ExpenseSortField) => {
    const isSameField = filters.sortBy === field;
    const nextDir: SortDirection =
      isSameField && filters.sortDir === "desc" ? "asc" : "desc";
    navigateTo({ sortBy: field, sortDir: nextDir });
  };

  const handlePageChange = (page: number) => {
    navigateTo({ page: String(page) }, false);
  };

  const handleClearFilters = () => {
    router.push("/dashboard/expenses");
  };

  const hasActiveFilters = !!(
    filters.search ||
    filters.categoryId ||
    filters.dateFrom ||
    filters.dateTo
  );

  const isEmptyNoFilters =
    expenses.length === 0 && currentPage === 1 && !hasActiveFilters;

  if (isEmptyNoFilters) {
    return (
      <div className="border border-solid border-muted bg-card rounded-lg p-6">
        <EmptyState
          title="No expenses yet"
          description="Start tracking your expenses by adding your first transaction."
          icon={ReceiptText}
        />
      </div>
    );
  }

  return (
    <div className="border border-solid border-muted bg-card/60 backdrop-blur-sm shadow-sm rounded-xl flex flex-col overflow-hidden">
      {/* Header + Filters */}
      <div className="p-6 pb-2">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-foreground">All Expenses</h2>
            <p className="text-sm text-muted-foreground mt-0.5">Manage and track your audit log entries.</p>
          </div>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground hover:text-foreground h-8"
                onClick={handleClearFilters}
              >
                <X className="size-3.5 mr-1.5" />
                Clear filters
              </Button>
            )}
          </div>
        </div>

        <ExpensesFilterBar
          filters={filters}
          categories={categories}
          hasActiveFilters={hasActiveFilters}
          onNavigate={navigateTo}
          onClear={handleClearFilters}
        />
      </div>

      {/* Table Section */}
      <div className="flex-1 px-1">
        <div className="rounded-lg overflow-hidden border border-muted/20 bg-card/20 mx-4 mb-2">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow className="hover:bg-transparent border-b-muted/30">
                <TableHead className="w-40 text-center">
                  <SortButton
                    label="DATE"
                    field="expenseDate"
                    currentSort={filters.sortBy}
                    currentDir={filters.sortDir}
                    onSort={handleSort}
                    className="justify-center"
                  />
                </TableHead>
                <TableHead className="w-75">
                  <SortButton
                    label="TRANSACTION"
                    field="concept"
                    currentSort={filters.sortBy}
                    currentDir={filters.sortDir}
                    onSort={handleSort}
                  />
                </TableHead>
                <TableHead className="text-center hidden sm:table-cell w-44">
                  <SortButton
                    label="CATEGORY"
                    field="category"
                    currentSort={filters.sortBy}
                    currentDir={filters.sortDir}
                    onSort={handleSort}
                    className="justify-center"
                  />
                </TableHead>
                <TableHead className="text-right w-40">
                  <SortButton
                    label="AMOUNT"
                    field="amount"
                    currentSort={filters.sortBy}
                    currentDir={filters.sortDir}
                    onSort={handleSort}
                    className="justify-end"
                  />
                </TableHead>
                <TableHead className="text-right w-16 px-4">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="py-12 text-center text-muted-foreground text-sm"
                  >
                    No expenses match your filters.
                  </TableCell>
                </TableRow>
              ) : (
                expenses.map((expense) => (
                  <ExpenseRow key={expense.id} expense={expense} />
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      <ExpensesTablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

// --- Sort Button (small, stays co-located with the table header) ---

function SortButton({
  label,
  field,
  currentSort,
  currentDir,
  onSort,
  className,
}: {
  label: string;
  field: ExpenseSortField;
  currentSort?: ExpenseSortField;
  currentDir?: SortDirection;
  onSort: (field: ExpenseSortField) => void;
  className?: string;
}) {
  const isActive = currentSort === field;

  return (
    <button
      type="button"
      onClick={() => onSort(field)}
      className={`inline-flex items-center gap-1 text-xs font-medium hover:text-foreground transition-colors ${className ?? ""}`}
    >
      {label}
      {isActive ? (
        currentDir === "asc" ? (
          <ArrowUp className="size-3" />
        ) : (
          <ArrowDown className="size-3" />
        )
      ) : (
        <ArrowUpDown className="size-3 opacity-40" />
      )}
    </button>
  );
}